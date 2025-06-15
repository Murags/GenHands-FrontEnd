import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';

// Layouts
import PageLayout from '../components/layout/PageLayout';
import DashboardLayout from '../components/dashboard/DashboardLayout';

// Pages
import HomePage from '../pages/HomePage/HomePage';
import ApiStatusPage from '../pages/ApiStatusPage/ApiStatusPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import DashboardOverviewPage from '../pages/DashboardPage/DashboardOverviewPage';
import DashboardNotFoundPage from '../pages/DashboardPage/DashboardNotFoundPage';
import DashboardVolunteersPage from '../pages/DashboardPage/DashboardVolunteersPage';
import DashboardCharitiesPage from '../pages/DashboardPage/DashboardCharitiesPage';
import VolunteerDashboard from '../pages/VolunteerDashboard';
import DonationSubmission from '../pages/DonationSubmission';
import RoleSelectPage from '../pages/AuthPage/RoleSelectPage/RoleSelectPage';
import DonorSignUpPage from '../pages/AuthPage/SignUpPage/DonorSignUpPage';
import CharitySignUpPage from '../pages/AuthPage/SignUpPage/CharitySignUpPage';
import VolunteerSignUpPage from '../pages/AuthPage/SignUpPage/VolunteerSignUpPage';
import SignInPage from '../pages/AuthPage/SignInPage/SignInPage';

// serves as the layout for all /admin routes
const AdminLayout = () => (
  <DashboardLayout>
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
            <VolunteerDashboard />
        }
      />

      <Route
        path="/donate"
        element={
            <DonationSubmission />
        }
      />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardOverviewPage />} />
        <Route path="users/volunteers" element={<DashboardVolunteersPage />} />
        <Route path="users/charities" element={<DashboardCharitiesPage />} />
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
