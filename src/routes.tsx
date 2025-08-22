import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const Signin = lazy(() => import("./pages/Signin"));

const Home = lazy(() => import("./pages/Home"));
const PostDetails = lazy(() => import("./pages/PostDetails"));
const ListPost = lazy(() => import("./pages/ListPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

const DashPost = lazy(() => import("./pages/DashPost"));
const EditorPost = lazy(() => import("./pages/EditorPost"));

const DashCategory = lazy(() => import("./pages/DashCategory"));
const CategoryEditor = lazy(() => import("./pages/EditorCategory"));

const DashTag = lazy(() => import("./pages/DashTag"));
const TagEditor = lazy(() => import("./pages/EditorTag"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">Loading...</div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>

        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:slug" element={<PostDetails />} />
          <Route path="/posts" element={<ListPost />} />
          <Route path="/posts/top-posts" element={<ListPost />} />
          <Route path="/posts/new-posts" element={<ListPost />} />
          <Route path="/category/:id" element={<ListPost />} />
          <Route path="/tag/:id" element={<ListPost />} />
          <Route path="*" element={<NotFound />} />
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
          <Route path="/admin/categories/create" element={<CategoryEditor />} />
          <Route path="/admin/categories/:id/edit" element={<CategoryEditor />} />
          
          <Route path="/admin/tags" element={<DashTag />} />
          <Route path="/admin/tags/create" element={<TagEditor />} />
          <Route path="/admin/tags/:id/edit" element={<TagEditor />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 