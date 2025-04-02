// import { ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuthContext } from '../providers/AuthProvider';
// import ProtectedRoute from './ProtectedRoute';

// interface AdminRouteProps {
//   children: ReactNode;
// }

// export default function AdminRoute({ children }: AdminRouteProps) {
//   const { user } = useAuthContext();

//   return (
//     <ProtectedRoute>
//       {user?.role === 'ADMIN' ? (
//         // Người dùng có quyền admin, hiển thị nội dung
//         <>{children}</>
//       ) : (
//         // Không có quyền admin, chuyển hướng về trang chủ
//         <Navigate to="/" replace />
//       )}
//     </ProtectedRoute>
//   );
// } 