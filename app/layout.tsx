import "./globals.css";
import Navbar from "./ui/navbar/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-main">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
