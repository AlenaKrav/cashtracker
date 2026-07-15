import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets:['latin']})

export const metadata: Metadata = {
  title: "CashTracker",
  description: "Control your budgets in one click",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <h1>Estás en CashTracker</h1>
        {children}
      </body>
    </html>
  );
}
