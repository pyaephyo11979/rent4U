import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post<ApiResponse<AuthTokens>>(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setAccessToken(data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        setAccessToken(null);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (payload: { name: string; username: string; email: string; password: string }) =>
    api.post<ApiResponse<User>>('/auth/register', payload),

  login: (payload: { email: string; password: string }) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', payload),

  logout: () => api.post<ApiResponse<null>>('/auth/logout'),

  refresh: () => api.post<ApiResponse<AuthTokens>>('/auth/refresh'),
};

// Houses
export const houseApi = {
  list: (params?: HouseSearchParams) =>
    api.get<PaginatedResponse<House>>('/houses', { params }),

  get: (id: number) =>
    api.get<ApiResponse<House>>(`/houses/${id}`),

  create: (payload: CreateHousePayload) =>
    api.post<ApiResponse<House>>('/houses', payload),

  update: (id: number, payload: UpdateHousePayload) =>
    api.patch<ApiResponse<House>>(`/houses/${id}`, payload),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/houses/${id}`),
};

// Users
export const userApi = {
  get: (id: number) =>
    api.get<ApiResponse<UserWithHouses>>(`/users/${id}`),

  update: (id: number, payload: Partial<Pick<User, 'name' | 'username' | 'email' | 'profilePicture'>>) =>
    api.patch<ApiResponse<User>>(`/users/${id}`, payload),
};

// Payments
export const paymentApi = {
  create: (payload: { houseId: number; amount: number; currency?: string }) =>
    api.post<ApiResponse<Payment>>('/payments', payload),

  my: () =>
    api.get<ApiResponse<Payment[]>>('/payments/my'),

  get: (id: number) =>
    api.get<ApiResponse<Payment>>(`/payments/${id}`),

  verify: (id: number) =>
    api.post<ApiResponse<Payment>>(`/payments/${id}/verify`),
};

export default api;
