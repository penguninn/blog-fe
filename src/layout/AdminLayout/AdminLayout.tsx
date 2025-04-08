import Navbar from "@/components/navbar";
import { Outlet } from "react-router-dom";
import Footer from "@/components/footer";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const AdminLayout = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex-1 w-full mt-16 flex gap-3 p-3 sm:p-0">
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full p-5 shadow-sm flex flex-col">
            <SidebarTrigger className="mb-3" />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AdminLayout;
