import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NavBar, Footer } from './components/NavBar';
import HomePage from './pages/HomePage';
import ViewPostPage from './pages/ViewPostPage';
import NotFoundPage from './pages/NotFoundPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminArticlesPage from './pages/admin/AdminArticlesPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminPlaceholderPage from './pages/admin/AdminPlaceholderPage';
import HealthTestPage from './pages/HealthTestPage';
import './App.css';

function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className={`app-root${isAdminRoute ? ' app-root--plain' : ''}`}>
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test-health" element={<HealthTestPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="articles" replace />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route
            path="categories"
            element={(
              <AdminPlaceholderPage
                title="Category management"
                description="UI placeholder — connect to API in the future."
              />
            )}
          />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route
            path="notifications"
            element={(
              <AdminPlaceholderPage
                title="Notification"
                description="UI placeholder — connect to API in the future."
              />
            )}
          />
          <Route
            path="reset-password"
            element={(
              <AdminPlaceholderPage
                title="Reset password"
                description="UI placeholder — connect to API in the future."
              />
            )}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
