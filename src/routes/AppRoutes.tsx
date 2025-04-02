// import { Suspense } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { ADMIN_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from './routes';
// import ProtectedRoute from './ProtectedRoute';
// import AdminRoute from './AdminRoute';

// export default function AppRoutes() {
//   return (
//     <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Đang tải...</div>}>
//       <Routes>
//         {/* Routes công khai */}
//         {PUBLIC_ROUTES.map((route) => (
//           <Route
//             key={route.path}
//             path={route.path}
//             element={<route.component />}
//           />
//         ))}

//         {/* Routes bảo vệ (yêu cầu đăng nhập) */}
//         {PROTECTED_ROUTES.map((route) => (
//           <Route
//             key={route.path}
//             path={route.path}
//             element={
//               <ProtectedRoute>
//                 <route.component />
//               </ProtectedRoute>
//             }
//           />
//         ))}

//         {/* Routes admin (yêu cầu quyền admin) */}
//         {ADMIN_ROUTES.map((route) => (
//           <Route
//             key={route.path}
//             path={route.path}
//             element={
//               <AdminRoute>
//                 <route.component />
//               </AdminRoute>
//             }
//           />
//         ))}
//       </Routes>
//     </Suspense>
//   );
// } 