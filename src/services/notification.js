/**
 * Cobble Hills Golf Booking App
 * Notification Service
 */

import nodemailer from 'nodemailer';
import { getSettings } from '../database/index.js';

// Create a transporter object using SMTP transport
let transporter = null;

/**
 * Initialize the email transporter
 */
function initializeTransporter() {
  // Only initialize if SMTP settings are provided
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    console.log('Email transporter initialized');
  } else {
    console.warn('Email transporter not initialized: Missing SMTP configuration');
  }
}

/**
 * Send an email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email body
 * @param {string} options.html - HTML email body (optional)
 * @returns {Promise<boolean>} - True if email was sent successfully
 */
async function sendEmail(options) {
  // Check if notifications are enabled
  const settings = getSettings();
  if (!settings.notifications.enabled) {
    console.log('Notifications are disabled. Email not sent.');
    return false;
  }
  
  // Check if transporter is initialized
  if (!transporter) {
    console.error('Email transporter not initialized');
    return false;
  }
  
  try {
    // Set the from address
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    
    // Send the email
    const info = await transporter.sendMail({
      from: `"Cobble Hills Golf Booking" <${from}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    });
    
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send a booking confirmation email
 * @param {Object} booking - The booking object
 * @param {string} email - The recipient email address
 * @returns {Promise<boolean>} - True if email was sent successfully
 */
async function sendBookingConfirmation(booking, email) {
  // Check if booking confirmation emails are enabled
  const settings = getSettings();
  if (!settings.notifications.emailOnBookingSuccess) {
    console.log('Booking confirmation emails are disabled');
    return false;
  }
  
  // Format the date and time
  const date = new Date(booking.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Format the players list
  const playersList = booking.players
    .map(player => `- ${player.name}`)
    .join('\n');
  
  // Create the email content
  const subject = `Tee Time Confirmation - Cobble Hills Golf Course`;
  const text = `
Your tee time at Cobble Hills Golf Course has been confirmed!

Date: ${formattedDate}
Time: ${booking.time}
Confirmation Number: ${booking.confirmationNumber || 'N/A'}
Cart: ${booking.useCart ? 'Yes' : 'No'}

Players:
${playersList}

Please arrive at least 15 minutes before your tee time.

Thank you for choosing Cobble Hills Golf Course!
`;
  
  // Send the email
  return sendEmail({
    to: email,
    subject,
    text,
  });
}

/**
 * Send a booking failure notification
 * @param {Object} bookingData - The booking data that failed
 * @param {string} error - The error message
 * @param {string} email - The recipient email address
 * @returns {Promise<boolean>} - True if email was sent successfully
 */
async function sendBookingFailure(bookingData, error, email) {
  // Check if booking failure emails are enabled
  const settings = getSettings();
  if (!settings.notifications.emailOnBookingFailure) {
    console.log('Booking failure emails are disabled');
    return false;
  }
  
  // Format the date and time
  const date = new Date(bookingData.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Create the email content
  const subject = `Tee Time Booking Failed - Cobble Hills Golf Course`;
  const text = `
We were unable to book your tee time at Cobble Hills Golf Course.

Date: ${formattedDate}
Time: ${bookingData.time}

Error: ${error}

Please try booking again or contact Cobble Hills Golf Course directly.
`;
  
  // Send the email
  return sendEmail({
    to: email,
    subject,
    text,
  });
}

/**
 * Send a tee time reminder
 * @param {Object} booking - The booking object
 * @param {string} email - The recipient email address
 * @returns {Promise<boolean>} - True if email was sent successfully
 */
async function sendTeeTimeReminder(booking, email) {
  // Check if reminder emails are enabled
  const settings = getSettings();
  if (!settings.notifications.emailReminderEnabled) {
    console.log('Reminder emails are disabled');
    return false;
  }
  
  // Format the date and time
  const date = new Date(booking.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Format the players list
  const playersList = booking.players
    .map(player => `- ${player.name}`)
    .join('\n');
  
  // Create the email content
  const subject = `Tee Time Reminder - Cobble Hills Golf Course`;
  const text = `
This is a reminder for your upcoming tee time at Cobble Hills Golf Course.

Date: ${formattedDate}
Time: ${booking.time}
Confirmation Number: ${booking.confirmationNumber || 'N/A'}
Cart: ${booking.useCart ? 'Yes' : 'No'}

Players:
${playersList}

Please arrive at least 15 minutes before your tee time.

Thank you for choosing Cobble Hills Golf Course!
`;
  
  // Send the email
  return sendEmail({
    to: email,
    subject,
    text,
  });
}

export {
  initializeTransporter,
  sendEmail,
  sendBookingConfirmation,
  sendBookingFailure,
  sendTeeTimeReminder,
};
