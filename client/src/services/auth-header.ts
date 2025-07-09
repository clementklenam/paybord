/**
 * Helper function to get the authentication header with JWT token
 * @returns Object with Authorization header or empty object if no token is found
 */
export function getAuthHeader() {
  const token = localStorage.getItem('token');
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}
