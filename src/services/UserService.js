const API_BASE_URL = 'http://localhost:8080/api';

class UserService {
    /**
     * Get all users
     */
    async getAllUsers() {
        try {
            console.log('Frontend: Fetching users from backend...');
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            console.log('Frontend: Response status:', response.status);
            const data = await response.json();
            console.log('Frontend: Raw response data:', data);
            
            if (data.success) {
                console.log('Frontend: Users fetched successfully:', data.users);
                return { success: true, data: data.users };
            } else {
                console.error('Frontend: Failed to fetch users:', data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Frontend: Network error:', error);
            return { success: false, message: 'Failed to fetch users' };
        }
    }

    /**
     * Update single user role
     */
    async updateUserRole(userId, role) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ role })
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Update user role error:', error);
            return { success: false, message: 'Failed to update user role' };
        }
    }

    /**
     * Update multiple user roles
     */
    async updateMultipleUserRoles(userIds, role) {
        try {
            console.log('UserService: Starting bulk role update', { userIds, role });
            
            const response = await fetch(`${API_BASE_URL}/admin/users/roles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ 
                    userIds, 
                    role 
                })
            });

            console.log('UserService: Bulk update response status:', response.status);
            const data = await response.json();
            console.log('UserService: Bulk update response data:', data);
            
            if (data.success) {
                console.log('UserService: Bulk update successful for', data.updatedCount, 'users');
                return { success: true, message: data.message, updatedCount: data.updatedCount };
            } else {
                console.error('UserService: Bulk update failed:', data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('UserService: Bulk update user roles error:', error);
            return { success: false, message: 'Failed to update user roles: ' + error.message };
        }
    }

    /**
     * Get available roles
     */
    async getAvailableRoles() {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/roles`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true, data: data.roles };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Get roles error:', error);
            return { success: false, message: 'Failed to fetch roles' };
        }
    }

    /**
     * Get role statistics
     */
    async getRoleStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/stats`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true, data: data.stats };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Get role statistics error:', error);
            return { success: false, message: 'Failed to fetch role statistics' };
        }
    }

    /**
     * Format role for display
     */
    formatRole(role) {
        if (!role) return 'USER';
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }

    /**
     * Get role badge class
     */
    getRoleBadgeClass(role) {
        if (!role) return 'user-badge';
        
        switch (role.toLowerCase()) {
            case 'admin':
                return 'admin-badge';
            case 'manager':
                return 'manager-badge';
            case 'finance':
                return 'finance-badge';
            default:
                return 'user-badge';
        }
    }
}

// Export singleton instance
const userService = new UserService();
export default userService;
