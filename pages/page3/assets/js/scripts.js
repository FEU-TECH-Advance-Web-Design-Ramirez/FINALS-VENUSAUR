// Profile Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load user data with error handling
    let currentUser;
    try {
        currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || 
                     JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {
        console.error('Error parsing user data:', e);
        window.location.href = 'FINALS-VENUSAUR/index.html';
        return;
    }
    
    if (!currentUser) {
        window.location.href = 'FINALS-VENUSAUR/index.html';
        return;
    }
    
    // Display user info
    displayUserInfo(currentUser);
    
    // Display pets
    displayPets(currentUser.pets || []);
    
    // Setup modal with edit functionality
    setupPetModal(currentUser);
    
    // Initialize health charts if viewing a specific pet
    if (window.location.hash.includes('pet=')) {
        const petId = parseInt(window.location.hash.split('=')[1]);
        if (currentUser.pets && currentUser.pets[petId]) {
            initializeHealthCharts(currentUser.pets[petId], petId);
        }
    }
    
    // Mobile menu setup
    setupMobileMenu();
});

function displayUserInfo(user) {
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    const joinDate = document.getElementById('joinDate');
    
    if (userName) userName.textContent = user.name || 'User';
    if (userEmail) userEmail.textContent = user.email || '';
    
    // Create avatar initials
    if (userAvatar) {
        const initials = (user.name || 'User').split(' ').map(n => n[0]).join('').toUpperCase();
        userAvatar.textContent = initials.slice(0, 2); // Limit to 2 characters
    }
    
    if (joinDate && user.createdAt) {
        const date = new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'long'
        });
        joinDate.textContent = `Member since ${date}`;
    }
}

function displayPets(pets) {
    const container = document.getElementById('petsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    

    
    pets.forEach((pet, index) => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <div class="pet-header">
                <h3 class="pet-name">${pet.name || 'Unnamed Pet'}</h3>
                <span class="pet-type">${pet.type || 'Unknown'}</span>
                <button class="delete-pet-btn" data-pet-id="${index}" aria-label="Delete pet">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="pet-details">
                ${pet.breed ? `<div class="detail-item">
                    <div class="detail-label">Breed</div>
                    <div class="detail-value">${pet.breed}</div>
                </div>` : ''}
                ${pet.age ? `<div class="detail-item">
                    <div class="detail-label">Age</div>
                    <div class="detail-value">${pet.age} years</div>
                </div>` : ''}
                ${pet.birthday ? `<div class="detail-item">
                    <div class="detail-label">Birthday</div>
                    <div class="detail-value">${formatDate(pet.birthday)}</div>
                </div>` : ''}
                ${pet.weight ? `<div class="detail-item">
                    <div class="detail-label">Weight</div>
                    <div class="detail-value">${pet.weight} kg</div>
                </div>` : ''}
                ${pet.medical ? `<div class="detail-item" style="grid-column: 1 / -1">
                    <div class="detail-label">Medical Notes</div>
                    <div class="detail-value">${pet.medical}</div>
                </div>` : ''}
            </div>
            <div class="pet-actions">
                <button class="view-health-btn" data-pet-id="${index}">
                    <i class="fas fa-chart-line"></i> View Health Metrics
                </button>
                <button class="edit-pet-btn" data-pet-id="${index}">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        `;
        container.appendChild(petCard);
        
        // Add click handler for health metrics
        petCard.querySelector('.view-health-btn').addEventListener('click', () => {
            window.location.hash = `pet=${index}`;
            initializeHealthCharts(pet, index);
            document.querySelector('.health-metrics')?.scrollIntoView({ behavior: 'smooth' });
        });

        // Add click handler for edit button
        petCard.querySelector('.edit-pet-btn').addEventListener('click', () => {
            openPetModalForEdit(index);
        });

        // Add click handler for delete button
        petCard.querySelector('.delete-pet-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteConfirmation(index);
        });
    });
}

function openPetModalForEdit(petId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.pets || petId < 0 || petId >= currentUser.pets.length) return;
    
    const pet = currentUser.pets[petId];
    const modal = document.getElementById('petModal');
    const petForm = document.getElementById('petForm');
    
    if (!modal || !petForm) return;
    
    // Fill the form
    document.getElementById('petName').value = pet.name || '';
    document.getElementById('petType').value = pet.type || '';
    document.getElementById('petBreed').value = pet.breed || '';
    document.getElementById('petAge').value = pet.age || '';
    document.getElementById('petBirthday').value = pet.birthday || '';
    document.getElementById('petWeight').value = pet.weight || '';
    document.getElementById('petMedical').value = pet.medical || '';
    
    // Set editing state
    petForm.dataset.editingPetId = petId;
    modal.style.display = 'flex';
}

function showDeleteConfirmation(petId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.pets || petId < 0 || petId >= currentUser.pets.length) return;
    
    const petName = currentUser.pets[petId].name || 'this pet';
    
    if (!confirm(`Are you sure you want to delete ${petName}? This action cannot be undone.`)) {
        return;
    }
    
    // Remove the pet
    currentUser.pets.splice(petId, 1);
    
    // Update storage
    updateUserData(currentUser);
    
    // Refresh display
    displayPets(currentUser.pets);
    
    // If we were viewing this pet's health, clear the view
    if (window.location.hash.includes(`pet=${petId}`)) {
        window.location.hash = '';
        document.querySelector('.health-metrics').style.display = 'none';
    }
    
    // Show confirmation
    showToast(`${petName} has been deleted`);
}

function setupPetModal(currentUser) {
    const modal = document.getElementById('petModal');
    const addBtn = document.getElementById('addPetBtn');
    const closeBtn = document.querySelector('.close-modal');
    const petForm = document.getElementById('petForm');
    
    if (!modal || !addBtn || !closeBtn || !petForm) return;
    
    addBtn.addEventListener('click', () => {
        petForm.reset();
        delete petForm.dataset.editingPetId;
        modal.style.display = 'flex';
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    petForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate required fields
        const petName = document.getElementById('petName').value.trim();
        if (!petName) {
            showToast('Pet name is required');
            return;
        }
        
        const newPet = {
            name: petName,
            type: document.getElementById('petType').value.trim(),
            breed: document.getElementById('petBreed').value.trim(),
            age: parseInt(document.getElementById('petAge').value) || 0,
            birthday: document.getElementById('petBirthday').value,
            weight: parseFloat(document.getElementById('petWeight').value) || 0,
            medical: document.getElementById('petMedical').value.trim(),
            healthData: {}
        };
        
        // Get or create health data if editing
        const editingPetId = petForm.dataset.editingPetId;
        if (editingPetId !== undefined && currentUser.pets[editingPetId]?.healthData) {
            newPet.healthData = currentUser.pets[editingPetId].healthData;
        } else {
            newPet.healthData = {
                weight: [],
                food: [],
                activity: [],
                vetVisits: []
            };
        }
        
        // Update user's pets
        if (!currentUser.pets) currentUser.pets = [];
        
        if (editingPetId !== undefined) {
            currentUser.pets[editingPetId] = newPet;
        } else {
            currentUser.pets.push(newPet);
        }
        
        // Update in storage
        updateUserData(currentUser);
        
        // Refresh display
        displayPets(currentUser.pets);
        
        // Show success message
        showToast(`Pet ${editingPetId !== undefined ? 'updated' : 'added'} successfully`);
        
        // Reset and close form
        petForm.reset();
        modal.style.display = 'none';
    });
}

function updateUserData(user) {
    if (!user) return;
    
    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === user.email);
        
        if (userIndex !== -1) {
            users[userIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    } catch (e) {
        console.error('Error updating user data:', e);
    }
}

function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem('currentUser')) || 
               JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch (e) {
        console.error('Error getting current user:', e);
        return null;
    }
}
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return '';
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (e) {
        console.error('Invalid date:', dateString);
        return '';
    }
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function() {
        this.classList.toggle('is-active');
        mobileNav.classList.toggle('is-active');

        // Update aria-expanded attribute
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.mobile-nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('is-active');
            mobileNav.classList.remove('is-active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
  // Close when clicking outside
  mobileNav.addEventListener('click', function(e) {
    if (e.target === mobileNav || e.target.closest('.mobile-nav-list') === null) {
        hamburger.classList.remove('is-active');
        mobileNav.classList.remove('is-active');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
    }
});
}
function initializeHealthCharts(pet, petId) {
    // Ensure healthData exists for this specific pet
    if (!pet.healthData) {
        pet.healthData = {
            weight: [],
            food: [],
            activity: [],
            vetVisits: []
        };
    }

    const chartCanvas = document.getElementById('healthChart');
    if (!chartCanvas) {
        console.error('Health chart canvas not found');
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    
    // Store the current pet ID in a data attribute
    chartCanvas.dataset.petId = petId;
    
    // Clear any existing chart
    if (window.currentHealthChart) {
        window.currentHealthChart.destroy();
    }

    // Update the pet name display
    const currentPetNameElement = document.getElementById('currentPetName');
    if (currentPetNameElement) {
        currentPetNameElement.textContent = pet.name || 'Unnamed Pet';
    }

    // Initialize chart with this pet's weight data
    updateChart('weight');

    // Tab switching
    document.querySelectorAll('.metric-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.metric-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateChart(this.dataset.chart);
        });
    });

    // Metric form submission
    const metricForm = document.getElementById('metricForm');
    if (metricForm) {
        metricForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const metricType = document.getElementById('metricType').value;
            const metricDate = document.getElementById('metricDate').value;
            const metricValue = document.getElementById('metricValue').value;
            
            // Validate inputs
            if (!metricDate) {
                alert('Please select a date');
                return;
            }
            
            if (!metricValue || isNaN(parseFloat(metricValue))) {
                alert('Please enter a valid number');
                return;
            }
            
            const newEntry = {
                date: metricDate,
                value: parseFloat(metricValue),
                notes: document.getElementById('metricNotes').value.trim()
            };

            // Get the current user and pet
            const currentUser = getCurrentUser();
            
            if (currentUser && currentUser.pets && currentUser.pets[petId]) {
                const currentPet = currentUser.pets[petId];
                
                // Initialize health data if not exists
                if (!currentPet.healthData) {
                    currentPet.healthData = {
                        weight: [],
                        food: [],
                        activity: [],
                        vetVisits: []
                    };
                }
                
                // Initialize metric type array if not exists
                if (!currentPet.healthData[metricType]) {
                    currentPet.healthData[metricType] = [];
                }
                
                // Add new entry and sort by date
                currentPet.healthData[metricType].push(newEntry);
                currentPet.healthData[metricType].sort((a, b) => new Date(a.date) - new Date(b.date));
                
                // Update storage
                updateUserData(currentUser);
                
                // Update chart
                updateChart(metricType);
                
                // Reset form
                e.target.reset();
                
                // Show success message
                alert('Data added successfully!');
            }
        });
    }

    // Update chart function
    function updateChart(metricType) {
        const currentUser = getCurrentUser();
        
        if (!currentUser || !currentUser.pets || !currentUser.pets[petId]) {
            console.error('Pet data not found');
            return;
        }
        
        const pet = currentUser.pets[petId];
        const data = pet.healthData?.[metricType] || [];
        
        // Destroy previous chart if exists
        if (window.currentHealthChart) {
            window.currentHealthChart.destroy();
        }

        // Prepare chart data
        const chartData = {
            labels: data.map(item => formatShortDate(item.date)),
            datasets: [{
                label: `${getMetricLabel(metricType)} - ${pet.name || 'Pet'}`,
                data: data.map(item => item.value),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        };

        // Create new chart
        window.currentHealthChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const dataItem = data[context.dataIndex];
                                return dataItem.notes ? `Notes: ${dataItem.notes}` : '';
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: metricType !== 'weight',
                        title: {
                            display: true,
                            text: getYAxisLabel(metricType),
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date',
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Helper functions
    function getCurrentUser() {
        try {
            return JSON.parse(sessionStorage.getItem('currentUser')) || 
                   JSON.parse(localStorage.getItem('currentUser'));
        } catch (e) {
            console.error('Error getting current user:', e);
            return null;
        }
    }

    function updateUserData(user) {
        if (!user || !user.email) {
            console.error('Invalid user data');
            return;
        }
        
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === user.email);
            
            if (userIndex !== -1) {
                users[userIndex] = user;
            } else {
                users.push(user);
            }
            
            localStorage.setItem('users', JSON.stringify(users));
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        } catch (e) {
            console.error('Error updating user data:', e);
        }
    }
    

    function formatShortDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return isNaN(date) ? '' : date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (e) {
            console.error('Invalid date:', dateString);
            return '';
        }
    }

    function getMetricLabel(metricType) {
        switch(metricType) {
            case 'weight': return 'Weight (kg)';
            case 'food': return 'Food Intake (cups)';
            case 'activity': return 'Activity (minutes)';
            default: return metricType.charAt(0).toUpperCase() + metricType.slice(1);
        }
    }

    function getYAxisLabel(metricType) {
        switch(metricType) {
            case 'weight': return 'Weight (kg)';
            case 'food': return 'Food Intake (cups)';
            case 'activity': return 'Activity (minutes)';
            default: return 'Value';
        }
    }

    function sanitizeInput(input) {
        if (!input) return '';
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return isNaN(date) ? '' : date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            console.error('Invalid date:', dateString);
            return '';
        }
    }

    // Display vet visits
    function displayVetVisits() {
        const visitsContainer = document.getElementById('vetVisitsContainer');
        if (!visitsContainer) return;
        
        visitsContainer.innerHTML = '';
        
        if (!pet.healthData.vetVisits || pet.healthData.vetVisits.length === 0) {
            visitsContainer.innerHTML = '<div class="no-visits">No vet visits recorded yet.</div>';
            return;
        }
        
        pet.healthData.vetVisits.forEach((visit, index) => {
            const visitElement = document.createElement('div');
            visitElement.className = 'vet-visit';
            visitElement.innerHTML = `
                <div class="visit-header">
                    <div class="visit-date">${formatDate(visit.date)}</div>
                    <button class="delete-visit-btn" data-index="${index}" title="Delete visit">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="visit-purpose">Purpose: ${sanitizeInput(visit.purpose || 'Checkup')}</div>
                ${visit.notes ? `<div class="visit-notes">Notes: ${sanitizeInput(visit.notes)}</div>` : ''}
                ${visit.nextVisit ? `<div class="next-visit">Next visit: ${formatDate(visit.nextVisit)}</div>` : ''}
            `;
            visitsContainer.appendChild(visitElement);
            
            // Add delete handler for this visit
            visitElement.querySelector('.delete-visit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this vet visit?')) {
                    deleteVetVisit(index);
                }
            });
        });
    }

    function deleteVetVisit(index) {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.pets || !currentUser.pets[petId]) return;
        
        currentUser.pets[petId].healthData.vetVisits.splice(index, 1);
        updateUserData(currentUser);
        displayVetVisits();
    }

    // Initialize vet visits display
    displayVetVisits();
}



