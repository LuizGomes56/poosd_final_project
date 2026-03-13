# 📅 Project Gantt Chart — Educational CMS with API
**COP 4331 — Spring 2026**  
**Target Presentation Date: April 16, 2026**

---

## Gantt Charts by Phase

> Each phase has its own chart for better readability. All charts render automatically on GitHub.

---

### 🗂️ Phase 1 — Planning & Requirements

```mermaid
gantt
    title Planning and Requirements
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Planning
    Project ideation & poll          :      plan1, 2026-02-27, 2026-03-06
    Feasibility analysis report      :      plan2, 2026-03-06, 2026-03-13
    Wireframes & prototypes (Figma)  :      ux1,   2026-03-13, 2026-03-20
```

---

### 🗄️ Phase 2 — Database & Backend

```mermaid
gantt
    title Database and Backend
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Database
    Schema design and MongoDB setup      :        db1, 2026-03-13, 2026-03-16

    section Authentication
    User auth (register, login, JWT)     :        be1, 2026-03-13, 2026-03-18
    Email verification & password reset  :        be2, 2026-03-16, 2026-03-21

    section Core API
    Course & lesson CRUD endpoints       :        be3, 2026-03-18, 2026-03-25
    Enrollment & progress tracking API   :        be4, 2026-03-23, 2026-03-28
    Search API (partial match)           :        be5, 2026-03-26, 2026-03-30
    Quiz/assessment endpoints            :        be6, 2026-03-28, 2026-04-02
    SwaggerHub API documentation         :        be7, 2026-03-30, 2026-04-04
```

---

### 🌐 Phase 3 — Web Frontend (React / TypeScript)

```mermaid
gantt
    title Web Frontend — React / TypeScript
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Setup
    Project setup & routing          : fe1, 2026-03-18, 2026-03-21

    section Core Pages
    Auth pages (login, register, reset)  : fe2, 2026-03-21, 2026-03-25
    Course catalog & search UI           : fe3, 2026-03-25, 2026-03-30
    Lesson viewer & progress tracking    : fe4, 2026-03-28, 2026-04-02

    section Advanced Pages
    Quiz UI & score display              : fe5, 2026-04-01, 2026-04-05
    Instructor dashboard                 : fe6, 2026-04-03, 2026-04-07
```

---

### 📱 Phase 4 — Mobile App (Flutter)

```mermaid
gantt
    title Mobile App — Flutter
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Setup
    Project setup & navigation       : mob1, 2026-03-21, 2026-03-25

    section Screens
    Auth screens (login, register)   : mob2, 2026-03-25, 2026-03-30
    Course browsing & enrollment     : mob3, 2026-03-28, 2026-04-04
    Lesson viewer screen             : mob4, 2026-04-02, 2026-04-07
```

---

### 🚀 Phase 5 — Deployment & Hosting

```mermaid
gantt
    title Deployment and Hosting
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Deployment
    Domain setup & server config         : dep1, 2026-03-28, 2026-04-01
    Deploy backend API to Digital Ocean  : dep2, 2026-04-01, 2026-04-04
    Deploy web frontend                  : dep3, 2026-04-03, 2026-04-06
```

---

### 🧪 Phase 6 — Testing & QA

```mermaid
gantt
    title Testing and QA
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Testing
    Backend integration tests            : test1, 2026-04-04, 2026-04-08
    Web frontend QA & bug fixes          : test2, 2026-04-05, 2026-04-09
    Mobile QA & bug fixes                : test3, 2026-04-05, 2026-04-09
    End-to-end testing on hosted domain  : test4, 2026-04-08, 2026-04-11
```

---

### 🎤 Phase 7 — Documentation & Presentation

```mermaid
gantt
    title Documentation and Presentation
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Diagrams & Docs
    ERD, use case & sequence diagrams    : doc1, 2026-03-28, 2026-04-04

    section Presentation
    PowerPoint slides draft              : doc2, 2026-04-07, 2026-04-11
    Presentation rehearsal               : doc3, 2026-04-11, 2026-04-15
    Final presentation                   : milestone, pres, 2026-04-16, 1d
```

---

## 📋 Task Breakdown Table

| # | Phase | Task | Start | End | Status | Notes |
|---|-------|------|-------|-----|--------|-------|
| 1 | Planning | Project ideation & team poll | Feb 27 | Mar 6 | ✅ Done | Voted on Discord |
| 2 | Planning | Feasibility analysis report | Mar 6 | Mar 13 | ✅ Done | Submitted individually |
| 3 | Database | Schema design & MongoDB setup | Mar 13 | Mar 13 | ✅ Done | Remote DB on MongoDB Atlas |
| 4 | Backend | User auth — register, login, JWT | Mar 13 | Mar 18 | 🔄 In Progress | |
| 5 | Backend | Email verification & password reset | Mar 16 | Mar 21 | ⬜ To Do | Use SendGrid or NodeMailer |
| 6 | UI/UX | Wireframes & prototypes (Figma) | Mar 13 | Mar 20 | ⬜ To Do | Required for grading rubric |
| 7 | Web | Project setup, routing, TypeScript config | Mar 18 | Mar 21 | ⬜ To Do | Vite + React + TS |
| 8 | Backend | Course & lesson CRUD endpoints | Mar 18 | Mar 25 | ⬜ To Do | |
| 9 | Web | Auth pages (login, register, reset) | Mar 21 | Mar 25 | ⬜ To Do | |
| 10 | Mobile | Flutter project setup & navigation | Mar 21 | Mar 25 | ⬜ To Do | |
| 11 | Backend | Enrollment & progress tracking API | Mar 23 | Mar 28 | ⬜ To Do | |
| 12 | Web | Course catalog & search UI | Mar 25 | Mar 30 | ⬜ To Do | |
| 13 | Mobile | Auth screens (login, register) | Mar 25 | Mar 30 | ⬜ To Do | |
| 14 | Backend | Search API with partial match | Mar 26 | Mar 30 | ⬜ To Do | Required for grading — query server, partial text |
| 15 | Backend | Quiz / assessment endpoints | Mar 28 | Apr 2 | ⬜ To Do | |
| 16 | Web | Lesson viewer & progress UI | Mar 28 | Apr 2 | ⬜ To Do | |
| 17 | Mobile | Course browsing & enrollment screens | Mar 28 | Apr 4 | ⬜ To Do | |
| 18 | Deployment | Domain name setup & server config | Mar 28 | Apr 1 | ⬜ To Do | Digital Ocean recommended |
| 19 | Docs | ERD, use case & sequence diagrams | Mar 28 | Apr 4 | ⬜ To Do | Required for slides rubric |
| 20 | Backend | SwaggerHub API documentation | Mar 30 | Apr 4 | ⬜ To Do | At least 1, max 2 endpoints |
| 21 | Web | Quiz UI & score display | Apr 1 | Apr 5 | ⬜ To Do | |
| 22 | Deployment | Deploy backend API to Digital Ocean | Apr 1 | Apr 4 | ⬜ To Do | |
| 23 | Web | Instructor dashboard | Apr 3 | Apr 7 | ⬜ To Do | |
| 24 | Deployment | Deploy web frontend | Apr 3 | Apr 6 | ⬜ To Do | Must be accessible via domain name |
| 25 | Mobile | Lesson viewer screen | Apr 2 | Apr 7 | ⬜ To Do | |
| 26 | Testing | Backend integration tests | Apr 4 | Apr 8 | ⬜ To Do | Required: unit & integration test results in slides |
| 27 | Testing | Web frontend QA & bug fixes | Apr 5 | Apr 9 | ⬜ To Do | |
| 28 | Testing | Mobile QA & bug fixes | Apr 5 | Apr 9 | ⬜ To Do | |
| 29 | Testing | End-to-end test on hosted domain | Apr 8 | Apr 11 | ⬜ To Do | ⚠️ Check on UCF campus network 2 days before |
| 30 | Presentation | PowerPoint slides draft | Apr 7 | Apr 11 | ⬜ To Do | See slide requirements below |
| 31 | Presentation | Presentation rehearsal | Apr 11 | Apr 15 | ⬜ To Do | Stay under 15 min — 16+ min = penalty |
| 32 | Presentation | **Final presentation** | **Apr 16** | **Apr 16** | 🎯 Target | Add project to signup spreadsheet beforehand |

---

## ⚠️ Critical Reminders

| Item | Detail |
|------|--------|
| **Domain name** | Must use a domain name — IP addresses are **not acceptable** |
| **Campus network check** | Test the live URL on UCF Wi-Fi **2 days before** and **1 day before** presentation |
| **Presentation length** | Hard limit of **15 minutes** — exceeding 16 min = 5-point penalty |
| **Signup spreadsheet** | Add project title, GitHub URL, and live URL **before** presenting |
| **Bring a USB drive** | No time to retrieve files from cloud storage during the presentation |
| **All members must present** | Each member must explain a meaningful portion — missing = zero |
| **Slides due on time** | Submit PowerPoint to WebCourses on time (5 points) |

---

## 📊 Grading Rubric Checklist

| Points | Item | Owner | Status |
|--------|------|-------|--------|
| 5 pts | PowerPoint submitted on time | All | ⬜ |
| 5 pts | Professional PowerPoint slides | All | ⬜ |
| 5 pts | Gantt chart | All | ⬜ |
| 5 pts | Use case diagram | | ⬜ |
| 5 pts | Activity or Sequence diagram | | ⬜ |
| 5 pts | Email verification & password reset | | ⬜ |
| 5 pts | SwaggerHub API demo (1–2 endpoints) | | ⬜ |
| 5 pts | Effective server-side search (partial match) | | ⬜ |
| 5 pts | Prototypes / Wireframes | | ⬜ |
| 20 pts | Working demo — web **and** mobile | All | ⬜ |
| 5 pts | Adherence to current standards | All | ⬜ |
| 5 pts | ERD | | ⬜ |
| 5 pts | Explanation of technology | All | ⬜ |
| 5 pts | Instructor discretionary excellence | All | ⬜ |
| 10 pts | GitHub activity (commits, reviews, docs) | All | 🔄 Ongoing |
| 5 pts | Team evaluation of individual contribution | All | ⬜ |
| **100 pts** | **Total** | | |

---

## 🗂️ Required Slides Checklist

- [ ] Title page (project name & description)
- [ ] Team members and their individual contributions
- [ ] Technologies used (MongoDB, Express, React/TS, Flutter, Node.js, JWT, SendGrid, etc.)
- [ ] Things that went well
- [ ] Things that did not go well
- [ ] Gantt chart
- [ ] ERD
- [ ] Use case diagram
- [ ] Class diagram (for the Flutter mobile app)
- [ ] Sequence or Activity diagram
- [ ] Unit and integration test results
- [ ] Prototypes / Wireframes (Figma or Adobe XD)
- [ ] SwaggerHub API demonstration
- [ ] Live app demonstration (web + mobile)
- [ ] Time for questions

---

*Last updated: March 13, 2026*