import httpService from './httpService';

const authService = {
  // Login
  async login(credentials) {
    const response = await httpService.post('/auth/login', credentials);
    return response.data;
  },

  // Register donor
  async registerDonor(userData) {
    const donorData = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      role: 'donor',
      phoneNumber: userData.phone
    };
    const response = await httpService.post('/auth/register', donorData);
    return response.data;
  },

  // Register volunteer
  async registerVolunteer(userData, documents) {
    const formData = new FormData();

    // Append form fields
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('email', userData.email);
    formData.append('phone', userData.phone);
    formData.append('password', userData.password);
    formData.append('role', 'volunteer');
    formData.append('name', `${userData.firstName} ${userData.lastName}`);

    // Append documents
    for (let i = 0; i < documents.length; i++) {
      formData.append('documents', documents[i]);
    }

    const response = await httpService.post('/auth/register/volunteer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Register charity
  async registerCharity(charityData, documents) {
    const formData = new FormData();

    // Append all charity fields
    Object.entries(charityData).forEach(([key, value]) => {
      if (key === 'location') {
        if (value.coordinates) {
          formData.append('location', JSON.stringify({
            "coordinates": value.coordinates
          }));
          formData.append('address', value.address);
        } else {
          formData.append('address', value.address);
        }
      } else {
        formData.append(key, value);
      }
    });

    // Required fields for backend
    formData.append('role', 'charity');
    formData.append('name', `${charityData.contactFirstName} ${charityData.contactLastName}`);

    // Append documents
    for (let i = 0; i < documents.length; i++) {
      formData.append('documents', documents[i]);
    }

    const response = await httpService.post('/auth/register/charity', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('donor');
    localStorage.removeItem('volunteer');
    localStorage.removeItem('charity');
    // Add other role-specific cleanup as needed
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get current user role
  getCurrentRole() {
    return localStorage.getItem('role');
  },

  // Get stored donor info
  getDonorInfo() {
    const donor = localStorage.getItem('donor');
    return donor ? JSON.parse(donor) : null;
  },

  getVolunteerInfo() {
    const volunteer = localStorage.getItem('volunteer');
    return volunteer ? JSON.parse(volunteer) : null;
  },

  getCharityInfo() {
    const charity = localStorage.getItem('charity');
    return charity ? JSON.parse(charity) : null;
  },

  getCurrentUserInfo() {
    const role = this.getCurrentRole();
    switch (role) {
      case 'donor':
        return this.getDonorInfo();
      case 'volunteer':
        return this.getVolunteerInfo();
      case 'charity':
        return this.getCharityInfo();
      default:
        return null;
    }
  },

  // Store user data after login
  storeUserData(userData) {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);

    // Store role-specific info
    const userInfo = {
      name: userData.name,
      email: userData.email,
      id: userData._id || userData.id,
    };

    switch (userData.role) {
      case 'donor':
        localStorage.setItem('donor', JSON.stringify(userInfo));
        break;
      case 'volunteer':
        localStorage.setItem('volunteer', JSON.stringify(userInfo));
        break;
      case 'charity':
        localStorage.setItem('charity', JSON.stringify({
          ...userInfo,
          charityName: userData.charityName || userData.organizationName,
        }));
        break;
    }
  },

  // Get redirect path based on role
  getRedirectPath(role) {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'volunteer':
        return '/volunteer';
      case 'charity':
        return '/charity';
      case 'donor':
        return '/donor';
      default:
        return '/';
    }
  },

  // Password reset (for future implementation)
  async requestPasswordReset(email) {
    const response = await httpService.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password (for future implementation)
  async resetPassword(token, newPassword) {
    const response = await httpService.post('/auth/reset-password', { token, password: newPassword });
    return response.data;
  },

  // Refresh token (for future implementation)
  async refreshToken() {
    const response = await httpService.post('/auth/refresh-token');
    return response.data;
  }
};

export default authService;
