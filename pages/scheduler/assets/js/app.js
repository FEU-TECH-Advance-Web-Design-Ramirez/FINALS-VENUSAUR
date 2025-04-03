// Replace with your actual Calendly personal access token
const API_TOKEN = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzQzNjgwMDEwLCJqdGkiOiI2NDcwN2YzZC05ZWEzLTQyZWMtOTZhZi01YzMyMmNiZWMwZGUiLCJ1c2VyX3V1aWQiOiI5OTQ5MTViMS04NTM5LTRiYjAtYTE1NS0yZTg5ZGE5ZWZiNDUifQ.eJ25Di3Djsn2FLFK3nYpBV9HezDzzr72KS-oElmLQm-n8HL6peIFAtQpm1LErqw9w_YCOpF2dziWBb9IwJHKIA"
;

// assets/js/scripts.js

// Calendly configuration
const CALENDLY_USER = "ivnbdngn5";
const EVENT_URLS = {
    store: `https://api.calendly.com/scheduled_events?event_type=https://api.calendly.com/event_types/${CALENDLY_USER}/store-visit`,
    clinic: `https://api.calendly.com/scheduled_events?event_type=https://api.calendly.com/event_types/${CALENDLY_USER}/clinic-visit`,
    extended: `https://api.calendly.com/scheduled_events?event_type=https://api.calendly.com/event_types/${CALENDLY_USER}/30min`
};

// DOM Elements
const appointmentList = document.getElementById('appointment-list');
const apiResponse = document.getElementById('api-response');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load any existing appointments (for demo purposes)
    loadDemoAppointments();
    
    // Set up hamburger menu (from your original code)
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobileNav');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('is-active');
        mobileNav.classList.toggle('active');
    });
});

// Enhanced booking function with API integration
async function bookAppointment(eventType) {
    try {
        // First show the Calendly widget
        Calendly.initPopupWidget({
            url: `https://calendly.com/${CALENDLY_USER}/${eventType}`
        });
        
        // Listen for booking completion
        window.addEventListener('message', function(e) {
            if(e.data.event && e.data.event === 'calendly.event_scheduled') {
                const appointment = processCalendlyEvent(e.data.payload);
                saveAppointmentToAPI(appointment);
                addAppointmentToList(appointment);
            }
        });
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
        name: payload.invitee.name,
        email: payload.invitee.email,
        status: 'confirmed'
    };
}

// Save to "API" (simulated for school project)
async function saveAppointmentToAPI(appointment) {
    try {
        // In a real app, this would be a fetch() call to your backend
        const response = {
            status: 'success',
            data: appointment
        };
        
        displayApiResponse(response);
        return response;
    } catch (error) {
        showError(error);
    }
}

// Display API responses
function displayApiResponse(response) {
    apiResponse.innerHTML = `
        <div class="api-response ${response.status}">
            <h4>API Response (Simulated):</h4>
            <pre>${JSON.stringify(response, null, 2)}</pre>
        </div>
    `;
}

// Error handling
function showError(error) {
    console.error('Error:', error);
    apiResponse.innerHTML = `
        <div class="api-response error">
            <h4>Error:</h4>
            <p>${error.message}</p>
        </div>
    `;
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
            status: 'confirmed'
        },
        {
            id: 'demo-2',
            type: 'Clinic Visit',
            date: new Date(Date.now() + 172800000).toLocaleString(),
            name: 'Test User',
            email: 'test@school.edu',
            status: 'pending'
        }
    ];
    
    demoAppointments.forEach(app => addAppointmentToList(app));
}

function addAppointmentToList(appointment) {
    const appointmentItem = document.createElement('div');
    appointmentItem.className = `appointment-item ${appointment.status}`;
    appointmentItem.innerHTML = `
        <div class="appointment-header">
            <h4>${appointment.type}</h4>
            <span class="status-badge ${appointment.status}">${appointment.status}</span>
        </div>
        <p><strong>When:</strong> ${appointment.date}</p>
        <p><strong>For:</strong> ${appointment.name}</p>
        <button onclick="cancelAppointment('${appointment.id}')" class="cancel-btn">Cancel</button>
    `;
    appointmentList.appendChild(appointmentItem);
}

// Simulated cancel function
function cancelAppointment(id) {
    // In a real app, this would call the Calendly API
    const item = document.querySelector(`.appointment-item [data-id="${id}"]`);
    if (item) {
        item.remove();
        displayApiResponse({
            status: 'success',
            message: `Appointment ${id} cancelled`
        });
    }
}