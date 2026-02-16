// Configuration file for M&M: Music and More website
// Update these values with your actual studio information

const STUDIO_CONFIG = {
    // Studio Information
    name: "M&M: Music and More",
    tagline: "Your ultimate destination for music, gaming, and creativity",
    
    // Contact Information
    contact: {
        phone: "+91 7249298876",
        email: "musicnmore1234@gmail.com",
        whatsapp: "917249298876", // Phone number for WhatsApp (without + or spaces)
        address: {
            street: "M&M : Music and More, Near Geetanjali Saloon",
            area: "Kharadi",
            city: "Pune",
            state: "Maharashtra",
            zip: "411014"
        }
    },
    
    // Business Hours
    hours: {
        weekdays: "Mon-Fri: 9AM-10PM",
        weekends: "Sat-Sun: 10AM-11PM"
    },
    
    // Social Media Links
    social: {
        facebook: "https://facebook.com/your-studio",
        instagram: "https://instagram.com/your-studio",
        twitter: "https://twitter.com/your-studio",
        youtube: "https://youtube.com/your-studio",
        tiktok: "https://tiktok.com/@your-studio"
    },
    
    // Google Maps Configuration
    maps: {
        apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
        coordinates: {
            lat: 18.5679, // Kharadi, Pune coordinates
            lng: 73.9143 // Kharadi, Pune coordinates
        }
    },
    
    // Formspree Configuration
    formspree: {
        contactFormId: "xblggydl", // Contact form ID
        bookingFormId: "xvgkwqrd"  // Booking form ID
    },
    
    // Services Configuration
    services: {
        room1: {
            name: "Room 1: Jamming & Gaming",
            description: "Multi-purpose room for jamming sessions or gaming. Only one service available per hour.",
            features: ["Jamming Equipment", "Gaming Setup", "Sound System"]
        },
        room2: {
            name: "Room 2: Recording Studio",
            description: "Dedicated professional recording studio with isolation booth and mixing capabilities.",
            features: ["Recording Equipment", "Mixing Console", "Isolation Booth"]
        }
    },
    
    // Booking Configuration
    booking: {
        timeSlots: [
            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
            '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
        ],
        roomOptions: [
            { value: "room1-jamming", label: "Room 1 - Jamming Session" },
            { value: "room1-gaming", label: "Room 1 - Gaming Session" },
            { value: "room2-recording", label: "Room 2 - Recording Studio" }
        ]
    },
    
    // Theme Colors
    theme: {
        primary: "#ff6b6b",
        secondary: "#667eea",
        accent: "#764ba2",
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#F44336"
    },
    
    // Gallery Categories
    gallery: {
        categories: [
            { id: "all", label: "All" },
            { id: "recording", label: "Recording Studio" },
            { id: "jamming", label: "Jamming Room" },
            { id: "gaming", label: "Gaming Setup" },
            { id: "cafe", label: "Outdoor Café" },
            { id: "events", label: "Events" }
        ]
    }
};

// Export configuration for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STUDIO_CONFIG;
}

// Make configuration available globally
window.STUDIO_CONFIG = STUDIO_CONFIG;