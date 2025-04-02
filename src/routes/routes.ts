import { lazy } from 'react';

// Pages
const Home = lazy(() => import('../pages/Home'));
// const Login = lazy(() => import('../pages/Login'));
// const Register = lazy(() => import('../pages/Register'));
const PostDetails = lazy(() => import('../pages/PostDetails'));
const NewPost = lazy(() => import('../pages/EditorPost'));
const EditPost = lazy(() => import('../pages/EditPost'));
// const Dashboard = lazy(() => import('../pages/Dashboard'));
// const Categories = lazy(() => import('../pages/Categories'));
// const Tags = lazy(() => import('../pages/Tags'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));
const DashPost = lazy(() => import('../pages/DashPost'));
const DashUser = lazy(() => import('../pages/DashUser'));

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  auth?: boolean; // Yêu cầu đăng nhập
  admin?: boolean; // Yêu cầu quyền admin
  layout?: string; // Layout sẽ sử dụng (nếu cần)
}

export const PUBLIC_ROUTES: RouteConfig[] = [
  {
    path: '/',
    component: Home
  },
  // {
  //   path: '/login',
  //   component: Login
  // },
  // {
  //   path: '/register',
  //   component: Register
  // },
  {
    path: '/posts/:slug',
    component: PostDetails
  },
  {
    path: '*',
    component: NotFound
  }
];

export const PROTECTED_ROUTES: RouteConfig[] = [
  {
    path: '/profile',
    component: Profile,
    auth: true
  }
];

export const ADMIN_ROUTES: RouteConfig[] = [
  {
    path: '/admin',
    component: DashPost,
    auth: true,
    admin: true
  },
  {
    path: '/admin',
    component: DashUser,
    auth: true,
    admin: true
  },
  {
    path: '/admin/posts/new',
    component: NewPost,
    auth: true,
    admin: true
  },
  {
    path: '/admin/posts/:id/edit',
    component: EditPost,
    auth: true,
    admin: true
  },
  // {
  //   path: '/admin/categories',
  //   component: Categories,
  //   auth: true,
  //   admin: true
  // },
  // {
  //   path: '/admin/tags',
  //   component: Tags,
  //   auth: true,
  //   admin: true
  // }
];

export const ALL_ROUTES = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES, ...ADMIN_ROUTES]; 