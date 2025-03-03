import type { Metadata } from "next";
import "./globals.css";
import Footer from "./_components/layout/Footer";


export const metadata: Metadata = {
  title: "아트자석",
  description: "아트자석 자석 판촉물",

};

export default async function  RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
