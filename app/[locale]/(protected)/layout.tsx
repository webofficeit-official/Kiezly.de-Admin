'use client'
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/private/Navbar";
import Sidebar from "@/components/layout/private/Sidebar";
import { useState } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="p-4 sm:ml-64">
        {children}

        <Footer />
      </div>
    </>
  );
}
