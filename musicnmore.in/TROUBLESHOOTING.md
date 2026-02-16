# Formspree Troubleshooting Guide

## 🚨 Not Receiving Formspree Submissions?

### Quick Checklist:

1. **✅ Check Form IDs**
   - Contact Form: `xblggydl`
   - Booking Form: `xvgkwqrd`
   - Verify these match your Formspree dashboard

2. **✅ Test Forms**
   - Open `test-forms.html` in your browser
   - Submit both test forms
   - Check if you receive emails

3. **✅ Check Email**
   - Check your inbox: `musicnmore1234@gmail.com`
   - **Check spam/junk folder** (very important!)
   - Look for emails from `@formspree.io`

4. **✅ Verify Formspree Account**
   - Log into [formspree.io](https://formspree.io)
   - Check if submissions appear in your dashboard
   - Verify email address is correct

## 🔍 Step-by-Step Debugging

### Step 1: Verify Formspree Setup
1. Go to [formspree.io](https://formspree.io)
2. Log in with your account
3. Check if you have two forms:
   - One for contact (ID: `xblggydl`)
   - One for booking (ID: `xvgkwqrd`)
4. Verify the email address associated with your account

### Step 2: Test Individual Forms
1. Open `test-forms.html`
2. Submit the contact form test
3. Submit the booking form test
4. Check browser console (F12) for any errors

### Step 3: Check Formspree Dashboard
1. After submitting test forms
2. Go to your Formspree dashboard
3. Look for new submissions
4. If submissions appear but no emails, check email settings

### Step 4: Email Troubleshooting
1. **Check spam folder** - This is the most common issue
2. Add `@formspree.io` to your email whitelist
3. Check if emails are being filtered by any rules
4. Try submitting with a different email address

## 🛠️ Common Issues & Solutions

### Issue 1: "Form not found" Error
**Cause:** Wrong form ID
**Solution:** 
- Check your Formspree dashboard for correct IDs
- Update `config.js` with correct IDs
- Refresh the website

### Issue 2: Forms Submit but No Emails
**Cause:** Email delivery issues
**Solution:**
- Check spam folder
- Verify email address in Formspree account
- Check Formspree dashboard for submissions
- Add Formspree to email whitelist

### Issue 3: JavaScript Errors
**Cause:** Script conflicts or errors
**Solution:**
- Open browser console (F12)
- Look for red error messages
- Refresh the page
- Try in incognito/private mode

### Issue 4: Forms Don't Submit
**Cause:** Network or validation issues
**Solution:**
- Check internet connection
- Fill all required fields
- Try with simple text (no special characters)
- Check browser console for errors

## 📧 Email Whitelist Instructions

### Gmail:
1. Go to Gmail Settings (gear icon)
2. Click "See all settings"
3. Go to "Filters and Blocked Addresses"
4. Create new filter for `@formspree.io`
5. Set to "Never send to Spam"

### Outlook:
1. Go to Outlook Settings
2. Click "Mail" > "Junk email"
3. Add `@formspree.io` to safe senders

## 🧪 Testing Commands

### Test 1: Basic Form Submission
```
1. Open test-forms.html
2. Submit contact form with default values
3. Check for success message
4. Check email within 5 minutes
```

### Test 2: Custom Data Test
```
1. Change test form data to your real info
2. Submit both forms
3. Verify data appears correctly in emails
```

### Test 3: Browser Console Check
```
1. Press F12 to open developer tools
2. Go to Console tab
3. Submit forms and watch for errors
4. Look for any red error messages
```

## 📊 Formspree Dashboard Check

### What to Look For:
1. **Submissions Count:** Should increase after each test
2. **Form Status:** Should show "Active"
3. **Email Settings:** Verify correct email address
4. **Spam Filter:** Check if submissions are marked as spam

### If Submissions Appear in Dashboard but No Emails:
1. Check email settings in Formspree
2. Verify email address is correct
3. Check spam folder thoroughly
4. Try changing notification email temporarily

## 🔧 Advanced Troubleshooting

### Check Network Requests:
1. Open browser developer tools (F12)
2. Go to Network tab
3. Submit a form
4. Look for POST request to formspree.io
5. Check response status (should be 200 or 302)

### Verify Form HTML:
```html
<!-- Contact Form Should Have: -->
<form action="https://formspree.io/f/xblggydl" method="POST">

<!-- Booking Form Should Have: -->
<form action="https://formspree.io/f/xvgkwqrd" method="POST">
```

### Check JavaScript Configuration:
```javascript
// In config.js, should have:
formspree: {
    contactFormId: "xblggydl",
    bookingFormId: "xvgkwqrd"
}
```

## 📞 Getting Help

### If Still Not Working:
1. **Check Formspree Status:** [status.formspree.io](https://status.formspree.io)
2. **Formspree Support:** Contact through their dashboard
3. **Test with Different Browser:** Try Chrome, Firefox, Safari
4. **Test on Different Device:** Try mobile phone

### Information to Gather:
- Browser and version
- Any error messages from console
- Screenshots of Formspree dashboard
- Whether submissions appear in dashboard
- Email provider (Gmail, Outlook, etc.)

## ✅ Success Indicators

### You'll Know It's Working When:
1. ✅ Test forms submit without errors
2. ✅ Success messages appear
3. ✅ Submissions show in Formspree dashboard
4. ✅ Emails arrive in your inbox
5. ✅ Email content is properly formatted

## 🎯 Quick Fix Checklist

Try these in order:

1. **Check spam folder** (most common fix)
2. **Refresh website** and try again
3. **Clear browser cache** and cookies
4. **Try incognito/private mode**
5. **Test with different email address**
6. **Check Formspree dashboard** for submissions
7. **Verify form IDs** are correct
8. **Add Formspree to email whitelist**

---

**💡 Pro Tip:** The most common issue is emails going to spam folder. Always check there first!