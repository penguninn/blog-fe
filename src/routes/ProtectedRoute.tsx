// import { ReactNode } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuthContext } from '../providers/AuthProvider';

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { isAuthenticated, isLoading } = useAuthContext();
//   const location = useLocation();

//   // Đang tải thông tin xác thực, hiển thị loading
//   if (isLoading) {
//     return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
//   }

//   // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   }

//   // Đã đăng nhập, hiển thị nội dung bảo vệ
//   return <>{children}</>;
// } 