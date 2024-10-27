import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/sidebars/Sidebar";
import TopNav from "@/components/sidebars/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anime Track",
  description: "",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { session?: any }; // Adjust type as per your session structure
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={params.session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <TopNav />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
