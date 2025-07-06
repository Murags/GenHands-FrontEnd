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
import AdminReportsPage from '../pages/DashboardPage/AdminReportsPage';
import DashboardSettingsPage from '../pages/DashboardPage/DashboardSettingsPage';
import DonorDashboard from '../pages/DonorDashboard';
import CharityDetailsPage from '../pages/DonorDashboard/components/CharityDetailsPage';
import VolunteerDashboard from '../pages/VolunteerDashboard';
import ActivePickups from '../pages/ActivePickups';
import CharityDashboard from '../pages/CharityDashboard';
import RequirementsPage from '../pages/CharityDashboard/RequirementsPage';
import AllDonationsPage from '../pages/CharityDashboard/AllDonationsPage';
import IncomingDonationsPage from '../pages/CharityDashboard/IncomingDonationsPage';
import ThankYouNotesPage from '../pages/CharityDashboard/ThankYouNotesPage';
import OrganisationProfilePage from '../pages/CharityDashboard/OrganisationProfilePage';
import DonationSubmission from '../pages/DonationSubmission';
import RoleSelectPage from '../pages/AuthPage/RoleSelectPage/RoleSelectPage';
import DonorSignUpPage from '../pages/AuthPage/SignUpPage/DonorSignUpPage';
import CharitySignUpPage from '../pages/AuthPage/SignUpPage/CharitySignUpPage';
import VolunteerSignUpPage from '../pages/AuthPage/SignUpPage/VolunteerSignUpPage';
import SignInPage from '../pages/AuthPage/SignInPage/SignInPage';
import AboutPage from '../pages/AboutPage/AboutPage';
import ContactPage from '../pages/ContactPage/ContactPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage/PrivacyPolicyPage';
import TermsPage from '../pages/TermsPage/TermsPage';
import CharitiesPage from '../pages/CharitiesPage/CharitiesPage';
import PublicCharityDetailsPage from '../pages/CharitiesPage/components/PublicCharityDetailsPage';

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
          <HomePage />
        }
      />
      <Route
        path="/about"
        element={
          <AboutPage />
        }
      />
      <Route
        path="/contact"
        element={
          <ContactPage />
        }
      />
      <Route
        path="/privacy"
        element={
          <PrivacyPolicyPage />
        }
      />
      <Route
        path="/terms"
        element={
          <TermsPage />
        }
      />
      <Route
        path="/charities"
        element={
          <CharitiesPage />
        }
      />
      <Route
        path="/charities/:id"
        element={
          <PublicCharityDetailsPage />
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
        path="/donor"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/my-donations"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/thank-you-notes"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/profile"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donor/settings"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donate"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonationSubmission />
          </ProtectedRoute>
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

      <Route
        path="/charityDetails/:id"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <CharityDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/charity" element={<ProtectedRoute allowedRoles={['charity']}><CharityLayout /></ProtectedRoute>}>
        <Route index element={<CharityDashboard />} />
        <Route path="requirements" element={<RequirementsPage />} />
        <Route path="all-donations" element={<AllDonationsPage />} />
        <Route path="donations" element={<IncomingDonationsPage />} />
        <Route path="thank-you" element={<ThankYouNotesPage />} />
        {/* <Route path="reports" element={<DashboardNotFoundPage />} /> */}
        <Route path="profile" element={<OrganisationProfilePage />} />
        <Route path="settings" element={<DashboardNotFoundPage />} />
        <Route path="*" element={<DashboardNotFoundPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardOverviewPage />} />
        <Route path="users/volunteers" element={<DashboardVolunteersPage />} />
        <Route path="users/charities" element={<DashboardCharitiesPage />} />
        <Route path="items/categories" element={<DashboardCategoriesPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
        <Route path="*" element={<DashboardNotFoundPage />} />
      </Route>

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
