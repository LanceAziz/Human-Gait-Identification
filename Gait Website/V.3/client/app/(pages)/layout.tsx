import Nav from "../(components)/_nav/page";
import Footer from "../(components)/_footer/page";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <div className={`container body-padding`}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
