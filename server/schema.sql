-- =============================================
-- LearnHub Database Schema & Initial Seed Data
-- =============================================

CREATE DATABASE IF NOT EXISTS learnhub;
USE learnhub;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price VARCHAR(50) NOT NULL,
  original_price VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  lessons INT NOT NULL,
  level VARCHAR(50) NOT NULL,
  students VARCHAR(50) NOT NULL,
  image VARCHAR(255) NOT NULL,
  video VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Enrollments Table (Foreign Keys: user_id -> users(id), course_id -> courses(id))
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  phone VARCHAR(50) DEFAULT 'N/A',
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 4. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SEED DATA: Course Catalog
-- =============================================

INSERT IGNORE INTO courses (id, title, category, description, price, original_price, duration, lessons, level, students, image, video) VALUES
(1, 'Web Development Bootcamp', 'Development', 'Master HTML, CSS, JavaScript, and modern frameworks. Build real-world projects from scratch and launch your career as a full-stack web developer.', '₹4,999', '₹9,999', '12 Weeks', 48, 'Beginner', '2,340', '../images/course-webdev.png', 'https://www.youtube.com/embed/zJSY8tbf_ys'),
(2, 'Python Programming', 'Programming', 'Learn Python from the ground up. Cover data types, functions, OOP, file handling, and build automation scripts and mini projects.', '₹3,499', '₹7,499', '8 Weeks', 36, 'Beginner', '3,120', '../images/course-python.png', 'https://www.youtube.com/embed/_uQrJ0TkZlc'),
(3, 'Data Science & Analytics', 'Data Science', 'Explore data analysis with Python, Pandas, NumPy, and visualization libraries. Learn machine learning fundamentals and work with real datasets.', '₹6,999', '₹12,999', '16 Weeks', 60, 'Intermediate', '1,850', '../images/course-datascience.png', 'https://www.youtube.com/embed/ua-CiDNNj30'),
(4, 'UI/UX Design Masterclass', 'Design', 'Learn user-centered design principles, wireframing, prototyping with Figma, and create stunning interfaces that users love.', '₹4,499', '₹8,999', '10 Weeks', 40, 'Beginner', '1,560', '../images/course-uiux.png', 'https://www.youtube.com/embed/c9Wg6Cb_YlU'),
(5, 'Digital Marketing', 'Marketing', 'Master SEO, social media marketing, Google Ads, email campaigns, and analytics to grow any business online effectively.', '₹3,999', '₹7,999', '8 Weeks', 32, 'Beginner', '2,780', '../images/course-marketing.png', 'https://www.youtube.com/embed/bixR-KIJKYM'),
(6, 'Mobile App Development', 'Development', 'Build cross-platform mobile apps using React Native. Learn navigation, state management, APIs, and deploy to app stores.', '₹5,999', '₹11,999', '14 Weeks', 52, 'Intermediate', '1,430', '../images/course-mobile.png', 'https://www.youtube.com/embed/0-S5a0eXPoc');

-- =============================================
-- SEED DATA: Safe Dummy Test Accounts
-- =============================================

INSERT IGNORE INTO users (id, name, email, password) VALUES
(1, 'Test Student', 'student@example.com', 'pass123'),
(2, 'John Doe', 'john@example.com', 'pass123'),
(3, 'Amar Kumar', 'amar@example.com', 'pass123');

-- =============================================
-- SEED DATA: Sample Enrollments
-- =============================================

INSERT IGNORE INTO enrollments (user_id, course_id, phone) VALUES
(1, 1, '9876543210'),
(1, 2, '9876543210'),
(2, 4, '8074198897'),
(3, 3, '9998887776');

-- =============================================
-- SEED DATA: Sample Contacts
-- =============================================

INSERT IGNORE INTO contacts (name, email, message) VALUES
('Test User', 'testuser@example.com', 'This is a test message');
