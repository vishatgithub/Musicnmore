# Formspree Setup Guide - M&M: Music and More

## 🎯 Overview

Your website now has **two forms** that will send messages directly to your Formspree account:

1. **Contact Form** - General inquiries and messages
2. **Booking Calendar** - Studio session bookings

## 📧 What You'll Receive

### Contact Form Submissions:
- **Subject**: "New Contact Form Submission - M&M Studio"
- **Contains**: Name, Email, Phone, Inquiry Type, Message
- **Form Type**: contact_form

### Booking Form Submissions:
- **Subject**: "New Studio Booking - M&M Studio"
- **Contains**: All booking details in a formatted summary
- **Form Type**: booking_form
- **Includes**: Date, Service, Time, Customer details, Special requests, Booking ID

## 🚀 Quick Setup Steps

### Step 1: Create Formspree Account
1. Go to [formspree.io](https://formspree.io)
2. Sign up with your email: **musicnmore1234@gmail.com**
3. Verify your email address

### Step 2: Create Your Form
1. Click "New Form" in your Formspree dashboard
2. **Form Name**: "M&M Studio Contact & Booking"
3. **Form Endpoint**: Copy the form ID (e.g., "abc123def")

### Step 3: Update Your Website
1. Open `config.js` file
2. Replace the form ID:
```javascript
formspree: {
    contactFormId: "YOUR_ACTUAL_FORM_ID" // Replace with your form ID
}
```

### Step 4: Test Your Forms
1. Open your website
2. Test the contact form
3. Test the booking calendar
4. Check your email for submissions

## 📋 Current Configuration

### ✅ Already Set Up:
- **Forms configured** to send to Formspree
- **Proper field names** for easy identification
- **Success/error handling** with user-friendly messages
- **Thank you pages** for both forms
- **Spam protection** enabled
- **Form validation** implemented

### ⚠️ Needs Your Action:
- **Replace form ID** in `config.js` with your actual Formspree form ID
- **Test both forms** after updating the form ID

## 📧 Email Notifications

### Contact Form Email Format:
```
Subject: New Contact Form Submission - M&M Studio

Name: [Customer Name]
Email: [Customer Email]
Phone: [Customer Phone]
Inquiry Type: [Selected Type]
Message: [Customer Message]
Form Type: contact_form
```

### Booking Form Email Format:
```
Subject: New Studio Booking - M&M Studio

BOOKING DETAILS:
================
Date: [Selected Date]
Service: [Room and Service Type]
Time: [Selected Time Slot]
Customer: [Customer Name]
Phone: [Customer Phone]
Email: [Customer Email]
Special Requests: [Any special requests]

Booking ID: [Unique ID]
Submitted: [Date and Time]
Form Type: booking_form
```

## 🔧 Advanced Configuration

### Formspree Settings (Optional):
1. **Custom Thank You Page**: Already configured
2. **Spam Protection**: Enabled by default
3. **Email Notifications**: Automatic
4. **Form Analytics**: Available in Formspree dashboard

### Webhook Integration (Advanced):
If you want to integrate with other systems:
1. Go to your Formspree form settings
2. Add webhook URL
3. Configure payload format

## 🧪 Testing Checklist

### Contact Form Test:
- [ ] Fill out contact form
- [ ] Submit successfully
- [ ] See success message
- [ ] Receive email notification
- [ ] Check spam folder if needed

### Booking Form Test:
- [ ] Select a date on calendar
- [ ] Choose room and time
- [ ] Fill customer details
- [ ] Submit booking
- [ ] See booking confirmation
- [ ] Receive booking email
- [ ] Verify all details are correct

## 🚨 Troubleshooting

### Form Not Submitting?
1. **Check form ID**: Ensure it's correct in `config.js`
2. **Check browser console**: Look for JavaScript errors
3. **Test with simple data**: Use basic text without special characters
4. **Check Formspree status**: Visit [status.formspree.io](https://status.formspree.io)

### Not Receiving Emails?
1. **Check spam folder**: Formspree emails might go to spam initially
2. **Verify email address**: Ensure your Formspree account email is correct
3. **Check Formspree dashboard**: See if submissions are recorded
4. **Whitelist Formspree**: Add `@formspree.io` to your email whitelist

### Error Messages?
- **"Form not found"**: Wrong form ID in config
- **"Invalid email"**: Email field validation failed
- **"Spam detected"**: Try submitting with different content

## 📊 Formspree Dashboard

### What You Can See:
- **All form submissions** with timestamps
- **Submission details** and data
- **Form analytics** and statistics
- **Spam filtering** results
- **Export options** for data

### Managing Submissions:
- **Mark as spam** if needed
- **Export to CSV** for record keeping
- **Set up integrations** with other tools
- **Configure email templates**

## 💰 Formspree Pricing

### Free Plan:
- **50 submissions/month**
- **Basic spam filtering**
- **Email notifications**
- **Perfect for starting out**

### Paid Plans:
- **More submissions**
- **Advanced features**
- **Custom integrations**
- **Priority support**

## 🔐 Security Features

### Already Implemented:
- **CSRF protection** via Formspree
- **Spam filtering** enabled
- **Rate limiting** by Formspree
- **Data validation** on frontend
- **Secure HTTPS** submission

## 📞 Support

### Need Help?
1. **Formspree Documentation**: [help.formspree.io](https://help.formspree.io)
2. **Formspree Support**: Available through their dashboard
3. **Test Page**: Use `test-config.html` to verify setup

## ✅ Final Checklist

- [ ] Created Formspree account
- [ ] Created new form in Formspree
- [ ] Updated `config.js` with actual form ID
- [ ] Tested contact form submission
- [ ] Tested booking form submission
- [ ] Received both types of emails
- [ ] Verified all data is captured correctly
- [ ] Added Formspree to email whitelist

---

**🎉 Once completed, both your contact form and booking calendar will send all submissions directly to your email via Formspree!**

## 📧 Your Current Setup:
- **Email**: musicnmore1234@gmail.com
- **Phone**: +91 7249298876
- **WhatsApp**: +91 7249298876
- **Form ID**: xpzgkqko (replace with your actual ID)

**Next Step**: Replace "xpzgkqko" in `config.js` with your actual Formspree form ID!