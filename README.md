# LEDO SPORTS ACADEMY

A full-stack web application for managing sports academy operations, including member management, donation tracking, experience sharing, and financial analysis.

## Features

- **Member Management**: Track and manage academy members
- **Donation System**: Record and manage donations
- **Experience Sharing**: Platform for members to share their experiences
- **Financial Analysis**: Track and analyze academy finances
- **Admin Dashboard**: Secure admin interface for management
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI for styling
- React Router for navigation
- Chart.js for data visualization
- JWT for authentication

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- RESTful API architecture

## Prerequisites

Before running this project, make sure you have:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ledo-sports-academy.git
cd ledo-sports-academy
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create .env files:

Backend (.env):
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

Frontend (.env):
```
VITE_API_URL=http://localhost:5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Deployment

This project is configured for deployment on Render.com using the provided `render.yaml` file.

### Deployment Steps:
1. Create a Render.com account
2. Connect your GitHub repository
3. Create a new "Blueprint" instance
4. Configure environment variables:
   - MONGODB_URI
   - JWT_SECRET
   - VITE_API_URL

## Project Structure

```
ledo-sports-academy/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── package.json
└── render.yaml
```

## API Endpoints

### Authentication
- POST /api/auth/login - Admin login
- POST /api/auth/verify - Verify JWT token

### Members
- GET /api/members - Get all members
- POST /api/members - Add new member
- PUT /api/members/:id - Update member
- DELETE /api/members/:id - Delete member

### Donations
- GET /api/donations - Get all donations
- POST /api/donations - Add new donation
- PUT /api/donations/:id - Update donation
- DELETE /api/donations/:id - Delete donation

### Experiences
- GET /api/experiences - Get all experiences
- POST /api/experiences - Add new experience
- PUT /api/experiences/:id - Update experience
- DELETE /api/experiences/:id - Delete experience

## Security

- JWT authentication for admin access
- Password hashing
- Protected API routes
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/ledo-sports-academy 