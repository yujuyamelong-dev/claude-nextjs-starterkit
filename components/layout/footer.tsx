export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} Invoice Web. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
