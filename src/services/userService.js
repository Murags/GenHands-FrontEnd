import http from './httpService';

const getUsers = async (role = null, status = null) => {
  const url = '/auth/users';
  const params = {};

  if (role) params.role = role;
  if (status) params.status = status;

  const config = Object.keys(params).length > 0 ? { params } : {};
  const response = await http.get(url, config);
  return response.data;
};

// Legacy function for backward compatibility - now uses getUsers internally
const getPendingVerificationUsers = async (role) => {
  return getUsers(role, 'pending');
};

const verifyUser = async ({ userId, approve }) => {
  const url = `/auth/verify/${userId}`;
  const data = { action: approve ? 'approve' : 'reject' };

  const response = await http.put(url, data);
  return response.data;
};

export {
  getUsers,
  getPendingVerificationUsers,
  verifyUser,
};
