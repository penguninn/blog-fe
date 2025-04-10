import Font from "./components/font";
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes";

function App() {
  return (
    <AuthProvider>
      <div className="w-full transition-colors duration-100">
        <Font />
        <AppRoutes />
        <Toaster
          theme="light"
          richColors
          duration={2000}
          toastOptions={{
            classNames: {
              success: "bg-green-500 text-white border-green-600",
              error: "bg-red-500 text-white border-red-600",
              warning: "bg-yellow-500 text-white border-yellow-600",
              info: "bg-blue-500 text-white border-blue-600",
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
