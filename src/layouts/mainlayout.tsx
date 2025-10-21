import Sidebar from "../components/sidebar/sidebar";
import Header from "../components/header/header";
import type { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="bg-gray-50 min-h-screen">
    <Sidebar />
    <Header />
    <main className="ml-56 mt-16 px-8 py-12">{children}</main>
  </div>
);

export default MainLayout;
