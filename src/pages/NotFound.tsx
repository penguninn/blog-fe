import { useTitle } from "@/hooks";

const NotFound = () => {
  // Set page title
  useTitle("Page not found");
  
  return (
    <div className="w-full flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">Page not found</h1>
    </div>
  );
};

export default NotFound;
