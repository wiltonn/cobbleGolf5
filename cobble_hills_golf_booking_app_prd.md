# Cobble Hills Golf Booking App - Product Requirements Document

## Overview  
The Cobble Hills Golf Booking App is a personal-use web application designed to automate the process of searching for and booking tee times at Cobble Hills Golf Course. The app specifically focuses on booking times for the "Cobble Hills Mens' League 2025" on Wednesdays, at least one week in advance. It handles the entire booking process including logging in, selecting available times, adding players from a regular group, choosing cart options, and completing payment.

This application solves the problem of manually checking for and booking tee times, which can be time-consuming and may result in missing preferred slots. It's designed for personal use by a regular golfer who plays with a consistent group of friends.

## Core Features  

### 1. Automated Tee Time Search
- **What it does**: Automatically searches for available tee times on the Cobble Hills booking website
- **Why it's important**: Saves time from manually checking the website
- **How it works**: The app navigates to https://admin.teeon.com/portal/golfnorth/teetimes/cobblehills, selects the "Cobble Hills Mens' League 2025" button, and checks for available times on Wednesdays at least one week in the future

### 2. Secure Authentication
- **What it does**: Logs into the booking system using existing credentials
- **Why it's important**: Enables the app to make bookings on behalf of the user
- **How it works**: The app securely stores and uses login credentials to authenticate with the booking system

### 3. Player Management
- **What it does**: Maintains a database of regular golf partners
- **Why it's important**: Simplifies the process of adding players to bookings
- **How it works**: The app stores information about regular golf partners (Nathan Wilton, Dave Cole, Dan Clark, and Gord Johnson) and allows selection of who will be playing for each booking

### 4. Booking Completion
- **What it does**: Finalizes the booking by selecting times, cart options, and processing payment
- **Why it's important**: Completes the entire booking process automatically
- **How it works**: The app selects the preferred time slot, adds the selected players to the foursome, chooses cart options, and completes the payment process using stored payment information

### 5. Booking Confirmation
- **What it does**: Sends an email notification confirming the booking
- **Why it's important**: Provides confirmation and details of successful bookings
- **How it works**: After completing a booking, the app sends an email to nathan.wilton@gmail.com with the booking details

## User Experience  

### User Personas
- **Primary User**: Nathan Wilton, a regular golfer who plays weekly with friends at Cobble Hills Golf Course as part of the Men's League

### Key User Flows
1. **Initial Setup**:
   - User enters login credentials for the booking site
   - User adds regular golf partners to the database
   - User configures payment information
   - User sets preferences for tee times

2. **Regular Usage**:
   - User selects which friends are playing this week
   - User initiates the booking process
   - App searches for available times and presents options
   - User confirms booking details
   - App completes the booking and sends confirmation

### UI/UX Considerations
- Simple, clean interface focused on functionality
- Clear display of available tee times
- Easy selection of golf partners
- Prominent booking status and confirmation information
- Minimal interaction required for regular bookings

## Technical Architecture  

### System Components

1. **Frontend**:
   - Web interface built with HTML, CSS, and JavaScript
   - Simple dashboard showing upcoming bookings and booking status
   - Form for selecting which friends are playing

2. **Backend**:
   - Node.js server to handle the automation logic
   - Puppeteer for web scraping and form submission
   - Email notification service

3. **Database**:
   - Simple JSON or SQLite database to store:
     - Player information
     - Booking history
     - Application settings

4. **Security Layer**:
   - Secure storage for credentials and payment information
   - Environment variables for sensitive data
   - HTTPS for all communications

### Data Models

1. **Player**:
   ```javascript
   {
     id: String,
     name: String,
     email: String (optional),
     phone: String (optional)
   }
   ```

2. **Booking**:
   ```javascript
   {
     id: String,
     dateTime: Date,
     players: Array<PlayerId>,
     useCart: Boolean,
     confirmationNumber: String,
     status: Enum['pending', 'confirmed', 'completed', 'cancelled']
   }
   ```

3. **Settings**:
   ```javascript
   {
     credentials: {
       email: String,
       password: String
     },
     paymentInfo: {
       cardNumber: String,
       expiryDate: String,
       cvv: String,
       billingAddress: String
     },
     preferences: {
       dayOfWeek: 'Wednesday',
       timeRange: {
         earliest: String,
         latest: String
       },
       notificationEmail: String
     }
   }
   ```

### APIs and Integrations

1. **Web Automation**:
   - Puppeteer to interact with the booking website
   - Handles login, navigation, form filling, and submission

2. **Email Service**:
   - Integration with Nodemailer to send confirmation emails

3. **Payment Processing**:
   - Secure handling of payment information for checkout

## Development Roadmap  

### Phase 1: MVP (Minimum Viable Product)

1. **Basic Web Scraping Setup**:
   - Set up Puppeteer to navigate to the booking website
   - Implement login functionality using stored credentials
   - Navigate to the "Cobble Hills Mens' League 2025" section

2. **Tee Time Search**:
   - Implement logic to find available tee times on Wednesdays
   - Parse and display available time slots

3. **Simple Player Database**:
   - Create a basic database to store player information
   - Implement functionality to select players for a booking

4. **Basic Booking Process**:
   - Implement the flow to select a time slot
   - Add selected players to the foursome
   - Select cart options
   - Complete the booking process

5. **Simple Notification**:
   - Send a basic email notification upon successful booking

### Phase 2: Enhancements

1. **Improved User Interface**:
   - Create a more user-friendly dashboard
   - Add booking history view
   - Implement settings management

2. **Advanced Booking Logic**:
   - Add preferences for time of day
   - Implement automatic selection of best available time based on preferences

3. **Secure Payment Handling**:
   - Implement more secure storage for payment information
   - Add option to use different payment methods

4. **Enhanced Notifications**:
   - Improve email template with more details
   - Add optional notifications for golf partners

5. **Error Handling and Recovery**:
   - Implement robust error handling for website changes
   - Add retry mechanisms for failed booking attempts

## Logical Dependency Chain

1. **Foundation First**:
   - Set up the project structure and development environment
   - Implement the web scraping and automation framework
   - Create the basic database structure

2. **Core Functionality**:
   - Implement login and authentication
   - Develop tee time search functionality
   - Create player selection interface
   - Implement the basic booking process

3. **Completion and Notification**:
   - Add payment processing
   - Implement email notifications
   - Create booking confirmation handling

4. **Refinement and Enhancement**:
   - Improve user interface
   - Add advanced features and preferences
   - Enhance security measures
   - Implement error handling and recovery

## Risks and Mitigations  

### Technical Challenges

1. **Website Structure Changes**:
   - **Risk**: The booking website could change its structure, breaking the automation
   - **Mitigation**: Implement flexible selectors and regular testing; add monitoring to detect changes

2. **Authentication Challenges**:
   - **Risk**: The site might implement CAPTCHA or other anti-bot measures
   - **Mitigation**: Design the system to pause and notify the user when human intervention is needed

3. **Payment Security**:
   - **Risk**: Storing payment information creates security vulnerabilities
   - **Mitigation**: Use secure storage methods (not environment files); consider alternatives like prompting for CVV each time or using a secure payment vault service

### Implementation Considerations

1. **Booking Speed**:
   - **Risk**: Popular tee times might be booked quickly by others
   - **Mitigation**: Optimize the booking process for speed; implement automatic retry with alternative times

2. **Reliability**:
   - **Risk**: The automation might fail due to network issues or timeouts
   - **Mitigation**: Implement robust error handling, logging, and notification of failures

3. **Maintenance**:
   - **Risk**: The app might require regular updates as the booking site evolves
   - **Mitigation**: Design with modularity in mind to make updates easier; implement monitoring to detect when changes are needed

## Appendix  

### Research Findings

1. **Booking Website Analysis**:
   - The booking website (https://admin.teeon.com/portal/golfnorth/teetimes/cobblehills) uses a standard form-based interface
   - The "Cobble Hills Mens' League 2025" is a specific button/option on the booking page
   - Wednesday bookings are specifically for the men's league

2. **User Requirements**:
   - Regular players: Nathan Wilton, Dave Cole, Dan Clark, and Gord Johnson
   - Preference for email notifications to nathan.wilton@gmail.com
   - Need for secure storage of payment information

### Technical Specifications

1. **Environment Requirements**:
   - Node.js runtime environment
   - Web server for hosting the application
   - Database for storing player and booking information
   - Email service for sending notifications

2. **Security Considerations**:
   - Secure storage of login credentials
   - Encrypted storage of payment information
   - HTTPS for all communications
   - Regular security audits and updates
