// Update the AuthManager class
class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        // Initialize Google Sign-In
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID',
            callback: this.handleGoogleSignIn.bind(this)
        });

        // Check if user is already logged in
        const user = localStorage.getItem('user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.isAuthenticated = true;
            
            // Update path check and redirect
            if (window.location.pathname === '/' || window.location.pathname === '/login.html') {
                window.location.href = '/app';
            }
        } else if (window.location.pathname !== '/' && window.location.pathname !== '/login.html') {
            // If not authenticated and not on login page, redirect to login
            window.location.href = '/';
        }

        this.setupEventListeners();
    }

    async handleGoogleSignIn(response) {
        try {
            const decoded = JSON.parse(atob(response.credential.split('.')[1]));
            
            const user = {
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
                registeredAt: new Date().toISOString()
            };

            localStorage.setItem('user', JSON.stringify(user));
            this.currentUser = user;
            this.isAuthenticated = true;
            
            // Update redirect path
            window.location.href = '/app';
        } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Google sign-in failed. Please try again.');
        }
    }

    // ... rest of your AuthManager methods ...

    logout() {
        localStorage.removeItem('user');
        this.currentUser = null;
        this.isAuthenticated = false;
        // Update redirect path
        window.location.href = '/';
    }
} 