# Configuration Guide - M&M: Music and More

## Quick Setup

Your website now uses a centralized configuration system! All your studio information is stored in `config.js` and automatically updates throughout the website.

## ✅ What's Already Updated

Based on your changes to `config.js`, the following information is now automatically displayed throughout your website:

- **Phone Number**: +91 7249298876
- **Email**: musicnmore1234@gmail.com
- **WhatsApp**: +91 7249298876
- **Address**: M&M : Music and More, Near Geetanjali Saloon, Kharadi, Pune, Maharashtra 411014
- **Map Coordinates**: Set to Kharadi, Pune area

## 🔧 How to Update Your Information

### 1. Edit Contact Information
Open `config.js` and update the contact section:

```javascript
contact: {
    phone: "+91 7249298876",           // Your phone number
    email: "musicnmore1234@gmail.com", // Your email
    whatsapp: "917249298876",          // WhatsApp (numbers only)
    address: {
        street: "M&M : Music and More, Near Geetanjali Saloon",
        area: "Kharadi",
        city: "Pune",
        state: "Maharashtra",
        zip: "411014"
    }
}
```

### 2. Update Social Media Links
```javascript
social: {
    facebook: "https://facebook.com/your-actual-page",
    instagram: "https://instagram.com/your-actual-handle",
    twitter: "https://twitter.com/your-actual-handle",
    youtube: "https://youtube.com/your-actual-channel",
    tiktok: "https://tiktok.com/@your-actual-handle"
}
```

### 3. Set Up Google Maps
```javascript
maps: {
    apiKey: "YOUR_ACTUAL_GOOGLE_MAPS_API_KEY",
    coordinates: {
        lat: 18.5679,  // Your exact latitude
        lng: 73.9143   // Your exact longitude
    }
}
```

### 4. Configure Formspree
```javascript
formspree: {
    contactFormId: "your-actual-formspree-id"
}
```

## 🧪 Testing Your Configuration

1. **Open the test page**: `test-config.html`
2. **Check if all information displays correctly**
3. **Test the WhatsApp button**
4. **Verify social media links work**

## 📍 Getting Your Exact Coordinates

### Method 1: Google Maps
1. Go to [Google Maps](https://maps.google.com)
2. Search for your studio address
3. Right-click on your location
4. Copy the coordinates (first number is latitude, second is longitude)

### Method 2: GPS Coordinates
1. Use your smartphone's GPS
2. Stand at your studio location
3. Use a GPS app to get exact coordinates

### Method 3: Online Tools
1. Visit [LatLong.net](https://www.latlong.net/)
2. Enter your address
3. Copy the coordinates

## 🔑 Setting Up Google Maps API

1. **Go to Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Create a new project** or select existing one
3. **Enable Maps JavaScript API**
4. **Create credentials** (API Key)
5. **Restrict the API key** to your domain for security
6. **Copy the API key** to your `config.js`

## 📧 Setting Up Formspree

1. **Sign up at**: [formspree.io](https://formspree.io)
2. **Create a new form**
3. **Copy the form ID** (the part after `/f/` in the URL)
4. **Update `config.js`** with your form ID

## 🎨 Customizing Colors and Branding

Update the theme section in `config.js`:

```javascript
theme: {
    primary: "#ff6b6b",    // Main brand color
    secondary: "#667eea",  // Secondary color
    accent: "#764ba2",     // Accent color
    success: "#4CAF50",    // Success messages
    warning: "#FF9800",    // Warning messages
    error: "#F44336"       // Error messages
}
```

## 📱 Business Hours

Update your operating hours:

```javascript
hours: {
    weekdays: "Mon-Fri: 9AM-10PM",
    weekends: "Sat-Sun: 10AM-11PM"
}
```

## 🚀 After Making Changes

1. **Save the `config.js` file**
2. **Refresh your website**
3. **Check the test page** to verify changes
4. **Test all functionality**

## 🔍 Troubleshooting

### Information Not Updating?
- Check if `config.js` is properly saved
- Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for errors (F12)

### WhatsApp Not Working?
- Ensure phone number in `whatsapp` field has no spaces or special characters
- Format: "917249298876" (country code + number)

### Google Maps Not Loading?
- Check if API key is correct
- Ensure billing is enabled in Google Cloud Console
- Verify API key restrictions

### Contact Form Not Working?
- Verify Formspree form ID is correct
- Check if form is properly configured in Formspree dashboard

## 📞 Current Configuration Status

✅ **Phone**: +91 7249298876  
✅ **Email**: musicnmore1234@gmail.com  
✅ **WhatsApp**: +91 7249298876  
✅ **Address**: M&M : Music and More, Near Geetanjali Saloon, Kharadi, Pune, Maharashtra 411014  
✅ **Coordinates**: Kharadi, Pune area  
⚠️ **Google Maps API**: Needs setup  
⚠️ **Formspree**: Needs setup  
⚠️ **Social Media**: Needs real links  

## 🎯 Next Steps

1. **Get Google Maps API key** and update `config.js`
2. **Set up Formspree** for contact forms
3. **Add real social media links**
4. **Test everything** using `test-config.html`
5. **Go live** with your website!

---

**Need Help?** Check the `test-config.html` page to see if your configuration is loading correctly.