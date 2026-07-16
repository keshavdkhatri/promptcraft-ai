# PromptCraft AI

PromptCraft AI is a full-stack web application that helps users create, optimize, organize, and reuse AI prompts through an intuitive interface. The application integrates Google's Gemini API to improve prompt quality and provides a lightweight local prompt library for managing saved prompts.

This project was built as a portfolio project to demonstrate full-stack development, REST API design, AI integration, and clean software architecture using React and Flask.

---

## Features

- Create prompts with a title, category, and original content
- Optimize prompts using Google Gemini AI
- Save both original and optimized prompts
- Browse saved prompts in a Prompt Library
- Filter prompts by category
- Copy original or optimized prompts to the clipboard
- Delete saved prompts
- Local JSON-based persistence
- Responsive user interface
- Loading and error handling for API operations

---

## Tech Stack

### Frontend
- React 
- Javascript 
- Vite
- React Router

### Backend
- Python
- Flask
- Flask-CORS

### AI Integration
- Google Gemini API

### Storage
- JSON File Storage

---

## Architecture

```
                 React Frontend
                        │
                  REST API Calls
                        │
                 Flask Backend
                  │           │
                  │           │
          Google Gemini API   JSON Storage
```

The frontend communicates with the Flask backend through REST APIs. The backend handles validation, business logic, AI optimization using Gemini, and stores prompts locally in a JSON file.

---

## Project Structure

```
PromptCraft-AI/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── routes/
│   ├── services/
│   ├── storage/
│   └── utils/
│
├── README.md
├── PRD.md
└── requirements.txt
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/optimize` | Optimize a prompt using Gemini |
| POST | `/api/prompts` | Save a prompt |
| GET | `/api/prompts` | Retrieve all saved prompts |
| DELETE | `/api/prompts/:id` | Delete a saved prompt |

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- Python 3.11+
- pip

You will also need a Google Gemini API key.

---

## Backend Setup

Navigate to the server directory.

```bash
cd server
```

Create and activate a virtual environment.

```bash
python -m venv venv
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `server` folder.

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the Flask server.

```bash
python app.py
```

---

## Frontend Setup

Navigate to the client directory.

```bash
cd client
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

---

## Screenshots

Screenshots will be added after deployment.

- Home Page
- Prompt Optimization
- Prompt Library

---

## Design Decisions

- Used JSON file storage instead of a database to keep the MVP lightweight and simple.
- Kept business logic separate from API routes using a service layer.
- Stored sensitive API keys securely using environment variables.
- Designed the project around RESTful APIs with clear separation of concerns.
- Followed KISS (Keep It Simple, Stupid) and YAGNI (You Aren't Gonna Need It) principles to avoid unnecessary complexity.

---

## What I Learned

Building PromptCraft AI helped me gain practical experience with:

- Building a full-stack application using React and Flask
- Designing RESTful APIs
- Integrating Google Gemini API into a backend service
- Managing frontend-backend communication
- Organizing backend code using routes, services, utilities, and storage layers
- Implementing input validation and error handling
- Structuring a project using a modular architecture

---

## Future Improvements

Possible future enhancements include:

- User authentication
- Cloud database integration
- Prompt search functionality
- Export and import prompts
- Prompt sharing

---

## Author

**Keshav Khatri**

Built as a full-stack portfolio project to demonstrate modern web development and AI integration.