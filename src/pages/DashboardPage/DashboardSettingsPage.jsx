import React from "react";

const DashboardSettingsPage = () => {
  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light">
      <h1 className="text-3xl font-bold text-ghibli-dark-blue mb-4">Settings</h1>
      <p className="text-ghibli-brown mb-6">
        Here you can manage your account settings, preferences, and notifications.
      </p>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-ghibli-dark-blue">Account</h2>
          <p className="text-ghibli-brown text-sm">Update your email, password, and profile information.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ghibli-dark-blue">Notifications</h2>
          <p className="text-ghibli-brown text-sm">Manage how you receive updates and alerts.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ghibli-dark-blue">Preferences</h2>
          <p className="text-ghibli-brown text-sm">Customize your dashboard experience.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettingsPage;
