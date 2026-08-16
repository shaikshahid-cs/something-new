/* ===================================
   Online Learning Platform - Backend
   Express Server with MySQL Storage
   =================================== */

// -------- Import Required Modules --------
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

// -------- Initialize Express App --------
const app = express();
const PORT = process.env.PORT || 5000;

// -------- Middleware --------
// Enable CORS so frontend can talk to this server
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Serve the frontend files from the public folder
app.use(express.static(path.join(__dirname, "../public")));

// Redirect root to index page
app.get("/", function (req, res) {
  res.redirect("/pages/index.html");
});

// Helper function to format JS dates into readable string matching original format
function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

// ======================================
//  API ROUTE: GET /api/courses
//  Returns all courses stored in MySQL
// ======================================

app.get("/api/courses", async function (req, res) {
  try {
    const [courses] = await db.query("SELECT * FROM courses ORDER BY id ASC");
    return res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses from database:", err.message);
    return res.status(500).json({ message: "Server error: Could not fetch courses." });
  }
});

// ======================================
//  API ROUTE: POST /enroll
// ======================================

app.post("/enroll", async function (req, res) {
  const { name, email, phone, course } = req.body;

  if (!name || !email || !phone || !course) {
    return res.status(400).json({ message: "All fields are required (name, email, phone, course)." });
  }

  try {
    // 1. Find or create user
    let [users] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    let userId;

    if (users.length === 0) {
      const [insertUser] = await db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, "default123"]
      );
      userId = insertUser.insertId;
    } else {
      userId = users[0].id;
    }

    // 2. Find course ID
    const [courses] = await db.query("SELECT id FROM courses WHERE title = ?", [course]);
    if (courses.length === 0) {
      return res.status(400).json({ message: "Course not found." });
    }
    const courseId = courses[0].id;

    // 3. Insert enrollment record
    await db.query(
      "INSERT INTO enrollments (user_id, course_id, phone) VALUES (?, ?, ?)",
      [userId, courseId, phone]
    );

    console.log(`✅ Enrollment saved for: ${email} -> ${course}`);
    return res.status(200).json({ message: "Enrollment saved successfully" });
  } catch (err) {
    console.error("Error in /enroll:", err.message);
    return res.status(500).json({ message: "Server error: Could not save enrollment." });
  }
});

// ======================================
//  API ROUTE: POST /api/enroll
//  Called by payment page after simulated payment
// ======================================

app.post("/api/enroll", async function (req, res) {
  const { name, email, phone, course } = req.body;

  if (!name || !email || !course) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and course are required.",
    });
  }

  try {
    // 1. Find or create user
    let [users] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    let userId;

    if (users.length === 0) {
      const [insertUser] = await db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, "default123"]
      );
      userId = insertUser.insertId;
    } else {
      userId = users[0].id;
    }

    // 2. Find course ID
    const [courses] = await db.query("SELECT id FROM courses WHERE title = ?", [course]);
    if (courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected course does not exist.",
      });
    }
    const courseId = courses[0].id;

    // 3. Insert enrollment record
    await db.query(
      "INSERT INTO enrollments (user_id, course_id, phone) VALUES (?, ?, ?)",
      [userId, courseId, phone || "N/A"]
    );

    console.log(`✅ Paid enrollment saved for: ${email} -> ${course}`);
    return res.status(200).json({
      success: true,
      message: "Enrollment saved successfully! Payment confirmed.",
    });
  } catch (err) {
    console.error("Error in /api/enroll:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error: Could not process enrollment.",
    });
  }
});

// ======================================
//  API ROUTE: POST /contact
// ======================================

app.post("/contact", async function (req, res) {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required (name, email, message)." });
  }

  try {
    await db.query(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    console.log(`✅ Contact message saved from: ${email}`);
    return res.status(200).json({ message: "Message saved successfully" });
  } catch (err) {
    console.error("Error in /contact:", err.message);
    return res.status(500).json({ message: "Server error: Could not save message." });
  }
});

// ======================================
//  API ROUTE: POST /signup
// ======================================

app.post("/signup", async function (req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required (name, email, password)." });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please login instead.",
      });
    }

    // Insert new user
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    console.log("✅ New user registered:", email);
    return res.status(200).json({ success: true, message: "Account created successfully!" });
  } catch (err) {
    console.error("Error in /signup:", err.message);
    return res.status(500).json({ success: false, message: "Server error: Could not create user." });
  }
});

// ======================================
//  API ROUTE: POST /login
// ======================================

app.post("/login", async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (users.length > 0) {
      console.log("✅ User logged in:", email);
      return res.status(200).json({ success: true, name: users[0].name, message: "Login successful!" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
  } catch (err) {
    console.error("Error in /login:", err.message);
    return res.status(500).json({ success: false, message: "Server error: Could not log in." });
  }
});

// ======================================
//  API ROUTES: GET (Admin Dashboard & Enrollments)
// ======================================

// GET /api/users — return all registered users
app.get("/api/users", async function (req, res) {
  try {
    const [users] = await db.query("SELECT name, email, registered_at FROM users ORDER BY id ASC");
    const formatted = users.map(function (u) {
      return {
        name: u.name,
        email: u.email,
        registeredAt: formatDate(u.registered_at),
      };
    });
    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Error in GET /api/users:", err.message);
    return res.status(200).json([]);
  }
});

// Helper for fetching enrollments with SQL Join
async function getEnrollmentsList(res) {
  try {
    const query = `
      SELECT 
        e.id,
        u.name,
        u.email,
        e.phone,
        c.title AS course,
        e.submitted_at
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.id ASC
    `;
    const [rows] = await db.query(query);
    const formatted = rows.map(function (r) {
      return {
        name: r.name,
        email: r.email,
        phone: r.phone,
        course: r.course,
        submittedAt: formatDate(r.submitted_at),
      };
    });
    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching enrollments:", err.message);
    return res.status(200).json([]);
  }
}

// GET /api/enrollments & GET /enrollments
app.get("/api/enrollments", function (req, res) {
  getEnrollmentsList(res);
});

app.get("/enrollments", function (req, res) {
  getEnrollmentsList(res);
});

// Helper for fetching contacts
async function getContactsList(res) {
  try {
    const [rows] = await db.query("SELECT name, email, message, submitted_at FROM contacts ORDER BY id ASC");
    const formatted = rows.map(function (r) {
      return {
        name: r.name,
        email: r.email,
        message: r.message,
        submittedAt: formatDate(r.submitted_at),
      };
    });
    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching contacts:", err.message);
    return res.status(200).json([]);
  }
}

// GET /api/contacts & GET /contacts
app.get("/api/contacts", function (req, res) {
  getContactsList(res);
});

app.get("/contacts", function (req, res) {
  getContactsList(res);
});

// ======================================
//  API ROUTE: GET /api/my-courses
//  Returns enrolled courses for a specific user (by email)
//  Enriched with full course data via SQL JOIN
// ======================================

app.get("/api/my-courses", async function (req, res) {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email query parameter is required." });
  }

  try {
    const query = `
      SELECT 
        u.name AS enrolledName,
        u.email AS enrolledEmail,
        e.submitted_at AS enrolledAt,
        c.id AS courseId,
        c.title AS title,
        c.category AS category,
        c.description AS description,
        c.price AS price,
        c.duration AS duration,
        c.lessons AS lessons,
        c.level AS level,
        c.students AS students,
        c.image AS image,
        c.video AS video
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      WHERE u.email = ?
      ORDER BY e.submitted_at DESC
    `;

    const [rows] = await db.query(query, [email]);

    // Deduplicate courses (keep latest enrollment per course title)
    const seen = {};
    const uniqueCourses = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows[i];
      if (!seen[item.title]) {
        seen[item.title] = true;
        uniqueCourses.push({
          enrolledName: item.enrolledName,
          enrolledEmail: item.enrolledEmail,
          enrolledAt: formatDate(item.enrolledAt),
          courseId: item.courseId,
          title: item.title,
          category: item.category,
          description: item.description,
          price: item.price,
          duration: item.duration,
          lessons: item.lessons,
          level: item.level,
          students: item.students,
          image: item.image,
          video: item.video,
        });
      }
    }

    console.log(`📚 Returning ${uniqueCourses.length} courses for: ${email}`);
    return res.status(200).json(uniqueCourses);
  } catch (err) {
    console.error("Error in GET /api/my-courses:", err.message);
    return res.status(200).json([]);
  }
});

// ======================================
//  START THE SERVER
// ======================================

app.listen(PORT, function () {
  console.log("=========================================");
  console.log("  LearnHub Server is running!");
  console.log(`  Local:  http://localhost:${PORT}`);
  console.log("  Storage: MySQL Database");
  console.log("=========================================");
});
