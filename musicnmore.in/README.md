# M&M: Music and More - Studio Website

A professional, responsive website for M&M: Music and More studio featuring booking calendar, gallery, contact forms, and more.

## Features

### 🎵 Multi-Service Studio
- **Jamming Sessions**: Professional jamming room with quality instruments
- **Gaming Sessions**: State-of-the-art gaming setup with latest consoles and PCs
- **Recording Studio**: Professional recording with industry-standard equipment
- **Outdoor Café**: Relaxing café space for breaks and meetings

### 📅 Booking System
- Interactive calendar for session booking
- Room-specific time slot management
- Real-time availability checking
- Local storage for booking data
- Form validation and confirmation

### 🖼️ Dynamic Gallery
- Filterable image gallery by category
- Lightbox with navigation controls
- Lazy loading for performance
- Responsive masonry layout
- Load more functionality

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly navigation
- Optimized for all screen sizes
- Progressive Web App features

### ✨ Interactive Features
- Smooth scrolling navigation
- AOS (Animate On Scroll) animations
- Parallax effects
- Typing animations
- Progress indicators

### 📞 Contact & Communication
- Formspree integration for contact forms
- Google Maps integration
- Global WhatsApp button
- Social media links
- Multiple contact methods

## File Structure

```
music/
├── index.html          # Main homepage
├── gallery.html        # Dedicated gallery page
├── styles.css          # Main stylesheet
├── gallery.css         # Gallery-specific styles
├── script.js           # Main JavaScript functionality
├── gallery.js          # Gallery-specific JavaScript
└── README.md          # This file
```

## Setup Instructions

### 1. Basic Setup
1. Download all files to your web server directory
2. Ensure all files are in the same folder
3. Open `index.html` in a web browser

### 2. Formspree Configuration
1. Sign up at [Formspree.io](https://formspree.io)
2. Create a new form
3. Replace `xpzgkqko` in the contact form action with your form ID:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form">
   ```

### 3. Google Maps Setup
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com)
2. Replace `YOUR_API_KEY` in the script tag:
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
   ```
3. Update the coordinates in `script.js`:
   ```javascript
   const studioLocation = { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE };
   ```

### 4. WhatsApp Integration
1. Replace the phone number in the WhatsApp button:
   ```html
   <a href="https://wa.me/YOUR_PHONE_NUMBER" target="_blank">
   ```

### 5. Social Media Links
Update the social media links in the footer:
```html
<a href="YOUR_FACEBOOK_URL" class="social-icon"><i class="fab fa-facebook-f"></i></a>
<a href="YOUR_INSTAGRAM_URL" class="social-icon"><i class="fab fa-instagram"></i></a>
<!-- Add your actual social media URLs -->
```

### 6. Content Customization
- Update studio name, address, and contact information
- Replace placeholder images with your actual studio photos
- Modify service descriptions and pricing
- Customize color scheme in CSS variables

## Customization

### Color Scheme
The main colors can be changed by modifying these CSS variables:
```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #667eea;
    --accent-color: #764ba2;
}
```

### Images
Replace the Unsplash placeholder images with your own:
1. Take high-quality photos of your studio
2. Optimize images for web (recommended: WebP format, max 1200px width)
3. Update image URLs in HTML files

### Booking System
The booking system uses localStorage for demo purposes. For production:
1. Integrate with a backend database
2. Add payment processing
3. Implement email confirmations
4. Add admin panel for booking management

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Features
- Lazy loading images
- Debounced scroll events
- Optimized animations
- Compressed assets
- Progressive enhancement

## SEO Optimization
- Semantic HTML structure
- Meta tags for social sharing
- Alt text for all images
- Structured data markup ready
- Fast loading times

## Accessibility
- ARIA labels where needed
- Keyboard navigation support
- High contrast ratios
- Screen reader friendly
- Focus indicators

## Dependencies
- Font Awesome 6.0.0 (icons)
- Google Fonts (Poppins)
- AOS Library (animations)
- Google Maps API (optional)

## License
This project is open source and available under the MIT License.

## Support
For customization help or technical support, please contact the developer.

---

**Note**: Remember to replace all placeholder content (phone numbers, addresses, social media links, API keys) with your actual studio information before going live.