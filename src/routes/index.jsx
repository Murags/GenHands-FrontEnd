import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import ApiStatusPage from '../pages/ApiStatusPage/ApiStatusPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/api-status" element={<ApiStatusPage />} />
    </Routes>
  );
}

export default AppRoutes;
