// Replace with your actual Calendly personal access token
const API_TOKEN = "your_calendly_token_here";

// Replace with your Calendly event type URIs
const EVENT_TYPES = {
    vaccination: "https://api.calendly.com/event_types/YOUR_VACCINATION_EVENT_ID",
    clinic: "https://api.calendly.com/event_types/YOUR_CLINIC_EVENT_ID",
    store: "https://api.calendly.com/event_types/YOUR_STORE_EVENT_ID"
};

// Function to display API responses
function displayResponse(data) {
    document.getElementById("response").innerHTML = 
        `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

// Check availability for an event type
async function checkAvailability(eventType) {
    try {
        // For school projects, we'll use a fixed date
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1); // Tomorrow
        const startTime = startDate.toISOString();
        
        const response = await fetch(
            `https://api.calendly.com/event_type_available_times?event_type=${EVENT_TYPES[eventType]}&start_time=${startTime}`,
            {
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        
        const data = await response.json();
        displayResponse(data);
        
        // Display available slots in a simple format
        if (data.collection && data.collection.length > 0) {
            let slotsHTML = "<h4>Available Slots:</h4><ul>";
            data.collection.forEach(slot => {
                const slotTime = new Date(slot.start_time).toLocaleString();
                slotsHTML += `<li>${slotTime}</li>`;
            });
            slotsHTML += "</ul>";
            document.getElementById("available-slots").innerHTML = slotsHTML;
        } else {
            document.getElementById("available-slots").innerHTML = "<p>No available slots found</p>";
        }
        
    } catch (error) {
        displayResponse({ error: error.message });
    }
}

// Create a test booking (for demonstration)
async function createTestBooking() {
    try {
        // For school projects, we'll use fake data
        const bookingData = {
            event_type: EVENT_TYPES.vaccination,
            invitee: {
                email: "test@schoolproject.edu",
                first_name: "Test",
                last_name: "Student"
            },
            start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            location: "Online"
        };
        
        const response = await fetch("https://api.calendly.com/scheduled_events", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        displayResponse(data);
        
    } catch (error) {
        displayResponse({ error: error.message });
    }
}