// Notion API 클라이언트 모듈
// 서버 사이드 전용 - 브라우저에서 직접 호출하지 마세요
// Next.js Server Component 또는 Server Action에서만 사용합니다

import { Client, isFullPage } from "@notionhq/client";
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { unstable_cache } from "next/cache";
import { z } from "zod";

// 환경변수 스키마 검증 - 필수 환경변수가 없으면 초기화 단계에서 명확한 에러 메시지 반환
const envSchema = z.object({
  NOTION_TOKEN: z
    .string({ message: "NOTION_TOKEN이 설정되지 않았습니다" })
    .min(1, "NOTION_TOKEN이 설정되지 않았습니다"),
  NOTION_DATABASE_ID: z
    .string({ message: "NOTION_DATABASE_ID가 설정되지 않았습니다" })
    .min(1, "NOTION_DATABASE_ID가 설정되지 않았습니다"),
});

// 견적 항목 타입 (Items 데이터베이스의 각 행 구조)
export interface InvoiceItem {
  id: string;        // Notion 페이지 ID
  description: string; // 항목명
  quantity: number;  // 수량
  unitPrice: number; // 단가
  amount: number;    // 소계 (수량 × 단가)
}

// 견적서 타입 (메인 데이터베이스의 각 페이지 구조)
export interface Invoice {
  id: string;         // Notion 페이지 ID
  title: string;      // 견적서 번호
  clientName: string; // 클라이언트명
  issuerName: string; // 발행사명 (현재 미사용)
  issueDate: string;  // 발행일 (ISO 8601 형식)
  dueDate: string;    // 지급 기한 (ISO 8601 형식)
  status: string;     // 상태 (예: "발행됨", "완료")
  totalAmount: number; // 합계 금액 (원)
  items: InvoiceItem[]; // 견적 항목 목록
  notes: string;      // 메모
}

// Notion 클라이언트 초기화 (요청마다 새로 생성, 서버 사이드 전용)
// 매 요청마다 생성하는 이유: Next.js Server Component의 요청 범위 내에서 안전하게 사용하기 위해
function getNotionClient(): { client: Client; databaseId: string } {
  // 환경변수 검증 - 실패 시 구체적인 오류 메시지 포함하여 throw
  const env = envSchema.safeParse({
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  });

  if (!env.success) {
    const messages = env.error.issues.map((issue) => issue.message).join(", ");
    throw new Error(messages);
  }

  return {
    client: new Client({ auth: env.data.NOTION_TOKEN }),
    databaseId: env.data.NOTION_DATABASE_ID,
  };
}

// rich_text 배열에서 순수 텍스트 추출 헬퍼
// Notion의 rich_text 필드는 서식 정보를 포함한 배열로 반환되므로 plain_text만 연결합니다
function extractRichText(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join("");
}

// Notion 페이지 프로퍼티에서 Invoice 객체를 생성합니다
// Notion 데이터베이스 필드명은 한국어/영어 양쪽을 지원합니다 (예: "클라이언트" 또는 "Client")
function extractInvoiceFromPage(page: PageObjectResponse): Invoice {
  const props = page.properties;

  // 견적서 번호 추출: title 타입 또는 rich_text 타입 필드를 모두 지원
  // "견적서 번호" → "Invoice Number" → "title" 순서로 찾아서 사용합니다
  const getTitle = (): string => {
    const titleProp =
      props["견적서 번호"] ?? props["Invoice Number"] ?? props["title"];
    if (titleProp?.type === "title") return extractRichText(titleProp.title);
    if (titleProp?.type === "rich_text")
      return extractRichText(titleProp.rich_text);
    return "";
  };

  // rich_text 타입 필드에서 텍스트 추출
  // 인자로 받은 키 이름들을 순서대로 탐색하여 첫 번째로 존재하는 필드 값을 반환합니다
  const getText = (...keys: string[]): string => {
    for (const key of keys) {
      const prop = props[key];
      if (prop?.type === "rich_text") return extractRichText(prop.rich_text);
    }
    return "";
  };

  // date 타입 필드에서 시작 날짜(start)를 추출합니다
  // Notion 날짜 필드는 start/end 범위를 가질 수 있으나 여기서는 start만 사용합니다
  const getDate = (...keys: string[]): string => {
    for (const key of keys) {
      const prop = props[key];
      if (prop?.type === "date") return prop.date?.start ?? "";
    }
    return "";
  };

  // number 타입 필드에서 숫자를 추출합니다
  // null인 경우 0으로 기본값 처리합니다
  const getNumber = (...keys: string[]): number => {
    for (const key of keys) {
      const prop = props[key];
      if (prop?.type === "number") return prop.number ?? 0;
    }
    return 0;
  };

  // select 타입 필드에서 선택된 옵션 이름을 추출합니다
  // 선택하지 않은 경우 빈 문자열을 반환합니다
  const getSelect = (...keys: string[]): string => {
    for (const key of keys) {
      const prop = props[key];
      if (prop?.type === "select") return prop.select?.name ?? "";
    }
    return "";
  };

  return {
    id: page.id,
    title: getTitle(),
    clientName: getText("클라이언트", "Client"),
    issuerName: "", // 발행사 필드는 현재 사용하지 않음
    issueDate: getDate("발행일", "Issue Date"),
    dueDate: getDate("지급 기한", "Due Date"),
    status: getSelect("상태", "Status"),
    totalAmount: getNumber("합계", "Total"),
    items: [], // Items Relation은 getInvoice()에서 별도로 조회합니다
    notes: getText("메모", "Notes"),
  };
}

// Notion search API를 사용하여 견적서 목록을 조회하는 내부 함수
// search API를 사용하는 이유: 데이터베이스 query API 대비 페이지 메타데이터를 더 빠르게 가져올 수 있음
async function fetchInvoicesFromNotion(): Promise<Invoice[]> {
  const { client, databaseId } = getNotionClient();

  // Notion search API: 현재 인증 토큰이 접근 가능한 모든 페이지를 검색합니다
  // 수정 시간 내림차순 정렬로 최근 견적서가 위에 표시됩니다
  const response = await client.search({
    filter: {
      value: "page",
      property: "object",
    },
    sort: {
      direction: "descending",
      timestamp: "last_edited_time",
    },
  });

  // search API는 접근 가능한 모든 페이지를 반환하므로,
  // 대상 데이터베이스에 속한 페이지만 parent.database_id로 필터링합니다
  const pages = response.results
    .filter(isFullPage) // 전체 페이지 응답만 (partial 제외)
    .filter((page) => {
      const parent = page.parent;
      // 데이터베이스 하위 페이지이고, ID가 대상 데이터베이스와 일치하는지 확인
      return (
        parent.type === "database_id" &&
        parent.database_id === databaseId
      );
    });

  // 각 페이지 객체를 Invoice 타입으로 변환하여 반환
  return pages.map(extractInvoiceFromPage);
}

// unstable_cache를 활용하여 5분(300초) 동안 결과를 캐싱합니다
// "invoices" 태그로 캐시를 그룹화하여 필요 시 revalidateTag("invoices")로 갱신 가능
const getCachedInvoices = unstable_cache(
  fetchInvoicesFromNotion,
  ["getInvoices"],
  { revalidate: 300, tags: ["invoices"] }
);

// 견적서 목록 조회 (캐싱 적용)
// 5분 이내 동일한 요청은 캐시된 결과를 반환하여 Notion API 호출 횟수를 줄입니다
export async function getInvoices(): Promise<Invoice[]> {
  return getCachedInvoices();
}

// Items Relation 필드에서 견적 항목 목록을 추출합니다
// 각 relation ID를 통해 연결된 Items 데이터베이스 페이지를 개별 조회합니다
//
// 처리 흐름:
//   1. relation 배열에서 연결된 아이템 페이지 ID 목록을 추출합니다
//   2. 각 ID로 Notion pages.retrieve() API를 호출합니다
//   3. 페이지 프로퍼티에서 항목명, 수량, 단가를 추출합니다
//   4. 소계(수량 × 단가)를 계산하여 InvoiceItem 객체를 생성합니다
//   5. 조회 실패한 항목은 조용히 건너뜁니다 (부분 실패 허용)
async function extractItemsFromRelation(
  client: Client,
  itemsRelationProp: PageObjectResponse["properties"][string] | undefined
): Promise<InvoiceItem[]> {
  const items: InvoiceItem[] = [];

  // relation 타입이 아니면 빈 배열 반환 (타입 내로잉으로 any 없이 처리)
  if (!itemsRelationProp || itemsRelationProp.type !== "relation") {
    return items;
  }

  // relation 배열에서 연결된 페이지 ID 목록 추출
  const itemIds = itemsRelationProp.relation.map((rel) => rel.id);

  for (let index = 0; index < itemIds.length; index++) {
    try {
      // 연결된 Items 데이터베이스 페이지 조회
      const itemPage = await client.pages.retrieve({
        page_id: itemIds[index],
      });

      // 전체 페이지 응답이 아닌 경우 건너뜀 (isFullPage 타입 가드)
      if (!isFullPage(itemPage)) continue;

      const props = itemPage.properties;

      // 항목명 추출: Items 데이터베이스의 Title 필드
      // "항목명" → "Item Name" → "title" 순서로 탐색합니다
      const getItemTitle = (): string => {
        const titleProp =
          props["항목명"] ?? props["Item Name"] ?? props["title"];
        if (titleProp?.type === "title") return extractRichText(titleProp.title);
        if (titleProp?.type === "rich_text")
          return extractRichText(titleProp.rich_text);
        return "";
      };

      // number 타입 필드에서 숫자 추출 (없으면 0)
      const getNumber = (...keys: string[]): number => {
        for (const key of keys) {
          const prop = props[key];
          if (prop?.type === "number") return prop.number ?? 0;
        }
        return 0;
      };

      const description = getItemTitle();
      const quantity = getNumber("수량", "Quantity");
      const unitPrice = getNumber("단가", "Unit Price");
      // 소계 계산: Notion에서 수식으로 계산되지 않은 경우를 대비하여 직접 계산
      const amount = quantity * unitPrice;

      items.push({
        id: itemIds[index],
        description,
        quantity,
        unitPrice,
        amount,
      });
    } catch {
      // 개별 항목 조회 실패 시 해당 항목만 건너뛰고 계속 진행
      // (네트워크 오류, 권한 없음 등으로 인한 부분 실패 허용)
      continue;
    }
  }

  return items;
}

// 견적서 단건 조회
// 주어진 ID로 Notion 페이지를 조회하고, Items Relation을 통해 견적 항목까지 가져옵니다
// 페이지가 없거나 조회 실패 시 null을 반환합니다 (not-found 처리는 호출부에서)
export async function getInvoice(id: string): Promise<Invoice | null> {
  const { client } = getNotionClient();

  try {
    // 견적서 메인 페이지 조회
    const page = await client.pages.retrieve({ page_id: id });

    // 전체 페이지 응답이 아닌 경우 null 반환 (삭제된 페이지 등)
    if (!isFullPage(page)) return null;

    // 페이지 프로퍼티에서 기본 견적서 데이터 추출 (items는 비어 있는 상태)
    const invoice = extractInvoiceFromPage(page);

    // Items Relation 필드 탐색: 한국어/영어 필드명 모두 지원
    const itemsRelationProp =
      page.properties["Items"] ?? page.properties["항목"];

    // Relation에 연결된 항목 페이지들을 개별 조회하여 배열로 변환
    const items = await extractItemsFromRelation(client, itemsRelationProp);

    // 기본 견적서 데이터와 항목 목록을 합쳐서 반환
    return { ...invoice, items };
  } catch {
    // 페이지 ID가 유효하지 않거나 접근 권한이 없는 경우 null 반환
    return null;
  }
}
