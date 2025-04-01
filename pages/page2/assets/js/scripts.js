// Signup Functionality
function initializeSignup() {
    if (!document.getElementById('signupForm')) return;

    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const petsContainer = document.getElementById('petsContainer');
    const addPetBtn = document.getElementById('addPetBtn');
    
    let petCount = 0;

    // Toggle Password Visibility
    function setupPasswordToggle(toggle, field) {
        toggle.addEventListener('click', function() {
            const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
            field.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }

    if (togglePassword && password) setupPasswordToggle(togglePassword, password);
    if (toggleConfirmPassword && confirmPassword) setupPasswordToggle(toggleConfirmPassword, confirmPassword);

    // Add Pet Functionality
    function addPetField() {
        petCount++;
        const petDiv = document.createElement('div');
        petDiv.className = 'pet-entry';
        petDiv.innerHTML = `
            <div class="form-group">
                <label for="petType${petCount}" class="form-label">Pet Type</label>
                <select id="petType${petCount}" class="form-input" required>
                    <option value="">Select pet type</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="fish">Fish</option>
                    <option value="reptile">Reptile</option>
                    <option value="small-animal">Small Animal</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="petName${petCount}" class="form-label">Pet Name</label>
                <input type="text" id="petName${petCount}" class="form-input" placeholder="Pet's name" required>
            </div>
            ${petCount > 1 ? `<button type="button" class="remove-pet-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i> Remove
            </button>` : ''}
        `;
        petsContainer.appendChild(petDiv);
    }

    // Add first pet field by default
    if (petsContainer) addPetField();
    
    // Add more pets when button clicked
    if (addPetBtn) addPetBtn.addEventListener('click', addPetField);

    // Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (errorMessage) errorMessage.style.display = 'none';

            // Validate form
            if (!validateSignupForm()) return;

            // Create user object
            const user = createUserObject();
            if (!user) return;

            // Save user and redirect
            saveUserAndRedirect(user);
        });
    }

    function validateSignupForm() {
        // Validate passwords match
        if (password.value !== confirmPassword.value) {
            showError('Passwords do not match');
            return false;
        }

        // Validate password strength
        if (password.value.length < 8) {
            showError('Password must be at least 8 characters long');
            return false;
        }

        // Validate terms agreement
        if (!document.getElementById('agreeTerms')?.checked) {
            showError('You must agree to the terms and conditions');
            return false;
        }

        // Validate pet information
        const petEntries = document.querySelectorAll('.pet-entry');
        for (const entry of petEntries) {
            const index = Array.from(petEntries).indexOf(entry) + 1;
            const type = entry.querySelector(`#petType${index}`)?.value;
            const name = entry.querySelector(`#petName${index}`)?.value;
            
            if (!type || !name) {
                showError('Please fill in all pet information');
                return false;
            }
        }

        return true;
    }

    function createUserObject() {
        // Collect pet data
        const pets = [];
        const petEntries = document.querySelectorAll('.pet-entry');
        
        petEntries.forEach((entry, index) => {
            const type = entry.querySelector(`#petType${index+1}`)?.value;
            const name = entry.querySelector(`#petName${index+1}`)?.value;
            pets.push({ type, name });
        });

        return {
            name: document.getElementById('fullname')?.value,
            email: document.getElementById('email')?.value,
            password: password.value,
            pets: pets,
            createdAt: new Date().toISOString()
        };
    }

    function saveUserAndRedirect(user) {
        try {
            // Save to localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.some(u => u.email === user.email)) {
                showError('Email already registered');
                return;
            }
            
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success message and redirect to login
            alert('Registration successful! You will now be redirected to login.');
            window.location.href = '/FINALS-VENUSAUR/index.html';
            
        } catch (error) {
            console.error('Error saving user:', error);
            showError('An error occurred during registration');
        }
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            window.scrollTo(0, 0);
        }
    }
}
// Login Functionality
function initializeLogin() {
    if (!document.getElementById('loginForm')) return;

    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const loginPassword = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');

    // Toggle Password Visibility
    if (toggleLoginPassword && loginPassword) {
        toggleLoginPassword.addEventListener('click', function() {
            const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPassword.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }

    // Check for remembered user
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && document.getElementById('loginEmail')) {
        document.getElementById('loginEmail').value = rememberedEmail;
        if (rememberMe) rememberMe.checked = true;
    }

    // Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (loginError) loginError.style.display = 'none';

            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            const remember = rememberMe?.checked;

            // Basic validation
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Remember email if checkbox is checked
                if (remember) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Store user session
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                
                window.location.href = '/FINALS-VENUSAUR/home.html';
            } else {
                showError('Invalid email or password');
            }
        });
    }

    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'block';
        }
    }
}


// Initialize appropriate functionality based on current page
document.addEventListener('DOMContentLoaded', function() {
    initializeSignup();
    initializeLogin();

});

