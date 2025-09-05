import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "@/guards/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const PostDetails = lazy(() => import("./pages/PostDetails"));
const ListPost = lazy(() => import("./pages/ListPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const ProfileEditPage = lazy(() => import("./pages/ProfileEditPage"));

const DashPost = lazy(() => import("./pages/DashPost"));
const EditorPost = lazy(() => import("./pages/EditorPost"));

const DashCategory = lazy(() => import("./pages/DashCategory"));
const CategoryEditor = lazy(() => import("./pages/EditorCategory"));

const DashTag = lazy(() => import("./pages/DashTag"));
const TagEditor = lazy(() => import("./pages/EditorTag"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    Loading...
  </div>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          element={
            <ProtectedRoute requireAuth>
              <DefaultLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/profile/edit" element={<ProfileEditPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={["admin"]} requireAuth>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<DashPost />} />

          <Route path="/admin/posts" element={<DashPost />} />
          <Route path="/admin/posts/create" element={<EditorPost />} />
          <Route path="/admin/posts/:id/edit" element={<EditorPost />} />

          <Route path="/admin/categories" element={<DashCategory />} />
          <Route path="/admin/categories/create" element={<CategoryEditor />} />
          <Route
            path="/admin/categories/:id/edit"
            element={<CategoryEditor />}
          />

          <Route path="/admin/tags" element={<DashTag />} />
          <Route path="/admin/tags/create" element={<TagEditor />} />
          <Route path="/admin/tags/:id/edit" element={<TagEditor />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
