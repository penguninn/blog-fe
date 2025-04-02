import Navbar from "../../components/navbar";
import { Outlet } from "react-router-dom";
import Footer from "../../components/footer";
const DefaultLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="w-full mt-16 flex justify-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
