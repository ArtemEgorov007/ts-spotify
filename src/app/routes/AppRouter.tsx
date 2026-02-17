import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from '@/modules/auth/LandingPage';
import { AppShellLayout } from '@/app/layout/AppShellLayout';
import { HomePage } from '@/modules/shell/HomePage';
import { SearchPage } from '@/modules/shell/SearchPage';
import { LibraryPage } from '@/modules/library/LibraryPage';
import { AdminPage } from '@/modules/admin/AdminPage';
import { RequireAuth } from '@/app/routes/guards';
import { AuthSessionSync } from '@/app/providers/AuthSessionSync';

export function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthSessionSync>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppShellLayout />
              </RequireAuth>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="library" element={<LibraryPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthSessionSync>
    </BrowserRouter>
  );
}
