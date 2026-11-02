const API_URL = "http://localhost:8080/api/notifications";

export const getNotifications = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];
        const res = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return await res.json();
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const getUnreadCount = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return 0;
        const res = await fetch(`${API_URL}/unread-count`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Failed to fetch unread count');
        return await res.json();
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
};

export const markAllAsRead = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${API_URL}/read-all`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Failed to mark all as read');
        return await res.text();
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        throw error;
    }
};

export const markAsRead = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${API_URL}/${id}/read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Failed to mark as read');
        return await res.text();
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};
