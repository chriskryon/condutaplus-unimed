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
  title: "CondutaPlus - Unimed",
  description: "Unimed",
  openGraph: {
    title: 'CondutaPlus - Unimed',
    description: 'Comparativo de Redes Credenciadas Unimed',
    images: '/og-image.jpeg',  // Ruta relativa a /public
    type: 'website',
    locale: 'pt_BR',  // Opcional, para español
  },
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
