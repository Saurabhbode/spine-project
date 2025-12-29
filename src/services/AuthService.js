const API_BASE_URL = 'http://localhost:8080/api/auth';

class AuthService {
    constructor() {
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    /**
     * Register a new user
     */
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userData.username,
                    password: userData.password,
                    email: userData.email,
                    name: userData.name,
                    location: userData.location,
                    department: userData.department,
                    employeeNumber: userData.employeeNumber
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                this.setTokens(data.accessToken, data.refreshToken);
                this.setUser(data.user);
                return { success: true, data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    /**
     * Login user - supports username, email, or employee ID
     */
    async login(identifier, password, department = null) {
        try {
            // Send identifier as username for backend compatibility
            const requestBody = { username: identifier, password };
            if (department) {
                requestBody.department = department;
            }

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            
            if (data.success) {
                this.setTokens(data.accessToken, data.refreshToken);
                this.setUser(data.user);
                return { success: true, data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken() {
        try {
            if (!this.refreshToken) {
                return { success: false, message: 'No refresh token available' };
            }

            const response = await fetch(`${API_BASE_URL}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: this.refreshToken
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                this.setTokens(data.accessToken, this.refreshToken); // Keep same refresh token
                return { success: true, data };
            } else {
                this.logout();
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            this.logout();
            return { success: false, message: 'Network error. Please login again.' };
        }
    }

    /**
     * Get user profile
     */
    async getUserProfile(username) {
        try {
            const response = await fetch(`${API_BASE_URL}/profile?username=${username}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.setUser(data.user);
                return { success: true, data: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Get profile error:', error);
            return { success: false, message: 'Failed to get user profile' };
        }
    }

    /**
     * Get valid departments
     */
    async getValidDepartments() {
        try {
            const response = await fetch(`${API_BASE_URL}/departments`);
            const data = await response.json();
            
            if (data.success) {
                return { success: true, departments: data.departments };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Get departments error:', error);
            return { success: false, message: 'Failed to get departments' };
        }
    }

    /**
     * Make authenticated API request with automatic token refresh
     */
    async makeAuthenticatedRequest(url, options = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        if (this.accessToken) {
            defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const finalOptions = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        let response = await fetch(url, finalOptions);

        // If token is expired, try to refresh
        if (response.status === 401 && this.refreshToken) {
            const refreshResult = await this.refreshToken();
            if (refreshResult.success) {
                // Retry the request with new token
                finalOptions.headers['Authorization'] = `Bearer ${this.accessToken}`;
                response = await fetch(url, finalOptions);
            } else {
                this.logout();
                throw new Error('Authentication failed');
            }
        }

        return response;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!(this.accessToken && this.user);
    }

    /**
     * Check if user belongs to specific department
     */
    belongsToDepartment(department) {
        if (!this.user) return false;
        return this.user.department === department;
    }

    /**
     * Check if user has specific permission
     */
    hasPermission(permission) {
        if (!this.user || !this.user.permissions) return false;
        return this.user.permissions[permission] === true;
    }

    /**
     * Get current user
     */
    getUser() {
        return this.user;
    }

    /**
     * Get access token
     */
    getAccessToken() {
        return this.accessToken;
    }

    /**
     * Set tokens
     */
    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    /**
     * Set user data
     */
    setUser(user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Logout user
     */
    logout() {
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    /**
     * Get department from localStorage (for backward compatibility)
     */
    getSelectedDepartment() {
        return localStorage.getItem('selectedDepartment');
    }

    /**
     * Clear department selection
     */
    clearDepartmentSelection() {
        localStorage.removeItem('selectedDepartment');
    }


}

// Export singleton instance
const authService = new AuthService();
export default authService;

