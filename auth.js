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
            
            if (window.location.pathname.includes('login.html')) {
                window.location.href = '/index.html';
            } else {
                this.updateUserInterface();
            }
        } else if (!window.location.pathname.includes('login.html')) {
            // If not authenticated and not on login page, redirect to login
            window.location.href = '/login.html';
        }

        // Render Google Sign-In button if on login page
        if (window.location.pathname.includes('login.html')) {
            google.accounts.id.renderButton(
                document.getElementById('googleBtn'),
                { theme: 'filled_blue', size: 'large', width: '100%' }
            );
        }
    }

    updateUserInterface() {
        const userInfo = document.querySelector('.user-info');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');
        
        if (this.currentUser && userInfo) {
            userInfo.style.display = 'flex';
            userEmail.textContent = this.currentUser.email;
            userAvatar.src = this.currentUser.picture || 'default-avatar.png';
        } else if (userInfo) {
            userInfo.style.display = 'none';
        }
    }

    handleGoogleSignIn(response) {
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
            
            window.location.href = '/index.html';
        } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Google sign-in failed. Please try again.');
        }
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUser = null;
        this.isAuthenticated = false;
        window.location.href = '/login.html';
    }
}

// Initialize auth manager
const auth = new AuthManager();