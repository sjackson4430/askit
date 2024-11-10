class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        const isLoginPage = window.location.pathname.includes('/login.html');
        const user = localStorage.getItem('user');
        
        if (user) {
            this.currentUser = JSON.parse(user);
            this.isAuthenticated = true;
            
            if (isLoginPage) {
                window.location.href = '/askit/index.html';
            }
        } else {
            if (!isLoginPage) {
                window.location.href = '/askit/login.html';
                return;
            }
        }

        if (isLoginPage) {
            this.setupEventListeners();
            google.accounts.id.initialize({
                client_id: 'YOUR_GOOGLE_CLIENT_ID',
                callback: this.handleGoogleSignIn.bind(this)
            });

            google.accounts.id.renderButton(
                document.getElementById('googleBtn'),
                { theme: 'filled_blue', size: 'large', width: '100%' }
            );
        }
    }

    setupEventListeners() {
        const loginBox = document.getElementById('loginBox');
        const registerBox = document.getElementById('registerBox');
        const toggleRegister = document.getElementById('toggleRegister');
        const toggleLogin = document.getElementById('toggleLogin');

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

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
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

        const user = {
            name,
            email,
            registeredAt: new Date().toISOString()
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser = user;
        this.isAuthenticated = true;
        window.location.href = '/askit/index.html';
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.email === email) {
                this.currentUser = user;
                this.isAuthenticated = true;
                window.location.href = '/askit/index.html';
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
            window.location.href = '/askit/index.html';
        } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Google sign-in failed. Please try again.');
        }
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUser = null;
        this.isAuthenticated = false;
        window.location.href = '/askit/login.html';
    }
}
404

There isn't a GitHub Pages site here.

If you're trying to publish one, read the full documentation to learn how to set up GitHub Pages for your repository, organization, or user account.
GitHub Status — @githubstatus

const auth = new AuthManager();