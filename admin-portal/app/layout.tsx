'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen bg-[#f8f9fa]">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {!isLoginPage && <Header />}
            <main className={`flex-1 overflow-y-auto ${isLoginPage ? '' : 'p-6'}`}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
