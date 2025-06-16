import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';

// Layouts
import PageLayout from '../components/layout/PageLayout';
import DashboardLayout from '../components/dashboard/DashboardLayout';

// Components
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Pages
import HomePage from '../pages/HomePage/HomePage';
import ApiStatusPage from '../pages/ApiStatusPage/ApiStatusPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import DashboardOverviewPage from '../pages/DashboardPage/DashboardOverviewPage';
import DashboardNotFoundPage from '../pages/DashboardPage/DashboardNotFoundPage';
import DashboardVolunteersPage from '../pages/DashboardPage/DashboardVolunteersPage';
import DashboardCharitiesPage from '../pages/DashboardPage/DashboardCharitiesPage';
import DashboardCategoriesPage from '../pages/DashboardPage/DashboardCategoriesPage';
import VolunteerDashboard from '../pages/VolunteerDashboard';
import ActivePickups from '../pages/ActivePickups';
import CharityDashboard from '../pages/CharityDashboard';
import DonationSubmission from '../pages/DonationSubmission';
import RoleSelectPage from '../pages/AuthPage/RoleSelectPage/RoleSelectPage';
import DonorSignUpPage from '../pages/AuthPage/SignUpPage/DonorSignUpPage';
import CharitySignUpPage from '../pages/AuthPage/SignUpPage/CharitySignUpPage';
import VolunteerSignUpPage from '../pages/AuthPage/SignUpPage/VolunteerSignUpPage';
import SignInPage from '../pages/AuthPage/SignInPage/SignInPage';

const AdminLayout = () => (
  <DashboardLayout role="admin">
    <Outlet />
  </DashboardLayout>
);

const CharityLayout = () => (
  <DashboardLayout role="charity">
    <Outlet />
  </DashboardLayout>
);

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageLayout>
            <HomePage />
          </PageLayout>
        }
      />
      <Route
        path="/apiStatus"
        element={
          <PageLayout>
            <ApiStatusPage />
          </PageLayout>
        }
      />

      <Route
        path="/volunteer"
        element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteer/active-pickups"
        element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <ActivePickups />
          </ProtectedRoute>
        }
      />

      <Route path="/charity" element={<ProtectedRoute allowedRoles={['charity']}><CharityLayout /></ProtectedRoute>}>
        <Route index element={<CharityDashboard />} />
        <Route path="requirements" element={<DashboardNotFoundPage />} />
        <Route path="donations" element={<DashboardNotFoundPage />} />
        <Route path="tracking" element={<DashboardNotFoundPage />} />
        <Route path="thank-you" element={<DashboardNotFoundPage />} />
        <Route path="reports" element={<DashboardNotFoundPage />} />
        <Route path="profile" element={<DashboardNotFoundPage />} />
        <Route path="settings" element={<DashboardNotFoundPage />} />
        <Route path="*" element={<DashboardNotFoundPage />} />
      </Route>

      <Route
        path="/donate"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonationSubmission />
          </ProtectedRoute>
        }
      />

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardOverviewPage />} />
        <Route path="users/volunteers" element={<DashboardVolunteersPage />} />
        <Route path="users/charities" element={<DashboardCharitiesPage />} />
        <Route path="items/categories" element={<DashboardCategoriesPage />} />
        <Route path="*" element={<DashboardNotFoundPage />} />
      </Route>

      {/*
      <Route
        path="/about"
        element={
          <PageLayout>
            <AboutPage />
          </PageLayout>
        }
      />
      */}

      <Route
        path="/auth/select"
        element={
          <RoleSelectPage />
        }
      />
      <Route
        path="/auth/signup/donor"
        element={
            <DonorSignUpPage />
        }
      />
      <Route
        path="/auth/signup/charity"
        element={
          <CharitySignUpPage />
        }
      />
      <Route
        path="/auth/signup/volunteer"
        element={
          <VolunteerSignUpPage />
        }
      />
      <Route
        path="/auth/signin"
        element={
          <SignInPage />
        }
      />

      <Route
        path="*"
        element={
          <PageLayout>
            <NotFoundPage />
          </PageLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
