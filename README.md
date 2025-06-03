# Cobble Hills Golf Booking App

An application to automate booking tee times at Cobble Hills Golf Course.

## Features

- Search for available tee times at Cobble Hills Golf Course
- Book tee times manually or automatically
- Manage players and their information
- Schedule automatic bookings for preferred tee times
- Receive email notifications for successful bookings
- User-friendly web interface

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- A modern web browser
- Email account for sending notifications (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cobble-hills-golf-booking-app.git
   cd cobble-hills-golf-booking-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your configuration:
   - Set your email credentials for notifications
   - Configure your preferred tee time settings
   - Adjust scheduler settings

## Usage

### Development Mode

Start the application in development mode with hot reloading:

```bash
npm run dev
```

The application will be available at http://localhost:3000 (or the port you specified in the `.env` file).

### Production Mode

Start the application in production mode:

```bash
npm start
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

Fix automatically fixable issues:

```bash
npm run lint:fix
```

### Testing

Run tests:

```bash
npm test
```

## Configuration

The application can be configured using environment variables in the `.env` file:

### Server Configuration
- `PORT`: The port on which the server will run (default: 3000)
- `NODE_ENV`: The environment mode (development, production)

### Authentication
- `JWT_SECRET`: Secret key for JWT token generation

### Golf Course
- `COBBLE_HILLS_URL`: The URL of the Cobble Hills Golf Course booking page

### Email Notifications
- `EMAIL_SERVICE`: Email service provider (e.g., gmail, outlook)
- `EMAIL_USER`: Email username/address
- `EMAIL_PASSWORD`: Email password or app-specific password
- `EMAIL_FROM`: Sender email address

### Scheduler
- `SCHEDULER_CRON_EXPRESSION`: Cron expression for when to run the scheduler
- `BOOKING_DAYS_AHEAD`: Number of days ahead to book
- `PREFERRED_TEE_TIME`: Preferred tee time in 24-hour format (HH:MM)
- `TEE_TIME_FLEXIBILITY_MINUTES`: Flexibility in minutes around preferred time
- `DEFAULT_PLAYERS`: Default number of players for booking
- `DEFAULT_USE_CART`: Whether to book a cart by default
- `SCHEDULER_ENABLED`: Enable or disable the scheduler

### Puppeteer
- `PUPPETEER_HEADLESS`: Run Puppeteer in headless mode
- `PUPPETEER_SLOWMO`: Slow down Puppeteer operations for debugging

## API Documentation

The API documentation is available at http://localhost:3000/api when the application is running.

## Project Structure

```
cobble-hills-golf-booking-app/
├── public/                 # Static files
│   ├── css/                # CSS stylesheets
│   ├── js/                 # Client-side JavaScript
│   └── index.html          # Main HTML file
├── src/                    # Source code
│   ├── database/           # Database operations
│   ├── routes/             # API routes
│   ├── scheduler/          # Automated booking scheduler
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── index.js            # Main application file
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Git ignore file
├── .prettierrc.js          # Prettier configuration
├── package.json            # npm package configuration
├── README.md               # Project documentation
└── start.js                # Application entry point
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Express](https://expressjs.com/) - Web framework
- [Puppeteer](https://pptr.dev/) - Headless browser automation
- [Node-cron](https://github.com/node-cron/node-cron) - Task scheduler
- [Nodemailer](https://nodemailer.com/) - Email sending
