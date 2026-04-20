/* ===================================
   Online Learning Platform - Backend
   Express Server with JSON File Storage
   =================================== */

// -------- Import Required Modules --------
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

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
app.get("/", function(req, res) {
  res.redirect("/pages/index.html");
});

// ======================================
//  HELPER FUNCTION: Read, Append & Save
// ======================================

/**
 * Reads a JSON file, appends new data, and saves it back.
 * If the file doesn't exist, it creates a new one with an array.
 *
 * @param {string} filePath - Path to the JSON file
 * @param {object} newData  - The new data object to append
 * @param {object} res      - Express response object
 * @param {string} successMessage - Message to send on success
 */
function appendToJsonFile(filePath, newData, res, successMessage) {
  // Step 1: Try to read the existing file
  fs.readFile(filePath, "utf8", function (readErr, fileData) {
    let dataArray = [];

    if (!readErr) {
      // File exists — parse the existing data
      try {
        dataArray = JSON.parse(fileData);
      } catch (parseErr) {
        // If file is corrupted, start fresh
        console.error("Error parsing JSON file, starting fresh:", parseErr.message);
        dataArray = [];
      }
    }
    // If readErr, file doesn't exist yet — we'll create it with empty array

    // Step 2: Add timestamp and push new data
    newData.submittedAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    dataArray.push(newData);

    // Step 3: Write the updated array back to the file
    fs.writeFile(filePath, JSON.stringify(dataArray, null, 2), "utf8", function (writeErr) {
      if (writeErr) {
        console.error("Error writing to file:", writeErr.message);
        return res.status(500).json({ message: "Server error: Could not save data." });
      }

      // Success!
      console.log(`✅ Data saved to ${path.basename(filePath)}`);
      return res.status(200).json({ message: successMessage });
    });
  });
}

// ======================================
//  API ROUTE: POST /enroll
// ======================================

app.post("/enroll", function (req, res) {
  // Get data from request body
  const { name, email, phone, course } = req.body;

  // Basic validation — make sure all fields are provided
  if (!name || !email || !phone || !course) {
    return res.status(400).json({ message: "All fields are required (name, email, phone, course)." });
  }

  // Build the enrollment object
  const enrollmentData = {
    name: name,
    email: email,
    phone: phone,
    course: course,
  };

  // File path for enrollments
  const filePath = path.join(__dirname, "../data/enrollments.json");

  // Save to file
  appendToJsonFile(filePath, enrollmentData, res, "Enrollment saved successfully");
});

// ======================================
//  API ROUTE: POST /api/enroll
//  Called by the payment page after simulated payment
//  Phone is optional (user data comes from localStorage)
// ======================================

app.post("/api/enroll", function (req, res) {
  // Get data from request body
  const { name, email, phone, course } = req.body;

  // Validation — name, email, and course are required (phone is optional)
  if (!name || !email || !course) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and course are required.",
    });
  }

  // Build the enrollment object
  const enrollmentData = {
    name: name,
    email: email,
    phone: phone || "N/A",
    course: course,
  };

  // File path for enrollments
  const filePath = path.join(__dirname, "../data/enrollments.json");

  // Save to file
  appendToJsonFile(filePath, enrollmentData, res, "Enrollment saved successfully! Payment confirmed.");
});

// ======================================
//  API ROUTE: POST /contact
// ======================================

app.post("/contact", function (req, res) {
  // Get data from request body
  const { name, email, message } = req.body;

  // Basic validation — make sure all fields are provided
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required (name, email, message)." });
  }

  // Build the contact object
  const contactData = {
    name: name,
    email: email,
    message: message,
  };

  // File path for contacts
  const filePath = path.join(__dirname, "../data/contacts.json");

  // Save to file
  appendToJsonFile(filePath, contactData, res, "Message saved successfully");
});

// ======================================
//  API ROUTE: POST /signup
// ======================================

app.post("/signup", function (req, res) {
  // Get data from request body
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required (name, email, password)." });
  }

  // File path for users
  const filePath = path.join(__dirname, "../data/users.json");

  // Read existing users to check for duplicates
  fs.readFile(filePath, "utf8", function (readErr, fileData) {
    let usersArray = [];

    if (!readErr) {
      try {
        usersArray = JSON.parse(fileData);
      } catch (parseErr) {
        usersArray = [];
      }
    }

    // Check if email already exists
    const emailExists = usersArray.some(function (user) {
      return user.email === email;
    });

    if (emailExists) {
      return res.status(400).json({ success: false, message: "This email is already registered. Please login instead." });
    }

    // Create new user object
    const newUser = {
      name: name,
      email: email,
      password: password,
      registeredAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };

    usersArray.push(newUser);

    // Save to file
    fs.writeFile(filePath, JSON.stringify(usersArray, null, 2), "utf8", function (writeErr) {
      if (writeErr) {
        console.error("Error writing users.json:", writeErr.message);
        return res.status(500).json({ success: false, message: "Server error: Could not save user." });
      }

      console.log("✅ New user registered:", email);
      return res.status(200).json({ success: true, message: "Account created successfully!" });
    });
  });
});

// ======================================
//  API ROUTE: POST /login
// ======================================

app.post("/login", function (req, res) {
  // Get data from request body
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  // File path for users
  const filePath = path.join(__dirname, "../data/users.json");

  // Read users file
  fs.readFile(filePath, "utf8", function (readErr, fileData) {
    if (readErr) {
      // If file doesn't exist, no users registered yet
      return res.status(401).json({ success: false, message: "No users registered yet. Please sign up first." });
    }

    let usersArray = [];
    try {
      usersArray = JSON.parse(fileData);
    } catch (parseErr) {
      return res.status(500).json({ success: false, message: "Server error: Could not read user data." });
    }

    // Find user with matching email and password
    const user = usersArray.find(function (u) {
      return u.email === email && u.password === password;
    });

    if (user) {
      console.log("✅ User logged in:", email);
      return res.status(200).json({ success: true, name: user.name, message: "Login successful!" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
  });
});

// ======================================
//  API ROUTES: GET (Admin Dashboard)
// ======================================

// Helper: Read a JSON file and return its contents
function readJsonFile(filePath, res) {
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      // File doesn't exist yet — return empty array
      return res.status(200).json([]);
    }
    try {
      return res.status(200).json(JSON.parse(data));
    } catch (parseErr) {
      return res.status(200).json([]);
    }
  });
}

// GET /api/users — return all registered users (without passwords)
app.get("/api/users", function (req, res) {
  const filePath = path.join(__dirname, "../data/users.json");
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) return res.status(200).json([]);
    try {
      const users = JSON.parse(data).map(function (u) {
        return { name: u.name, email: u.email, registeredAt: u.registeredAt };
      });
      return res.status(200).json(users);
    } catch (parseErr) {
      return res.status(200).json([]);
    }
  });
});

// GET /api/enrollments — return all enrollments
app.get("/api/enrollments", function (req, res) {
  readJsonFile(path.join(__dirname, "../data/enrollments.json"), res);
});

// GET /api/contacts — return all contact messages
app.get("/api/contacts", function (req, res) {
  readJsonFile(path.join(__dirname, "../data/contacts.json"), res);
});

// GET /enrollments — (also available without /api prefix)
app.get("/enrollments", function (req, res) {
  readJsonFile(path.join(__dirname, "../data/enrollments.json"), res);
});

// GET /contacts — (also available without /api prefix)
app.get("/contacts", function (req, res) {
  readJsonFile(path.join(__dirname, "../data/contacts.json"), res);
});

// ======================================
//  COURSE CATALOG (matches frontend courses array)
// ======================================

const courseCatalog = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    category: "Development",
    description: "Master HTML, CSS, JavaScript, and modern frameworks. Build real-world projects from scratch and launch your career as a full-stack web developer.",
    price: "₹4,999",
    originalPrice: "₹9,999",
    duration: "12 Weeks",
    lessons: 48,
    level: "Beginner",
    students: "2,340",
    image: "../images/course-webdev.png",
    video: "https://www.youtube.com/embed/zJSY8tbf_ys",
  },
  {
    id: 2,
    title: "Python Programming",
    category: "Programming",
    description: "Learn Python from the ground up. Cover data types, functions, OOP, file handling, and build automation scripts and mini projects.",
    price: "₹3,499",
    originalPrice: "₹7,499",
    duration: "8 Weeks",
    lessons: 36,
    level: "Beginner",
    students: "3,120",
    image: "../images/course-python.png",
    video: "https://www.youtube.com/embed/_uQrJ0TkZlc",
  },
  {
    id: 3,
    title: "Data Science & Analytics",
    category: "Data Science",
    description: "Explore data analysis with Python, Pandas, NumPy, and visualization libraries. Learn machine learning fundamentals and work with real datasets.",
    price: "₹6,999",
    originalPrice: "₹12,999",
    duration: "16 Weeks",
    lessons: 60,
    level: "Intermediate",
    students: "1,850",
    image: "../images/course-datascience.png",
    video: "https://www.youtube.com/embed/ua-CiDNNj30",
  },
  {
    id: 4,
    title: "UI/UX Design Masterclass",
    category: "Design",
    description: "Learn user-centered design principles, wireframing, prototyping with Figma, and create stunning interfaces that users love.",
    price: "₹4,499",
    originalPrice: "₹8,999",
    duration: "10 Weeks",
    lessons: 40,
    level: "Beginner",
    students: "1,560",
    image: "../images/course-uiux.png",
    video: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
  },
  {
    id: 5,
    title: "Digital Marketing",
    category: "Marketing",
    description: "Master SEO, social media marketing, Google Ads, email campaigns, and analytics to grow any business online effectively.",
    price: "₹3,999",
    originalPrice: "₹7,999",
    duration: "8 Weeks",
    lessons: 32,
    level: "Beginner",
    students: "2,780",
    image: "../images/course-marketing.png",
    video: "https://www.youtube.com/embed/bixR-KIJKYM",
  },
  {
    id: 6,
    title: "Mobile App Development",
    category: "Development",
    description: "Build cross-platform mobile apps using React Native. Learn navigation, state management, APIs, and deploy to app stores.",
    price: "₹5,999",
    originalPrice: "₹11,999",
    duration: "14 Weeks",
    lessons: 52,
    level: "Intermediate",
    students: "1,430",
    image: "../images/course-mobile.png",
    video: "https://www.youtube.com/embed/0-S5a0eXPoc",
  },
];

// ======================================
//  API ROUTE: GET /api/my-courses
//  Returns enrolled courses for a specific user (by email)
//  Enriched with full course data (image, video, etc.)
// ======================================

app.get("/api/my-courses", function (req, res) {
  // Get the user's email from query parameter
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email query parameter is required." });
  }

  // Read enrollments file
  const filePath = path.join(__dirname, "../data/enrollments.json");

  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      // No enrollments file yet — return empty array
      return res.status(200).json([]);
    }

    let allEnrollments = [];
    try {
      allEnrollments = JSON.parse(data);
    } catch (parseErr) {
      return res.status(200).json([]);
    }

    // Filter enrollments by user email
    const userEnrollments = allEnrollments.filter(function (enrollment) {
      return enrollment.email === email;
    });

    // Remove duplicate courses (keep latest enrollment per course)
    const seen = {};
    const uniqueEnrollments = [];
    for (let i = userEnrollments.length - 1; i >= 0; i--) {
      if (!seen[userEnrollments[i].course]) {
        seen[userEnrollments[i].course] = true;
        uniqueEnrollments.unshift(userEnrollments[i]);
      }
    }

    // Enrich each enrollment with full course data from catalog
    const enrichedCourses = uniqueEnrollments.map(function (enrollment) {
      // Find matching course in catalog
      var courseData = courseCatalog.find(function (c) {
        return c.title === enrollment.course;
      });

      return {
        enrolledName: enrollment.name,
        enrolledEmail: enrollment.email,
        enrolledAt: enrollment.submittedAt,
        // Course details from catalog (or defaults)
        courseId: courseData ? courseData.id : null,
        title: enrollment.course,
        category: courseData ? courseData.category : "General",
        description: courseData ? courseData.description : "",
        price: courseData ? courseData.price : "—",
        duration: courseData ? courseData.duration : "—",
        lessons: courseData ? courseData.lessons : 0,
        level: courseData ? courseData.level : "—",
        students: courseData ? courseData.students : "—",
        image: courseData ? courseData.image : "../images/course-webdev.png",
        video: courseData ? courseData.video : "",
      };
    });

    console.log("📚 Returning " + enrichedCourses.length + " courses for: " + email);
    return res.status(200).json(enrichedCourses);
  });
});

// ======================================
//  START THE SERVER
// ======================================

app.listen(PORT, function () {
  console.log("=========================================");
  console.log("  LearnHub Server is running!");
  console.log(`  Local:  http://localhost:${PORT}`);
  console.log("=========================================");
});

