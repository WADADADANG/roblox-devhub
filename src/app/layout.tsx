import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roblox Engine Wiki | สารานุกรมฟังก์ชันพัฒนาเกม",
  description: "คู่มืออ้างอิงฟังก์ชัน Roblox Engine รองรับ 2 ภาษา (ไทย-อังกฤษ) เน้นใช้งานจริงสำหรับการสร้างเกม รถยนต์ ฟิสิกส์ และเรย์แคสต์",
};

import { ThemeProvider } from "@/lib/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('yt_devhub_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="h-full flex flex-col font-sans selection:bg-[#264F78] selection:text-white overflow-hidden">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
