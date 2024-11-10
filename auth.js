class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Check if user is already logged in
        const user = localStorage.getItem('user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.isAuthenticated = true;
            
            if (window.location.pathname.includes('login.html')) {
                window.location.href = '/index.html';
            }
        } else if (!window.location.pathname.includes('login.html')) {
            // If not authenticated and not on login page, redirect to login
            window.location.href = '/login.html';
        }

        // Initialize Google Sign-In
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID',
            callback: this.handleGoogleSignIn.bind(this)
        });

        if (window.location.pathname.includes('login.html')) {
            google.accounts.id.renderButton(
                document.getElementById('googleBtn'),
                { theme: 'filled_blue', size: 'large', width: '100%' }
            );
        }
    }

    setupEventListeners() {
        // Toggle between login and register forms
        const toggleRegister = document.getElementById('toggleRegister');
        const toggleLogin = document.getElementById('toggleLogin');
        const loginBox = document.querySelector('.auth-box:not(#registerBox)');
        const registerBox = document.getElementById('registerBox');

        if (toggleRegister) {
            toggleRegister.addEventListener('click', (e) => {
                e.preventDefault();
                loginBox.classList.add('hidden');
                registerBox.classList.remove('hidden');
            });
        }

        if (toggleLogin) {
            toggleLogin.addEventListener('click', (e) => {
                e.preventDefault();
                registerBox.classList.add('hidden');
                loginBox.classList.remove('hidden');
            });
        }

        // Handle registration form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }

        // Handle login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    handleRegistration() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Here you would typically make an API call to your backend
        // For now, we'll just store in localStorage
        const user = {
            name,
            email,
            registeredAt: new Date().toISOString()
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser = user;
        this.isAuthenticated = true;
        window.location.href = '/index.html';
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Here you would typically verify with your backend
        // For now, we'll just check localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.email === email) {
                this.currentUser = user;
                this.isAuthenticated = true;
                window.location.href = '/index.html';
            } else {
                alert('Invalid credentials!');
            }
        } else {
            alert('User not found!');
        }
    }

    handleGoogleSignIn(response) {
        try {
            const decoded = JSON.parse(atob(response.credential.split('.')[1]));
            
            const user = {
                name: decoded.name,
                email: decoded.email,
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