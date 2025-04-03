// Replace with your actual Calendly personal access token
const API_TOKEN = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzQzNjgwMDEwLCJqdGkiOiI2NDcwN2YzZC05ZWEzLTQyZWMtOTZhZi01YzMyMmNiZWMwZGUiLCJ1c2VyX3V1aWQiOiI5OTQ5MTViMS04NTM5LTRiYjAtYTE1NS0yZTg5ZGE5ZWZiNDUifQ.eJ25Di3Djsn2FLFK3nYpBV9HezDzzr72KS-oElmLQm-n8HL6peIFAtQpm1LErqw9w_YCOpF2dziWBb9IwJHKIA";

// Calendly configuration
const CALENDLY_USER = "ivnbdngn5";
const EVENT_URLS = {
    store: `https://api.calendly.com/event_types/${CALENDLY_USER}/store-visit`,
    clinic: `https://api.calendly.com/event_types/${CALENDLY_USER}/clinic-visit`,
    extended: `https://api.calendly.com/event_types/${CALENDLY_USER}/30min`
};

// DOM Elements
const appointmentList = document.getElementById('appointment-list');
const apiResponse = document.getElementById('api-response');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load any existing appointments (for demo purposes)
    loadDemoAppointments();
    
    // Set up hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobileNav');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('is-active');
        mobileNav.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('is-active'));
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('is-active');
            mobileNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Initialize Calendly widget
    Calendly.initInlineWidget({
        url: `https://calendly.com/${CALENDLY_USER}`,
        parentElement: document.querySelector('.calendly-inline-widget'),
        prefill: {},
        utm: {}
    });
});

// Enhanced booking function with API integration
async function bookAppointment(eventType) {
    try {
        // Show confirmation before opening Calendly
        if (confirm(`Are you sure you want to book a ${eventType.replace('-', ' ')} appointment?`)) {
            Calendly.initPopupWidget({
                url: `https://calendly.com/${CALENDLY_USER}/${eventType}`
            });
            
            // Listen for booking completion
            window.addEventListener('message', function(e) {
                if (e.data.event && e.data.event === 'calendly.event_scheduled') {
                    const appointment = processCalendlyEvent(e.data.payload);
                    saveAppointmentToAPI(appointment);
                    addAppointmentToList(appointment);
                    
                    // Show success notification
                    showNotification(`Appointment booked successfully!`, 'success');
                }
            }, { once: true }); // Only listen once
        }
    } catch (error) {
        showError(error);
    }
}

// Process Calendly event data
function processCalendlyEvent(payload) {
    return {
        id: payload.event.uuid,
        type: payload.event_type.name,
        date: new Date(payload.event.start_time).toLocaleString(),
        name: payload.invitee.name || 'No name provided',
        email: payload.invitee.email,
        status: 'confirmed',
        event_uri: payload.event.uri
    };
}

// Save to API (simulated for school project)
async function saveAppointmentToAPI(appointment) {
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = {
            status: 'success',
            data: appointment,
            message: 'Appointment saved successfully'
        };
        
        displayApiResponse(response);
        return response;
    } catch (error) {
        showError(error);
        throw error;
    }
}

// Cancel appointment in Calendly (actual implementation)
async function cancelAppointmentInCalendly(eventUri) {
    try {
        const response = await fetch(`${eventUri}/cancellation`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reason: "Cancelled by user"
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to cancel appointment');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Cancellation error:', error);
        throw error;
    }
}

// Cancel appointment function
async function cancelAppointment(id, eventUri) {
    try {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            // In a real implementation, you would call:
            // const result = await cancelAppointmentInCalendly(eventUri);
            
            // For demo purposes, we'll simulate cancellation
            const itemToRemove = document.querySelector(`.appointment-item[data-id="${id}"]`);
            
            if (itemToRemove) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                itemToRemove.remove();
                displayApiResponse({
                    status: 'success',
                    message: `Appointment cancelled successfully`
                });
                
                showNotification('Appointment cancelled!', 'success');
            } else {
                throw new Error('Appointment not found');
            }
        }
    } catch (error) {
        showError(error);
        showNotification('Failed to cancel appointment', 'error');
    }
}

// Add appointment to the UI list
function addAppointmentToList(appointment) {
    const appointmentItem = document.createElement('div');
    appointmentItem.className = `appointment-item ${appointment.status}`;
    appointmentItem.dataset.id = appointment.id;
    
    appointmentItem.innerHTML = `
        <div class="appointment-header">
            <h4>${appointment.type}</h4>
            <span class="status-badge ${appointment.status}">${appointment.status}</span>
        </div>
        <p><strong>When:</strong> ${appointment.date}</p>
        <p><strong>For:</strong> ${appointment.name}</p>
        <p><strong>Email:</strong> ${appointment.email}</p>
        <button class="cancel-btn">Cancel Appointment</button>
    `;
    
    // Add event listener for cancellation
    const cancelBtn = appointmentItem.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => cancelAppointment(appointment.id, appointment.event_uri));
    
    appointmentList.prepend(appointmentItem); // Add newest appointments at the top
}

// Display API responses
function displayApiResponse(response) {
    apiResponse.innerHTML = `
        <div class="api-response ${response.status}">
            <h4>${response.status === 'success' ? '✓ Success' : '✗ Error'}</h4>
            <pre>${JSON.stringify(response, null, 2)}</pre>
        </div>
    `;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        apiResponse.innerHTML = '';
    }, 5000);
}

// Show notification toast
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Error handling
function showError(error) {
    console.error('Error:', error);
    displayApiResponse({
        status: 'error',
        message: error.message,
        error: error.stack || 'No stack trace available'
    });
    
    showNotification(`Error: ${error.message}`, 'error');
}

// Demo functions for school project
function loadDemoAppointments() {
    const demoAppointments = [
        {
            id: 'demo-1',
            type: 'Store Visit',
            date: new Date(Date.now() + 86400000).toLocaleString(),
            name: 'Sample User',
            email: 'sample@school.edu',
            status: 'confirmed',
            event_uri: 'demo-uri-1'
        },
        {
            id: 'demo-2',
            type: 'Clinic Visit',
            date: new Date(Date.now() + 172800000).toLocaleString(),
            name: 'Test User',
            email: 'test@school.edu',
            status: 'pending',
            event_uri: 'demo-uri-2'
        }
    ];
    
    demoAppointments.forEach(app => addAppointmentToList(app));
}

// Add this CSS for notifications
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    z-index: 1000;
    animation: slide-in 0.5s ease-out;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

.notification.success {
    background: #4CAF50;
}

.notification.error {
    background: #f44336;
}

.notification.info {
    background: #2196F3;
}

.fade-out {
    animation: fade-out 0.5s ease-out forwards;
}

@keyframes slide-in {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

@keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
}
`;
document.head.appendChild(style);

// Function to handle rescheduling
function rescheduleAppointment(eventUri) {
    Calendly.initPopupWidget({
        url: `https://calendly.com/app/scheduled_events/${eventUri}/reschedule`
    });
}

// Update your addAppointmentToList function:
function addAppointmentToList(appointment) {
    const appointmentItem = document.createElement('div');
    appointmentItem.className = `appointment-item ${appointment.status}`;
    appointmentItem.dataset.id = appointment.id;
    
    appointmentItem.innerHTML = `
        <div class="appointment-header">
            <h4>${appointment.type}</h4>
            <span class="status-badge ${appointment.status}">${appointment.status}</span>
        </div>
        <p><strong>When:</strong> ${appointment.date}</p>
        <p><strong>For:</strong> ${appointment.name}</p>
        <div class="appointment-actions">
            <button class="reschedule-btn">Reschedule</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    `;
    
    // Add event listeners
    appointmentItem.querySelector('.reschedule-btn').addEventListener('click', 
        () => rescheduleAppointment(appointment.event_uri));
    
    appointmentItem.querySelector('.cancel-btn').addEventListener('click', 
        () => cancelAppointment(appointment.id, appointment.event_uri));
    
    appointmentList.prepend(appointmentItem);
}