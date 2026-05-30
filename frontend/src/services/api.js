const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' 
  ? 'https://ai-resume-analyzer-y1jn.onrender.com/user-api' 
  : 'http://localhost:5000/user-api');

let accessToken = localStorage.getItem('accessToken') || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const getAccessToken = () => accessToken;

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  
  options.headers = options.headers || {};
  if (accessToken) {
    options.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Ensure requests are sent with credentials (for refresh token cookie)
  options.credentials = 'include';

  // Do not set Content-Type if uploading file (let browser set it with boundary)
  if (!(options.body instanceof FormData) && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }

  let response = await fetch(url, options);

  if (response.status === 401) {
    const clone = response.clone();
    try {
      const data = await clone.json();
      if (data.code === 'TOKEN_EXPIRED') {
        const refreshed = await attemptRefresh();
        if (refreshed) {
          // Retry original request with new token
          options.headers['Authorization'] = `Bearer ${accessToken}`;
          response = await fetch(url, options);
        } else {
          // Refresh failed
          window.dispatchEvent(new CustomEvent('auth-logout'));
        }
      }
    } catch (e) {
      // Response was not JSON
    }
  }

  return response;
}

async function attemptRefresh() {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      setAccessToken(data.accessToken);
      return true;
    }
    setAccessToken(null);
    return false;
  } catch (err) {
    setAccessToken(null);
    return false;
  }
}

export const api = {
  // Authentication
  register: async (username, email, password) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  login: async (email, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setAccessToken(data.accessToken);
    return data;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    }
    setAccessToken(null);
  },

  checkSession: async () => {
    // Try to refresh token to see if user has active cookie session
    if (!accessToken) {
      const success = await attemptRefresh();
      return success;
    }
    return true;
  },

  // Resumes
  analyzeResume: async (file, jobDescription) => {
    const formData = new FormData();
    formData.append('resume', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    const res = await request('/resumes/analyze', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Resume analysis failed');
    return data;
  },

  getHistory: async () => {
    const res = await request('/resumes/history', { method: 'GET' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch resume history');
    return data;
  },

  getResumeDetails: async (id) => {
    const res = await request(`/resumes/${id}`, { method: 'GET' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch resume details');
    return data;
  },

  deleteResume: async (id) => {
    const res = await request(`/resumes/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete resume record');
    return data;
  }
};
