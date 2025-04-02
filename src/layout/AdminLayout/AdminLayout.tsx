import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {

  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full h-full mt-16 flex gap-3 p-3 sm:p-0">
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full p-5 shadow-sm">
            <SidebarTrigger className="mb-3" />
            <Outlet />
            <Footer />
          </div>
        </SidebarProvider>
      </div>
      
    </div>
  );
};

export default AdminLayout;
