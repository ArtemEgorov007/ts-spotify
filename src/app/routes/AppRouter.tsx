import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from '@/modules/auth/LandingPage';
import { AppShellLayout } from '@/app/layout/AppShellLayout';
import { HomePage } from '@/modules/shell/HomePage';
import { SearchPage } from '@/modules/shell/SearchPage';
import { LibraryPage } from '@/modules/library/LibraryPage';
import { AdminPage } from '@/modules/admin/AdminPage';
import { RequireAuth } from '@/app/routes/guards';
import { AuthBootstrap } from '@/app/providers/AuthBootstrap';
import { APP_CHILD_ROUTES, APP_ROUTES } from '@/app/config/routes';

export function AppRouter() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthBootstrap>
        <Routes>
          <Route path={APP_ROUTES.landing} element={<LandingPage />} />

          <Route
            path={APP_ROUTES.app}
            element={
              <RequireAuth>
                <AppShellLayout />
              </RequireAuth>
            }
          >
            <Route index element={<HomePage />} />
            <Route path={APP_CHILD_ROUTES.search} element={<SearchPage />} />
            <Route path={APP_CHILD_ROUTES.library} element={<LibraryPage />} />
          </Route>

          <Route
            path={APP_ROUTES.admin}
            element={
              <RequireAuth>
                <AdminPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to={APP_ROUTES.landing} replace />} />
        </Routes>
      </AuthBootstrap>
    </HashRouter>
  );
}
