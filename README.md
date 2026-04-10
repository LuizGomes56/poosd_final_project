# 🎓 EduCMS — Educational Content Management System

**COP 4331 — Object-Oriented Software Development | Spring 2026 | University of Central Florida**

> A full-stack educational platform where instructors create and manage question banks organized by topic, and students browse, answer questions, and track their own progress.

---

## 👥 Team Members

| GitHub | Focus |
|--------|-------|
| [LuizGomes56](https://github.com/LuizGomes56) | Backend architecture, API type system, authentication |
| [gimcastro](https://github.com/gimcastro) | Database, middleware, authentication |
| [joe-ervin05](https://github.com/joe-ervin05) | Database schemas, Frontend pages |
| [macolmenares18](https://github.com/macolmenares18) | Frontend pages, Presentation |
| [JYSCN](https://github.com/JYSCN) | Frontend setup, routing, Mobile app (Flutter) |
| [tales888](https://github.com/tales888) | Mobile app (Flutter), Swagger documentation |

---

## 🔗 Links

| | URL |
|-|-----|
| 🌐 Live App | *(coming soon)* |
| 📄 Swagger API Docs | *(coming soon)* |
| 📋 Project Board | https://github.com/users/LuizGomes56/projects/1 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Database** | MongoDB (remote) |
| **Backend** | Node.js, Express 5, TypeScript |
| **Web Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **Mobile** | Flutter |
| **Auth** | JWT (JSON Web Tokens) + bcrypt |
| **Email** | SendGrid / NodeMailer *(in progress)* |
| **Validation** | Zod |
| **API Docs** | SwaggerHub |
| **Hosting** | Digital Ocean |

---

## 📊 Use Case Diagram

![Use Case Diagram](docs/use_case_diagram_POOSD_final_project.png)

The diagram represents the main interactions between the user and the system, including account management, question and topic management, and answer checking.

## 📁 Repository Structure

```
poosd_final_project/
├── backend/                   # Express REST API — TypeScript
│   ├── src/
│   │   ├── controllers/       # users_controller, questions_controller, topics_controller
│   │   ├── model/             # Mongoose schemas (users, questions, topics)
│   │   ├── routes/            # Express routers + auto-generated methods.ts
│   │   └── utils/             # middleware, http builder, Zod validation
│   ├── nodemon.json
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                  # React + TypeScript web app
│   ├── public/                # favicon.svg, icons.svg
│   ├── src/
│   │   ├── components/        # Button.tsx, Form.tsx, Question.tsx
│   │   ├── pages/             # App.tsx, Homepage.tsx, Login.tsx,
│   │   │                      # Register.tsx, ForgotPassword.tsx
│   │   ├── utils/
│   │   │   └── request.ts     # Type-safe API client (imports backend types)
│   │   ├── index.css          # Tailwind v4 import
│   │   └── main.tsx           # Router entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── server/                    # Standalone DB connection + schema prototype
│   ├── src/
│   │   ├── models/
│   │   │   └── User.ts        # User Mongoose schema
│   │   ├── db.ts              # MongoDB connection helper
│   │   └── index.ts           # Entry point
│   ├── .env.example           # MONGO_CONNECTION_URL=""
│   └── package.json
│
├── tests/                     # Jest integration tests for auth endpoints
│   ├── tests.test.ts
│   └── package.json
│
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
- MongoDB connection string
- Android Studio (Android SDK, cmdline-tools, and Virtual Device)

### Backend
```bash
cd backend
npm install
cp .env.example .env    # fill in DATABASE_URL and JWT_SECRET
npm run start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
### Mobile
```bash
cd mobile
flutter doctor
flutter pub get
flutter run
```

### Running Tests
```bash
cd tests
npm install
# set URL_LOGIN and URL_REGISTER in tests.test.ts to point to your running backend
npm test
```

---

## 📡 API Routes

All routes are prefixed with `/api`. The backend validates every request body automatically using Zod before it reaches the controller.

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/api/users/register` | Create a new account | Public |
| `POST` | `/api/users/login` | Login, receive JWT cookie | Public |
| `GET` | `/api/users/logout` | Clear JWT cookie | Public |
| `POST` | `/api/questions/create` | Create a question | 🔒 Teacher |
| `POST` | `/api/topics/create` | Create a topic | 🔒 Teacher |

> More routes in progress — see the comment in `routes/users.ts` for the full list of planned endpoints.

---

## 🗺️ Frontend Routes

| Path | Page | Status |
|------|------|--------|
| `/` | Homepage / landing | 🔄 In progress |
| `/login` | Login page | ✅ UI done |
| `/register` | Registration page | ✅ UI done |
| `/dashboard` | Teacher dashboard | ⬜ Planned |
| `/dashboard/questions` | Question bank | ⬜ Planned |
| `/dashboard/questions/new` | Create question | ⬜ Planned |
| `/dashboard/topics` | Topic management | ⬜ Planned |
| `/dashboard/student` | Student overview (teacher view) | ⬜ Planned |
| `/dashboard/student/browse` | Browse topics (student view) | ⬜ Planned |
| `/dashboard/student/progress` | Student progress tracker | ⬜ Planned |

---

## 📊 Current Progress

> As of **March 27, 2026** 

### ✅ Done
- Project ideation, requirements, and wireframes
- MongoDB schema design
- User registration and login (backend + frontend UI)
- JWT authentication and bcrypt password hashing
- End-to-end type safety: backend types exported to frontend via `SwaggerDocs`
- Automatic input validation via Zod middleware on all routes
- Type-safe API client skeleton (`request.ts`) in the frontend

### 🔄 In Progress
- Database schema for questions and topics
- Authentication middleware (JWT guard on protected routes)
- Backend implementation for questions and topics controllers

### ⬜ Up Next
- Email verification and password reset *(graded requirement)*
- Server-side search with partial matching *(graded requirement)*
- Full frontend dashboard pages
- Flutter mobile app
- SwaggerHub API documentation *(graded requirement)*
- Deployment to Digital Ocean with domain name *(graded requirement)*

---
## 📅 Gantt Chart
```mermaid
gantt
    title POOSD Final Project Timeline
    dateFormat YYYY-MM-DD
    axisFormat %b %d
    todayMarker off

    section Planning
    Project ideation :done, 2026-03-02, 2026-03-05
    Feasibility analysis report :done, 2026-03-06, 2026-03-12
    Project requirements and features :done, 2026-03-06, 2026-03-20

    section Database
    MongoDB setup :done, 2026-03-13, 2026-03-16
    Final database implementation :done, 2026-03-16, 2026-03-22

    section Backend Core Setup
    Authentication Middleware :done, 2026-03-24, 2026-03-27
    Validation + Type Safety :done, 2026-03-22, 2026-03-27
    Type inference for controllers and routes :done, 2026-03-20, 2026-03-27
    Export API types to frontend :done, 2026-03-22, 2026-03-27

    section Backend API Development
    API routing :done, 2026-03-28, 2026-03-29
    CRUD (Topics/Questions) :done, 2026-04-01, 2026-04-02
    Endpoint Testing :done, 2026-04-02, 2026-04-05
    Swagger Types Export :done, 2026-04-02, 2026-04-05

    section Backend Refinement
    Email verification system :done, 2026-04-08, 2026-04-10
    User Update & Password Reset :done, 2026-04-10, 2026-04-12

    section Frontend Core Pages
    Login page :done, 2026-03-21, 2026-03-28
    Register page :done, 2026-03-21, 2026-03-28
    API integration :done, 2026-03-24, 2026-04-01

    section Frontend Main Features
    Topics page :done, 2026-04-01, 2026-04-03
    Questions page :done, 2026-04-01, 2026-04-03

    section Frontend UI Pages
    Dashboard page :done, 2026-04-08, 2026-04-16
    Topics browse and search UI :done, 2026-04-06, 2026-04-12
    Questions interaction UI :done, 2026-04-06, 2026-04-12
    UI UX improvements :done, 2026-04-08, 2026-04-16

    section App Development Mobile
    Mobile app base setup :done, 2026-03-30, 2026-04-05
    Backend integration :done, 2026-04-01, 2026-04-08
    Login & Dashboard UI :done, 2026-04-03, 2026-04-08
    Demo quiz functionality :done, 2026-04-05, 2026-04-10

    section Testing
    Unit testing backend :done, 2026-03-31, 2026-04-07
    Unit testing frontend :done, 2026-04-02, 2026-04-09
    End to end testing :done, 2026-04-07, 2026-04-11

    section Documentation
    README updates :done, 2026-03-22, 2026-04-12
    Swagger docs creation :done, 2026-03-25, 2026-04-10
    API types export :done, 2026-04-02, 2026-04-05
    User Guide :done, 2026-04-10, 2026-04-12

    section Diagrams
    Use Case Diagram :done, 2026-04-06, 2026-04-09
    Activity Diagram :done, 2026-04-08, 2026-04-10
    ERD :done, 2026-04-09, 2026-04-10
    Timeline Chart :done, 2026-04-08, 2026-04-10

    section PowerPoint Presentation
    PowerPoint Slides :done, 2026-04-10, 2026-04-12
    Presentation prep :done, 2026-04-14, 2026-04-15
```

---
## 🧪 Testing

Integration tests for the authentication flow are located in the `tests/` folder and use **Jest**. Tests cover:

- Login with a non-existent user
- Successful registration
- Duplicate email registration
- Invalid input handling (malformed email, special characters)
- Successful login with valid credentials

---

## ⚠️ Requirements Checklist

Per course specification — all of the following must be in place before April 16:

- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] JWT-secured protected routes
- [ ] Server-side search with partial match support
- [ ] Application accessible via domain name (not IP)
- [ ] SwaggerHub demo of at least 1 API endpoint
- [ ] Working web demo (React)
- [ ] Working mobile demo (Flutter)
- [ ] Presentation slides submitted to WebCourses

---

**Presentation Date: April 16, 2026**
