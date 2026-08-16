# 🎓 LearnHub — Online Learning Platform

A simple full-stack online learning platform built to provide a complete learning workflow — from browsing courses and creating an account to enrolling in courses and managing user data.

This project was developed using **HTML, CSS, JavaScript, Node.js, Express.js, and MySQL**.

---

## 📌 About the Project

**LearnHub** is a web-based learning platform where users can explore available courses, create an account, log in, enroll in courses, and access their enrolled courses.

The application also includes a basic **admin dashboard** for viewing registered users, enrollments, and contact messages.

The project started with JSON-based data storage and was later upgraded to use a **local MySQL database**, making it a proper full-stack application with persistent relational data storage.

---

## ✨ Features

### 👨‍🎓 User Features

* User registration
* User login
* Browse available courses
* View detailed course information
* Enroll in courses
* View enrolled courses
* Access course videos
* Submit contact messages

### 🛠️ Admin Features

* Admin login
* View registered users
* View course enrollments
* View contact messages
* View basic platform statistics

---

## 🧰 Tech Stack

| Layer                     | Technology              |
| ------------------------- | ----------------------- |
| Frontend                  | HTML5, CSS3, JavaScript |
| Backend                   | Node.js, Express.js     |
| Database                  | MySQL                   |
| Database Driver           | mysql2                  |
| Environment Configuration | dotenv                  |
| Version Control           | Git, GitHub             |

---

## 🏗️ How the Application Works

The application follows a simple full-stack architecture:

```text
┌──────────────────────────────┐
│          Frontend            │
│      HTML + CSS + JS         │
└──────────────┬───────────────┘
               │
               │ HTTP Requests
               ▼
┌──────────────────────────────┐
│       Node.js + Express      │
│          Backend             │
└──────────────┬───────────────┘
               │
               │ SQL Queries
               ▼
┌──────────────────────────────┐
│            MySQL             │
│          learnhub            │
└──────────────────────────────┘
```

The browser communicates with the Express backend using HTTP requests.

The backend processes those requests and uses the **mysql2** package to communicate with MySQL.

---

## 🗄️ Database

The application uses a local MySQL database named:

```text
learnhub
```

### Database Tables

```text
learnhub
│
├── users
├── courses
├── enrollments
└── contacts
```

### Users

Stores registered user information.

```text
id
name
email
password
registered_at
```

### Courses

Stores the available course catalog.

```text
id
title
category
description
price
original_price
duration
lessons
level
students
image
video
created_at
```

### Enrollments

Connects users with courses using foreign keys.

```text
id
user_id
course_id
phone
submitted_at
```

```text
users.id
    │
    └──────> enrollments.user_id

courses.id
    │
    └──────> enrollments.course_id
```

### Contacts

Stores messages submitted through the contact form.

```text
id
name
email
message
submitted_at
```

---

## 📁 Project Structure

```text
something-new-main/
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── images/
│   │   └── course images
│   │
│   ├── js/
│   │   └── script.js
│   │
│   └── pages/
│       ├── index.html
│       ├── courses.html
│       ├── details.html
│       ├── login.html
│       ├── signup.html
│       ├── enroll.html
│       ├── enrolled.html
│       ├── my-courses.html
│       ├── payment.html
│       ├── contact.html
│       ├── admin-login.html
│       ├── admin.html
│       └── watch.html
│
├── server/
│   ├── server.js
│   ├── db.js
│   └── schema.sql
│
├── data/
│   ├── users.json
│   ├── enrollments.json
│   └── contacts.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔄 Example Application Flow

### User Registration

```text
Signup Form
     ↓
JavaScript
     ↓
POST /signup
     ↓
Express.js
     ↓
SQL INSERT
     ↓
MySQL → users
```

### User Login

```text
Login Form
     ↓
JavaScript
     ↓
POST /login
     ↓
Express.js
     ↓
SQL SELECT
     ↓
MySQL → users
```

### Course Enrollment

```text
Enrollment Form
     ↓
Express.js
     ↓
MySQL
     ↓
enrollments
     ↓
My Courses
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* [Node.js](https://nodejs.org/)
* MySQL
* MySQL Workbench (recommended)

---

### 1. Clone the Repository

```bash
git clone https://github.com/shaikshahid-cs/something-new.git
cd something-new
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the MySQL Database

Open MySQL Workbench and run the SQL file:

```text
server/schema.sql
```

The script creates the `learnhub` database, required tables, and initial course data.

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=learnhub
```

Do not commit `.env` to GitHub.

### 5. Start the Server

```bash
node server/server.js
```

The application runs at:

```text
http://localhost:5000
```

Open the URL in your browser.

---

## 🔌 Main API Endpoints

### Authentication

```text
POST /signup
POST /login
```

### Courses

```text
GET /api/courses
GET /api/my-courses
```

### Enrollment

```text
POST /enroll
POST /api/enroll
GET /api/enrollments
```

### Users

```text
GET /api/users
```

### Contact

```text
POST /contact
GET /api/contacts
```

---

## 💡 What I Learned

This project helped me understand how the different parts of a full-stack application work together.

### Frontend

* HTML page structure
* CSS styling and responsive layouts
* JavaScript DOM manipulation
* Form handling
* Fetch API
* Local storage

### Backend

* Node.js
* Express.js
* HTTP requests and responses
* REST API development
* Handling POST and GET requests
* Connecting frontend applications to backend APIs

### Database

* MySQL
* Creating databases and tables
* Primary keys
* Foreign keys
* Relationships between tables
* INSERT and SELECT queries
* SQL JOIN operations
* Connecting Node.js to MySQL using `mysql2`

### Development Tools

* npm
* Git
* GitHub
* Environment variables using dotenv

---

## 🔐 Security Note

This project is intended as a learning project.

For a production application, additional security measures would be required, including:

* Password hashing
* Stronger authentication and authorization
* Input validation
* Improved error handling
* Secure session/token management

---

## 🔮 Future Improvements

Possible future improvements include:

* Secure password hashing
* Improved authentication and authorization
* Course search and filtering
* Course progress tracking
* User profiles
* Real payment gateway integration
* Improved admin controls
* Deployment to a cloud platform
* Better validation and error handling

---

## 👨‍💻 Author

### Shahid Shaik

Computer Science Engineering Student
VIT-AP University

🔗 **GitHub:** [shaikshahid-cs](https://github.com/shaikshahid-cs)

---

## ⭐ Project

**LearnHub — Online Learning Platform**

Built as a learning project to understand and implement a complete frontend, backend, and relational database workflow.
