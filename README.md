📚 Online Learning Platform (LearnHub)

📌 Project Overview

This project is a full-stack Online Learning Platform where users can browse courses, enroll in them, and access learning content.

---

🚀 Features

* User Signup & Login
* Browse Available Courses
* Course Enrollment & Payment Simulation System
* Enrolled Courses & Video Player
* Contact Us Form
* Admin Dashboard (Users, Enrollments, Messages)
* Responsive UI

---

🛠️ Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js + Express.js
* Database: MySQL (Local, Port 3306)

---

📁 Project Structure

* `/public` → Frontend pages, CSS, JS, images
* `/server` → Express backend (`server.js`), MySQL pool (`db.js`), SQL schema (`schema.sql`)
* `.env` → Database environment credentials
* `/data` → Historical JSON data (kept as backup reference)

---

🗄️ MySQL Database Setup

1. Make sure **MySQL Server** is running locally on port `3306`.
2. Create the database and tables by executing `server/schema.sql` in MySQL Workbench or CLI:

   ```sql
   mysql -u root -p < server/schema.sql
   ```

3. Update the `.env` file in the root directory with your local MySQL credentials:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=learnhub
   ```

---

▶️ How to Run the Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the backend server:

   ```bash
   node server/server.js
   ```

3. Open your browser:

   ```text
   http://localhost:5000
   ```

---

👨‍💻 Author

Shahid Shaik
