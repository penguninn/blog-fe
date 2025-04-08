import { Route, Routes } from "react-router-dom";
import Font from "./components/font";
import Home from "./pages/Home";
import DefaultLayout from "./layout/DefaultLayout";
import AdminLayout from "./layout/AdminLayout";
import { DashPost, PostDetails, DashCategory, EditorCategory, EditorPost, DashTag, EditorTag, ListPost } from "./pages";
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Signin from "./pages/Signin";

function App() {
  return (
    <AuthProvider>
      <div className="w-full transition-colors duration-100">
        <Font />
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:slug" element={<PostDetails />} />
            <Route path="/posts" element={<ListPost />} />
            <Route path="/posts/top-posts" element={<ListPost />} />
            <Route path="/posts/new-posts" element={<ListPost />} />
            <Route path="/category/:id" element={<ListPost />} />
            <Route path="/tag/:id" element={<ListPost />} />
          </Route>
          <Route path="/login" element={<Signin />} />
          <Route element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin" element={<DashPost />} />
            <Route path="/admin/posts" element={<DashPost />} />
            <Route path="/admin/posts/create" element={<EditorPost />} />
            <Route path="/admin/posts/:id/edit" element={<EditorPost />} />
            <Route path="/admin/categories" element={<DashCategory />} />
            <Route path="/admin/categories/create" element={<EditorCategory />} />
            <Route path="/admin/categories/:id/edit" element={<EditorCategory />} />
            <Route path="/admin/tags" element={<DashTag />} />
            <Route path="/admin/tags/create" element={<EditorTag />} />
            <Route path="/admin/tags/:id/edit" element={<EditorTag />} />
          </Route>
        </Routes>
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
