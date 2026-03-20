import type { Metadata } from "next";
import "../styles/index.css";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "LegalEase — AI Contract Analyzer",
  description:
    "Upload any contract and get instant AI-powered risk analysis with severity scoring, real-world consequences, and multi-language support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
