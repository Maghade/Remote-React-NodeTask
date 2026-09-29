\# Student Management System



A full-stack Student Management System built with React, TypeScript, Node.js, Express, MongoDB, and Tailwind CSS.



The application provides login, student registration, and complete CRUD operations with two-level encryption of student data.



\## Features



\- User login with email and password validation

\- Student registration

\- View registered students

\- Update student information

\- Delete students

\- Frontend encryption using AES-GCM

\- Backend encryption using AES-256-GCM

\- MongoDB for data storage

\- React + TypeScript frontend

\- Node.js + Express + TypeScript backend

\- Tailwind CSS responsive UI



\## Tech Stack



\### Frontend



\- React

\- TypeScript

\- Vite

\- Tailwind CSS

\- Web Crypto API



\### Backend



\- Node.js

\- Express

\- TypeScript

\- Mongoose

\- dotenv

\- CORS

\- Node.js Crypto module



\### Database



\- MongoDB



\## Student Fields



The student registration form contains:



\- Full Name

\- Email

\- Phone Number

\- Date of Birth

\- Gender

\- Address

\- Course Enrolled

\- Password



\## CRUD API



| Method | Endpoint | Description |

|---|---|---|

| POST | `/api/register` | Register a student |

| POST | `/api/login` | Authenticate a student |

| GET | `/api/students` | Get all students |

| PUT | `/api/student/:id` | Update a student |

| DELETE | `/api/student/:id` | Delete a student |



\## Two-Level Encryption



Student data is encrypted before being stored in MongoDB.



The encryption flow is:



```text

Student Form

&#x20;    |

&#x20;    v

Frontend AES-GCM Encryption

&#x20;    |

&#x20;    v

POST /api/register

&#x20;    |

&#x20;    v

Backend AES-256-GCM Encryption

&#x20;    |

&#x20;    v

MongoDB

