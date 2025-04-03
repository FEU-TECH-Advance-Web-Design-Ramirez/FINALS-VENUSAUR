// Replace with your actual Calendly personal access token
const API_TOKEN = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzQzNjgwMDEwLCJqdGkiOiI2NDcwN2YzZC05ZWEzLTQyZWMtOTZhZi01YzMyMmNiZWMwZGUiLCJ1c2VyX3V1aWQiOiI5OTQ5MTViMS04NTM5LTRiYjAtYTE1NS0yZTg5ZGE5ZWZiNDUifQ.eJ25Di3Djsn2FLFK3nYpBV9HezDzzr72KS-oElmLQm-n8HL6peIFAtQpm1LErqw9w_YCOpF2dziWBb9IwJHKIA";

// Calendly configuration
const CALENDLY_USER = "ivnbdngn5";
const EVENT_URLS = {
    store: `https://api.calendly.com/event_types/${CALENDLY_USER}/store-visit`,
    clinic: `https://api.calendly.com/event_types/${CALENDLY_USER}/clinic-visit`,
    extended: `https://api.calendly.com/event_types/${CALENDLY_USER}/30min`,
    petcheckup: `https://api.calendly.com/event_types/${CALENDLY_USER}/pet-checkup`
};

// DOM Elements
const appointmentList = document.getElementById('appointment-list');
const apiResponse = document.getElementById('api-response');



// Track all appointments (including newly booked ones)
let allAppointments = [...serverAppointments];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load appointments from server
    loadAppointments();
    
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

    // Listen for booking events
    window.addEventListener('message', function(e) {
        if (e.data.event && e.data.event === 'calendly.event_scheduled') {
            handleNewBooking(e.data.payload);
        }
    });
});

function handleNewBooking(payload) {
    const newAppointment = processCalendlyEvent(payload);
    
    // Add to our tracking array
    allAppointments.push(newAppointment);
    
    // Save to our "server"
    saveAppointmentToAPI(newAppointment)
        .then(() => {
            // Add to UI
            addAppointmentToList(newAppointment);
            showNotification('Appointment booked successfully!', 'success');
        })
        .catch(error => {
            showError(error);
        });
}

// Simulated API functions
async function fetchAppointments() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return only non-cancelled appointments
    return allAppointments.filter(app => !app.cancelled);
}

async function cancelAppointmentOnServer(id) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find and mark appointment as cancelled
    const appointment = allAppointments.find(app => app.id === id);
    if (appointment) {
        appointment.cancelled = true;
        return { success: true };
    }
    throw new Error('Appointment not found');
}

// Load appointments from server
async function loadAppointments() {
    try {
        const appointments = await fetchAppointments();
        
        // Clear existing appointments
        appointmentList.innerHTML = '';
        
        if (appointments.length > 0) {
            appointments.forEach(app => addAppointmentToList(app));
        } else {
            appointmentList.innerHTML = '<p class="no-appointments">No appointments found</p>';
        }
    } catch (error) {
        showError(error);
        appointmentList.innerHTML = '<p class="no-appointments">No appointments found</p>';
    }
}

// Enhanced booking function with API integration
async function bookAppointment(eventType) {
    try {
        // Show confirmation before opening Calendly
        if (confirm(`Are you sure you want to book a ${eventType.replace('-', ' ')} appointment?`)) {
            Calendly.initPopupWidget({
                url: `https://calendly.com/${CALENDLY_USER}/${eventType}`
            });
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
        event_uri: payload.event.uri,
        cancelled: false
    };
}

// Save to API (simulated for school project)
async function saveAppointmentToAPI(appointment) {
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would POST to your server
        serverAppointments.push(appointment);
        
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
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Update our server
            const serverResult = await cancelAppointmentOnServer(id);
            
            // Remove from UI
            const itemToRemove = document.querySelector(`.appointment-item[data-id="${id}"]`);
            if (itemToRemove) {
                itemToRemove.remove();
            }
            
            displayApiResponse({
                status: 'success',
                message: `Appointment cancelled successfully`
            });
            
            showNotification('Appointment cancelled!', 'success');
            
            // If no appointments left, show empty state
            if (appointmentList.children.length === 0) {
                appointmentList.innerHTML = '<p class="no-appointments">No appointments found</p>';
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

// Function to handle rescheduling
function rescheduleAppointment(eventUri) {
    Calendly.initPopupWidget({
        url: `https://calendly.com/app/scheduled_events/${eventUri}/reschedule`
    });
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

// Add CSS for notifications and empty state
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

.no-appointments {
    text-align: center;
    padding: 20px;
    color: #666;
    font-style: italic;
}

.appointment-item {
    background: white;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.appointment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

@keyframes slide-in {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

@keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
}

.reschedule-btn {
    background: #17a2b8;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    margin-right: 0.5rem;
    cursor: pointer;
    transition: background 0.3s;
}

.reschedule-btn:hover {
    background: #138496;
}

.appointment-actions {
    margin-top: 1rem;
    display: flex;
}
`;
document.head.appendChild(style);