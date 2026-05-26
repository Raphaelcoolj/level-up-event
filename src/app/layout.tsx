import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Level Up | Skill-Up Orientation",
  description: "A premier skill-up orientation designed to equip you with the high-income skills needed for the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
