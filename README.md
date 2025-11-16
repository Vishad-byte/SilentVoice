# Silent Voice


An anonymous messaging platform where users can receive messages from others without revealing their identity. Similar to platforms like Qooh.me, users can create a profile, share their unique link, and receive anonymous messages.

## 🚀 Features

- **Anonymous Messaging**: Send and receive messages anonymously
- **User Authentication**: Secure sign-up and login with NextAuth.js
- **Email Verification**: OTP-based email verification system
- **Message Management**: View, manage, and delete received messages
- **Privacy Controls**: Toggle message acceptance on/off
- **AI-Powered Suggestions**: Get AI-generated message suggestions using Google Gemini
- **Real-time Updates**: Stream AI responses for message suggestions
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js v4
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **AI Integration**: Vercel AI SDK + Google Gemini 2.0
- **Email Service**: Resend
- **Notifications**: Sonner (Toast notifications)

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database (local or Atlas)
- Google AI API key (for message suggestions)
- Resend API key (for email verification)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google AI (for message suggestions)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# Resend (for email verification)
RESEND_API_KEY=your_resend_api_key
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd silentvoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local` (if exists)
   - Fill in all required environment variables

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 API Routes

### Authentication

#### `POST /api/auth/[...nextauth]`
NextAuth.js authentication endpoint (handles GET and POST)
- Handles sign-in, sign-out, and session management
- Uses credentials provider

### User Management

#### `POST /api/sign-up`
Register a new user
- **Body**: 
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "User registered successfully. Verify your Email"
  }
  ```
- Sends verification email with OTP code

#### `POST /api/verify-code`
Verify user email with OTP code
- **Body**: 
  ```json
  {
    "username": "string",
    "code": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Account verified successfully"
  }
  ```
- Verification code expires after 1 hour

#### `GET /api/check-username-unique?username={username}`
Check if username is available
- **Query Parameters**: `username` (string)
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Username is available"
  }
  ```
- Returns 400 if username is already taken

### Messages

#### `POST /api/send-message`
Send an anonymous message to a user
- **Body**: 
  ```json
  {
    "username": "string",
    "content": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Message sent successfully"
  }
  ```
- Returns 403 if user is not accepting messages
- Returns 404 if user not found

#### `GET /api/get-messages`
Get all messages for authenticated user
- **Authentication**: Required (NextAuth session)
- **Response**: 
  ```json
  {
    "messages": [
      {
        "_id": "string",
        "content": "string",
        "createdAt": "date"
      }
    ]
  }
  ```
- Messages are sorted by creation date (newest first)

#### `DELETE /api/delete-message/[messageid]`
Delete a specific message
- **Authentication**: Required (NextAuth session)
- **Path Parameters**: `messageid` (string)
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Message deleted"
  }
  ```
- Returns 404 if message not found

### Message Settings

#### `POST /api/accept-messages`
Update message acceptance status
- **Authentication**: Required (NextAuth session)
- **Body**: 
  ```json
  {
    "acceptMessages": true
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Message status updated successfully"
  }
  ```

#### `GET /api/accept-messages`
Get current message acceptance status
- **Authentication**: Required (NextAuth session)
- **Response**: 
  ```json
  {
    "success": true,
    "isAcceptingMessage": true
  }
  ```

### AI Features

#### `POST /api/suggest-messages`
Get AI-generated message suggestions
- **Response**: Streaming text response (UI message stream format)
- **Format**: Three questions separated by `||`
- **Example Output**: `"Question 1||Question 2||Question 3"`
- Uses Google Gemini 2.0 Flash model
- Edge runtime compatible
- Handles quota errors gracefully

## 🎯 Usage

### For Users

1. **Sign Up**: Create an account with username, email, and password
2. **Verify Email**: Check your email for the 6-digit OTP code
3. **Get Your Link**: Copy your unique profile link from the dashboard
4. **Share Link**: Share your link to receive anonymous messages
5. **Manage Messages**: View, delete, and control message acceptance from your dashboard

### For Developers

- All API routes return JSON responses with `success` and `message` fields
- Authentication is handled via NextAuth.js sessions
- Messages are stored in MongoDB with user references
- AI suggestions use streaming responses for better UX

## 📁 Project Structure

```
silentvoice/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── (app)/            # Protected routes
│   │   ├── (auth)/           # Authentication routes
│   │   └── u/[username]/     # Public profile pages
│   ├── components/            # React components
│   ├── helpers/              # Utility functions
│   ├── lib/                  # Library configurations
│   ├── model/                # Mongoose models
│   ├── schemas/              # Zod validation schemas
│   └── types/                # TypeScript types
├── public/                   # Static assets
└── package.json
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist (if using Atlas)

2. **Email Not Sending**
   - Verify `RESEND_API_KEY` is set correctly
   - Check Resend dashboard for API status

3. **AI Suggestions Not Working**
   - Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set
   - Check Google AI Studio for quota limits
   - Try switching to `gemini-2.0-flash-lite` model

4. **Authentication Issues**
   - Ensure `NEXTAUTH_SECRET` is set
   - Verify `NEXTAUTH_URL` matches your deployment URL



**Built with  using Next.js and TypeScript**
