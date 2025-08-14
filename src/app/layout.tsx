import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BuscaProvider } from "./context/BuscaContext";
import { ToastProvider } from "./context/ToastContext";
import ToastViewport from "./components/ToastViewport";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CondutaPlus - Sul América",
  description: "SulAmérica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          <BuscaProvider>
            {children}
            <ToastViewport />
          </BuscaProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
