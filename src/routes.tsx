import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load các module theo chức năng
// Auth
const Signin = lazy(() => import("./pages/Signin"));

// Public pages
const Home = lazy(() => import("./pages/Home"));
const PostDetails = lazy(() => import("./pages/PostDetails"));
const ListPost = lazy(() => import("./pages/ListPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages - Posts
const DashPost = lazy(() => import("./pages/DashPost"));
const EditorPost = lazy(() => import("./pages/EditorPost"));

// Admin pages - Categories
const DashCategory = lazy(() => import("./pages/DashCategory"));
const EditorCategory = lazy(() => import("./pages/EditorCategory"));

// Admin pages - Tags
const DashTag = lazy(() => import("./pages/DashTag"));
const EditorTag = lazy(() => import("./pages/EditorTag"));

// Fallback khi đang tải component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">Loading...</div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:slug" element={<PostDetails />} />
          <Route path="/posts" element={<ListPost />} />
          <Route path="/posts/top-posts" element={<ListPost />} />
          <Route path="/posts/new-posts" element={<ListPost />} />
          <Route path="/category/:id" element={<ListPost />} />
          <Route path="/tag/:id" element={<ListPost />} />
          {/* 404 Route - đặt ở cuối routes của DefaultLayout */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/login" element={<Signin />} />
        
        {/* Admin Routes - Protected */}
        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin" element={<DashPost />} />
          
          {/* Posts Management */}
          <Route path="/admin/posts" element={<DashPost />} />
          <Route path="/admin/posts/create" element={<EditorPost />} />
          <Route path="/admin/posts/:id/edit" element={<EditorPost />} />
          
          {/* Categories Management */}
          <Route path="/admin/categories" element={<DashCategory />} />
          <Route path="/admin/categories/create" element={<EditorCategory />} />
          <Route path="/admin/categories/:id/edit" element={<EditorCategory />} />
          
          {/* Tags Management */}
          <Route path="/admin/tags" element={<DashTag />} />
          <Route path="/admin/tags/create" element={<EditorTag />} />
          <Route path="/admin/tags/:id/edit" element={<EditorTag />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 