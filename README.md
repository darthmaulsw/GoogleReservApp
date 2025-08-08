# Restaurant Booking System

A comprehensive restaurant booking and management system with secure authentication, admin panel, and Google Calendar integration. Features a one-time setup system for admin account creation.

## Features

### 🎯 Core Features
- **Public Booking System**: Interactive calendar with time slot selection and past time blocking
- **Admin Panel**: Protected admin interface for managing restaurant settings
- **One-Time Setup**: Secure initial admin account creation with no additional signups
- **Authentication System**: Email/password login with email verification and password reset
- **Google Calendar Integration**: Automatic event creation for bookings
- **Database**: PostgreSQL with Prisma ORM for data persistence
- **Email System**: SMTP integration for verification and notifications

### 🔐 Security Features
- **Account Verification**: Every login verifies account existence in database
- **Password Recovery**: Secure password reset via email
- **Protected Routes**: Admin routes require authentication
- **One-Time Signup**: Only initial setup allows account creation

### 📅 Booking System
- **Interactive Calendar**: Month navigation with date blocking for past dates
- **Time Slot Management**: 15-minute intervals with past time blocking
- **People Counter**: Configurable maximum people per reservation
- **Customer Validation**: Real-time form validation for customer details
- **Google Calendar Sync**: Automatic event creation for each booking

### ⚙️ Admin Panel
- **Maximum People**: Set maximum people per reservation
- **Restaurant Capacity**: Configure total restaurant capacity
- **Reservation Length**: Set average reservation duration
- **Weekly Schedule**: Manage available times for each day
- **Custom Days**: Override regular schedule for specific dates
- **Real-time Updates**: Instant settings application

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google Cloud Project (for Google Calendar integration)
- SMTP server (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restemplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"

   # SMTP Configuration (for email verification and password reset)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="465"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="your-app-password"
   SMTP_FROM="your-email@gmail.com"
   SMTP_SECURE="true"

   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Google Calendar Integration (for booking events)
   GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
   GOOGLE_CALENDAR_ID="your-calendar-id@group.calendar.google.com"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## Environment Variables Setup

### Database
- `DATABASE_URL`: Your PostgreSQL connection string

### Authentication (NextAuth.js)
- `NEXTAUTH_URL`: Your app's URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

### Email (SMTP)
- `SMTP_HOST`: Your SMTP server (e.g., smtp.gmail.com)
- `SMTP_PORT`: SMTP port (usually 465 for SSL)
- `SMTP_USER`: Your email address
- `SMTP_PASSWORD`: Your email password or app password
- `SMTP_FROM`: From email address
- `SMTP_SECURE`: "true" for SSL/TLS

### Google Calendar Integration
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email from Google Cloud
- `GOOGLE_PRIVATE_KEY`: Private key from service account JSON (use double quotes and \n for newlines)
- `GOOGLE_CALENDAR_ID`: Calendar ID where events will be created

## Usage

### Initial Setup
1. **First Time Setup**: Visit `/signup` to create the initial admin account
2. **Account Creation**: Only one admin account can be created during setup
3. **Setup Completion**: After first account creation, signup becomes inaccessible

### Public Pages
- `/` - Landing page
- `/book` - Booking interface for customers

### Authentication Pages
- `/login` - User login (redirects to admin if authenticated)
- `/signup` - Initial setup only (redirects to login after setup)
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/verify-email` - Email verification

### Admin Pages
- `/admin` - Admin panel (requires authentication)

## Google Calendar Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Calendar API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API" and enable it

3. **Create a Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create

4. **Download the JSON key file**
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key" > "JSON"
   - Download the JSON file

5. **Share your calendar**
   - Open Google Calendar
   - Find your calendar settings
   - Share with the service account email (found in the JSON file)
   - Give "Make changes to events" permission

6. **Add credentials to environment variables**
   - Copy the service account email to `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Copy the private key to `GOOGLE_PRIVATE_KEY` (use double quotes and \n for newlines)
   - Copy your calendar ID to `GOOGLE_CALENDAR_ID`

## Database Schema

The system includes the following tables:
- `AdminSettings` - Restaurant configuration and settings
- `Booking` - Customer reservations and booking data
- `User` - Authentication users
- `Account` - OAuth accounts (for future use)
- `Session` - User sessions
- `VerificationToken` - Email verification tokens
- `PasswordResetToken` - Password reset tokens
- `SetupStatus` - Tracks initial setup completion

## Key Features

### Booking System
- **Interactive Calendar**: Month navigation with past date blocking
- **Time Slot Picker**: 15-minute intervals with past time blocking
- **People Counter**: Configurable maximum people per reservation
- **Customer Validation**: Real-time validation for name, email, and phone
- **Google Calendar Sync**: Automatic event creation for each booking
- **Form Validation**: Client-side validation with real-time feedback

### Admin Panel
- **Maximum People**: Set maximum people per reservation
- **Restaurant Capacity**: Configure total restaurant capacity
- **Reservation Length**: Set average reservation duration (minutes)
- **Weekly Schedule**: Manage available times for each day of the week
- **Custom Days**: Override regular schedule for specific dates
- **Real-time Updates**: Instant settings application with save confirmation

### Authentication System
- **One-Time Setup**: Only initial setup allows account creation
- **Email Verification**: Required email verification for new accounts
- **Password Reset**: Secure password reset via email
- **Account Verification**: Every login verifies account existence
- **Protected Routes**: Admin routes require authentication
- **Session Management**: Secure session handling with NextAuth.js

### Security Features
- **Account Verification**: Database verification on every login
- **Password Hashing**: bcrypt password hashing
- **Token-based Reset**: Secure password reset tokens
- **Email Verification**: Required email verification
- **Route Protection**: Middleware-based route protection

## Production Deployment

1. **Set up a production database**
   - Use a managed PostgreSQL service (e.g., Supabase, Railway, or AWS RDS)
   - Update `DATABASE_URL` with production connection string

2. **Configure environment variables for production**
   - Update all URLs to production domain
   - Set up production SMTP service
   - Configure Google Calendar credentials

3. **Set up a production SMTP service**
   - Use a reliable SMTP service (SendGrid, Mailgun, etc.)
   - Update SMTP environment variables

4. **Deploy to your hosting platform**
   - Vercel, Netlify, or any Node.js hosting platform
   - Ensure environment variables are set

5. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

## Troubleshooting

### Common Issues
- **Google Calendar Integration**: Ensure private key is properly formatted with double quotes and \n characters
- **Email Issues**: Check SMTP credentials and ensure port/security settings are correct
- **Database Connection**: Verify DATABASE_URL format and database accessibility
- **Authentication**: Ensure NEXTAUTH_SECRET is set and unique

### Development
- **Hot Reload**: The app supports hot reloading for development
- **Database Reset**: Use `npx prisma migrate reset` to reset database
- **Environment Variables**: Always restart the dev server after changing .env.local

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
