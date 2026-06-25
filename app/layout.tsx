import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "GrantScout Pro",
  description: "AI-powered grant discovery and writing platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <NavBar />
        <main className="pt-6">{children}</main>
      </body>
    </html>
  );
}
