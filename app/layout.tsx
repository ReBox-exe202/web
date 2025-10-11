import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReBox",
  description: "ReBox - Manage your reusable packaging lifecycle efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body
        className="antialiased"
      >
        {/* Apply theme before React hydrate to avoid DOM/class mismatch */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try{
              const raw = localStorage.getItem('ui-storage');
              if(raw){
                const parsed = JSON.parse(raw);
                if(parsed && parsed.state && parsed.state.theme){
                  document.documentElement.classList.toggle('dark', parsed.state.theme === 'dark');
                }
              }
            }catch(e){}
          })();
        ` }} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
