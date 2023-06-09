import jwtDecode from 'jwt-decode';

export function UserCheck() {
  const token = sessionStorage.getItem('jwt-token');
  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded.username; 
  } catch (e) {
    console.error('Decoding jwt-token failed', e);
    return null;
  }
}
