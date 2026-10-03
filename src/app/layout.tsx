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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="h-full flex flex-col bg-[#080B11] text-slate-100 font-sans selection:bg-[#00F5D4]/20 selection:text-[#00F5D4] overflow-hidden">
        {children}
      </body>
    </html>
  );
}
