import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NavBar, Footer } from './components/NavBar';
import HomePage from './pages/HomePage';
import ViewPostPage from './pages/ViewPostPage';
import NotFoundPage from './pages/NotFoundPage';
import SignUpPage from './pages/SignUpPage';
import SignUpSuccessPage from './pages/SignUpSuccessPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminArticlesPage from './pages/admin/AdminArticlesPage';
import AdminCreateArticlePage from './pages/admin/AdminCreateArticlePage';
import AdminEditArticlePage from './pages/admin/AdminEditArticlePage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminResetPasswordPage from './pages/admin/AdminResetPasswordPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCreateCategoryPage from './pages/admin/AdminCreateCategoryPage';
import AdminEditCategoryPage from './pages/admin/AdminEditCategoryPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import MemberLayout from './components/member/MemberLayout';
import MemberProfilePage from './pages/member/MemberProfilePage';
import MemberResetPasswordPage from './pages/member/MemberResetPasswordPage';
import HealthTestPage from './pages/HealthTestPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const { pathname } = useLocation();
  const isPlainRoute = pathname.startsWith('/admin') || pathname.startsWith('/member');

  return (
    <div className={`app-root${isPlainRoute ? ' app-root--plain' : ''}`}>
      <Routes>
        <Route
          path="/"
          element={(
            <>
              <NavBar />
              <HomePage />
              <Footer />
            </>
          )}
        />
        <Route path="/post/:postId" element={<ViewPostPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/success" element={<SignUpSuccessPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test-health" element={<HealthTestPage />} />

        <Route
          path="/member"
          element={(
            <ProtectedRoute>
              <MemberLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<MemberProfilePage />} />
          <Route path="reset-password" element={<MemberResetPasswordPage />} />
        </Route>

        <Route
          path="/admin"
          element={(
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<Navigate to="articles" replace />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="articles/create" element={<AdminCreateArticlePage />} />
          <Route path="articles/:articleId/edit" element={<AdminEditArticlePage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="categories/create" element={<AdminCreateCategoryPage />} />
          <Route path="categories/:categoryId/edit" element={<AdminEditCategoryPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="reset-password" element={<AdminResetPasswordPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
