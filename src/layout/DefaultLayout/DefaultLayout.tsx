import Navbar from "../../components/navbar";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer";

const DefaultLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full mt-16 flex justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
