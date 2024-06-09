import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import localFont from "next/font/local";

const poppins = localFont({
  src: [
    { path: '../public/fonts/Poppins/Poppins-Bold.ttf'},
    { path: '../public/fonts/Poppins/Poppins-Regular.ttf'},
  ],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Gait",
  description: "Created By: Lance Aziz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        {children}
      </body>
    </html>
  );
}
