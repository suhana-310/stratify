# 📧 Email Preview Directory

This directory contains HTML email previews generated during development.

## How It Works

When the application is running in development mode without email credentials configured, all emails are saved as HTML files in this directory instead of being sent to actual email addresses.

## Viewing Emails

1. **Registration Emails**: When users register, their confirmation emails are saved here
2. **Password Reset Emails**: Password reset requests generate preview files
3. **Welcome Emails**: New user welcome messages are stored here

## File Naming

Email files are named with the pattern:
```
email-[timestamp]-[email_address].html
```

Example: `email-2026-04-06T19-35-35-198Z-john_smith_example_com.html`

## Opening Emails

Simply double-click any `.html` file to open it in your default browser and see exactly how the email would appear to the recipient.

## Production Behavior

In production with proper email credentials configured, emails are sent normally and this directory is not used.

---

*This is a development feature to help you test and preview email functionality.*