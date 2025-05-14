import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import HomePage from '../pages/HomePage/HomePage';
import ApiStatusPage from '../pages/ApiStatusPage/ApiStatusPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';


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
