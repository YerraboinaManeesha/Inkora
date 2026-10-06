import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import PublicLayout from './components/PublicLayout';
import { ProtectedRoute, AdminRoute, GuestOnlyRoute } from './components/RouteGuards';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import AdminLayout from './pages/admin/AdminLayout';
import Overview from './pages/admin/Overview';
import ArticlesManage from './pages/admin/ArticlesManage';
import ArticleForm from './pages/admin/ArticleForm';
import CategoriesManage from './pages/admin/CategoriesManage';
import UsersManage from './pages/admin/UsersManage';
import LikesManage from './pages/admin/LikesManage';
import CommentsManage from './pages/admin/CommentsManage';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/auth"
                element={
                  <GuestOnlyRoute>
                    <AuthPage />
                  </GuestOnlyRoute>
                }
              />
              <Route
                path="/articles"
                element={
                  <ProtectedRoute>
                    <ArticlesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/articles/:slug"
                element={
                  <ProtectedRoute>
                    <ArticleDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="articles" element={<ArticlesManage />} />
              <Route path="articles/new" element={<ArticleForm />} />
              <Route path="articles/:id/edit" element={<ArticleForm />} />
              <Route path="categories" element={<CategoriesManage />} />
              <Route path="users" element={<UsersManage />} />
              <Route path="likes" element={<LikesManage />} />
              <Route path="comments" element={<CommentsManage />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
