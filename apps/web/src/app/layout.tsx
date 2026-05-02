import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const themeScript = `
(() => {
  try {
    const storedTheme = localStorage.getItem("trosky:theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = storedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {}
})();
`;

export const metadata: Metadata = {
  title: "Trosky",
  description: "AI-powered hotel revenue management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
