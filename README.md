# 🎓 EduCMS — Educational Content Management System

**COP 4331 — Object-Oriented Software Development | Spring 2026 | University of Central Florida**

> A full-stack educational platform where instructors create and manage question banks organized by topic, and students browse, answer questions, and track their own progress.

---

## 👥 Team Members

| GitHub | Focus |
|--------|-------|
| [LuizGomes56](https://github.com/LuizGomes56) | Backend architecture, API type system, authentication, CRUD controllers, dashboard endpoint |
| [gimcastro](https://github.com/gimcastro) | Database, middleware, authentication, type exports, diagrams |
| [joe-ervin05](https://github.com/joe-ervin05) | Database schemas, frontend pages (topics, questions, auth) |
| [macolmenares18](https://github.com/macolmenares18) | Frontend dashboard, wireframes, mobile dashboard, presentation |
| [JYSCN](https://github.com/JYSCN) | Frontend setup, routing, email verification, mobile app (Flutter) |
| [tales888](https://github.com/tales888) | Mobile app (Flutter), Swagger documentation |

---

## 🔗 Links

| | URL |
|-|-----|
| 🌐 Live App | *(coming soon — Digital Ocean)* |
| 📄 Swagger API Docs | *(coming soon — #19)* |
| 📋 Project Board | https://github.com/users/LuizGomes56/projects/1 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Database** | MongoDB (remote) |
| **Backend** | Node.js, Express 5, TypeScript |
| **Web Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **Mobile** | Flutter (Dart) |
| **Auth** | JWT (JSON Web Tokens) + bcrypt |
| **Email** | AWS SES via NodeMailer |
| **Validation** | Zod |
| **API Docs** | SwaggerHub |
| **Hosting** | Digital Ocean |
| **Containers** | Docker + Docker Compose |

---

## 📊 Diagrams

### Use Case Diagram
![Use Case Diagram](docs/use_case_diagram_POOSD_final_project.png)

The diagram represents the main interactions between the user and the system, including account management, question and topic management, and answer checking.

### Activity Diagram
![Activity Diagram](docs/uml/activity.png)

This diagram shows the main system flow, including login, topic management, and question handling.

---

## 📁 Repository Structure

```
poosd_final_project/
├── backend/                   # Express REST API — TypeScript
│   ├── src/
│   │   ├── controllers/       # users_controller, questions_controller, topics_controller
│   │   ├── model/             # Mongoose schemas (users, questions, topics, auth)
│   │   ├── routes/            # Express routers + auto-generated methods.ts
│   │   └── utils/             # middleware, http builder, Zod validation, mailer, env
│   ├── docker/                # Backend Dockerfile
│   ├── nodemon.json
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                  # React + TypeScript web app
│   ├── src/
│   │   ├── components/        # Button, Form, Table, Sidebar, Loading, etc.
│   │   ├── config/            # ConfigEditor, ConfigTextField
│   │   ├── forms/             # FormBuilder, FormTextField, FormButton, FormView
│   │   ├── pages/             # App, Dashboard, Login, Register, Topics, Questions,
│   │   │                      # AccountSettings, ForgotPassword, PasswordReset, Docs
│   │   ├── providers/         # AppProvider, UserProvider, NotificationProvider, RequireLogin
│   │   ├── utils/
│   │   │   └── request.ts     # Type-safe API client (imports backend SwaggerDocs types)
│   │   ├── consts.ts          # Shared types and constants
│   │   ├── hooks.ts           # useClickOut, useDebounce, useSkip, useUpdateUser
│   │   ├── index.css          # Tailwind v4 import + custom utilities
│   │   └── main.tsx           # Router entry point
│   ├── docker/                # Frontend Dockerfile + nginx config
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── mobile/                    # Flutter mobile app
│   ├── lib/
│   │   ├── constants/
│   │   │   └── app_theme.dart      # Color palette and ThemeData
│   │   ├── pages/                  # LoginPage, RegisterPage, AccountPage,
│   │   │                           # DashboardPage, TopicsPage, QuestionsPage
│   │   ├── services/
│   │   │   └── api_service.dart    # HTTP client with JWT auth
│   │   └── widgets/
│   │       ├── app_drawer.dart     # Navigation drawer
│   │       └── custom_text_field.dart
│   ├── android/               # Android build config
│   ├── assets/                # App icons
│   └── pubspec.yaml
│
├── tests/                     # Jest integration tests for auth endpoints
│   ├── tests.test.ts
│   └── package.json
│
├── docs/                      # Diagrams and documentation assets
├── docker-compose.yaml        # Orchestrates mongodb, backend, frontend
├── GANTT.md                   # Project timeline and task tracking
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- Flutter SDK
- Docker Desktop
- Android Studio (for Android emulator) or Chrome (for Flutter web)

### Running with Docker (recommended)

```bash
# 1. Create the backend environment file
# Copy .env.example to .env and fill in the values
cp backend/.env.example backend/.env

# 2. Start all services (MongoDB + backend + frontend)
docker compose up --build
```

- Web app → `http://localhost`
- API → `http://localhost:3000/api`
- MongoDB → port 27017

### Running locally (without Docker)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env    # fill in DATABASE_URL and JWT_SECRET
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Mobile:**
```bash
cd mobile
flutter pub get
flutter run -d chrome    # Chrome — backend must be on localhost:3000
flutter run              # Android emulator — backend at 10.0.2.2:3000
```

### Running Tests
```bash
cd tests
npm install
# Set URL_LOGIN and URL_REGISTER in tests.test.ts to point to your running backend
npm test
```

---

## 📡 API Routes

All routes are prefixed with `/api`. Every request body is automatically validated by Zod middleware before reaching the controller.

### Users
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/users/register` | Create a new teacher account | Public |
| `POST` | `/api/users/login` | Login, receive JWT token | Public |
| `GET` | `/api/users/logout` | Clear JWT session | Public |
| `POST` | `/api/users/forgot_password` | Send password reset email | Public |
| `POST` | `/api/users/reset_password` | Reset password with 6-digit code | Public |
| `GET` | `/api/users/verify` | Verify JWT token, returns user payload | 🔒 Protected |
| `GET` | `/api/users/dashboard` | Stats + topic breakdown for dashboard | 🔒 Protected |
| `PATCH` | `/api/users/patch` | Update user profile fields | 🔒 Protected |
| `GET` | `/api/users/send_email_verification` | Send email verification code | 🔒 Protected |
| `POST` | `/api/users/verify_email` | Verify email with 6-digit code | 🔒 Protected |

### Topics
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/topics/create` | Create a new topic | 🔒 Protected |
| `GET` | `/api/topics/all` | Get all topics with question counts | 🔒 Protected |
| `PUT` | `/api/topics/update` | Update topic name or description | 🔒 Protected |
| `DELETE` | `/api/topics/delete` | Delete a topic | 🔒 Protected |

### Questions
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/questions/create` | Create a question (MCQ / TF / FRQ) | 🔒 Protected |
| `POST` | `/api/questions/all` | Get all questions, optionally by topic | 🔒 Protected |
| `POST` | `/api/questions/get` | Get a single question by ID | 🔒 Protected |
| `PATCH` | `/api/questions/update` | Update a question | 🔒 Protected |
| `DELETE` | `/api/questions/delete` | Delete a question | 🔒 Protected |
| `POST` | `/api/questions/check` | Check if an answer is correct | 🔒 Protected |

---

## 🗺️ Frontend Routes

| Path | Page | Status |
|------|------|--------|
| `/login` | Login page | ✅ Done |
| `/register` | Registration page | ✅ Done |
| `/forgotpassword` | Forgot password | ✅ Done |
| `/resetpassword` | Reset password with code | ✅ Done |
| `/` | Teacher dashboard | ✅ Done |
| `/settings/questions` | Question bank — full CRUD | ✅ Done |
| `/settings/topics` | Topic management — full CRUD | ✅ Done |
| `/settings/account` | Account settings | ✅ Done |
| `/settings/docs` | API documentation viewer | ✅ Done |

---

## 📱 Mobile Screens

| Screen | Status |
|--------|--------|
| Login | ✅ Done |
| Register | ✅ Done |
| Dashboard (stat cards + topic breakdown table) | ✅ Done |
| Topics | ✅ Done |
| Questions | ✅ Done |
| Account | ✅ Done |
| App drawer navigation | ✅ Done |

---

## 📊 Current Progress

> As of **April 14, 2026**

### ✅ Completed
- Full backend with Zod validation, JWT auth, bcrypt, type-safe route system (PR#21, PR#23, PR#27)
- All CRUD endpoints for users, topics, and questions (PR#51, PR#53)
- Email verification and password reset via AWS SES (PR#66, PR#70)
- Users dashboard endpoint with topic breakdown aggregate (PR#79)
- Docker Compose setup — runs MongoDB, backend, and frontend together
- Full web frontend: login, register, dashboard, topics, questions, account, password forgot/reset, docs page (PR#40, PR#44, PR#63, PR#65, PR#77, PR#79, PR#81)
- Logout button and removal of test pages (PR#81)
- Full Flutter mobile app: login, register, dashboard, topics, questions, account, navigation drawer (#8)
- End-to-end type safety: backend `SwaggerDocs` types exported to frontend (PR#26)
- Unit and integration tests for all auth, topic, and question routes (PR#48, PR#53)
- GitHub Actions CI pipeline (PR#51)
- Use case diagram (#58), activity diagram (#59), Gantt chart (#57)

### 🔄 In Progress
- Project presentation slides (#13)
- SwaggerHub API documentation (#19)
- Software usage documentation (#69)
- Deployment to Digital Ocean with domain name

### ⬜ Remaining
- ERD (#62)
- Prototypes / Flow chart (#61)
- Server-side search with partial match support
- Class diagram for Flutter mobile app

---

## 🧪 Testing

Integration tests in the `tests/` folder use **Jest**. Tests cover all routes across users, topics, and questions. The CI pipeline (`.github/workflows/APITest.yml`) runs tests automatically on every pull request to `main`.

Test cases include:
- Login with non-existent user → 404
- Successful registration → 200
- Duplicate email registration → 409/500
- Invalid input handling → 400
- Successful login → 200 + JWT token
- Topic and question CRUD operations
- Answer checking for MCQ, TF, and FRQ question types

---

## ⚠️ Requirements Checklist

Per course specification — all of the following must be in place before April 16:

- [x] Email verification on registration (#60, #67)
- [x] Password reset via email (#34, #74)
- [x] JWT-secured protected routes (#18)
- [ ] Server-side search with partial match support
- [ ] Application accessible via domain name (not IP)
- [ ] SwaggerHub demo of at least 1 API endpoint (#19)
- [x] Working web demo — React (#9)
- [x] Working mobile demo — Flutter (#8)
- [ ] Presentation slides submitted to WebCourses (#13)

---

**Presentation Date: April 24, 2026**