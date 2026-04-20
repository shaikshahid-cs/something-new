/* ===================================
   Online Learning Platform - Script
   =================================== */

// -------- Backend API URL --------
const API_URL = "";

// -------- Course Data --------
const courses = [
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

// ============================================
//  NAVBAR LOGIN STATE (Runs on ALL pages)
// ============================================

/**
 * Checks localStorage for logged-in user.
 * If logged in  → shows "Hi, Name" with dropdown (My Courses, Logout)
 * If not logged in → shows "Login" button
 */
function initNavAuthState() {
  const authContainer = document.getElementById("nav-auth");
  if (!authContainer) return;

  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.name) {
    // User IS logged in — show profile dropdown
    authContainer.innerHTML = `
      <div class="nav-user" id="nav-user">
        <button class="nav-user-btn" id="nav-user-btn">
          <span class="nav-user-avatar">${user.name.charAt(0).toUpperCase()}</span>
          Hi, ${user.name.split(" ")[0]}
          <span class="nav-user-arrow">▾</span>
        </button>
        <div class="nav-user-dropdown" id="nav-user-dropdown">
          <a href="enrolled.html">📚 My Courses</a>
          <a href="#" id="logout-btn">🚪 Logout</a>
        </div>
      </div>
    `;

    // Toggle dropdown on click
    var userBtn = document.getElementById("nav-user-btn");
    var dropdown = document.getElementById("nav-user-dropdown");

    userBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      dropdown.classList.remove("open");
    });

    // Logout handler
    document.getElementById("logout-btn").addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.reload();
    });

  } else {
    // User NOT logged in — show Login button
    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-primary" style="padding: 8px 20px; color: #fff;">Login</a>
    `;
  }
}

// -------- Navbar Scroll Effect --------
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }
});

// -------- Mobile Menu Toggle --------
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("open");
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navLinks.classList.remove("open");
      });
    });
  }
}

// -------- Scroll Reveal Animation --------
function initScrollReveal() {
  const elements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

// -------- Render Course Cards --------
function renderCourseCards(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const coursesToShow = limit ? courses.slice(0, limit) : courses;

  container.innerHTML = coursesToShow
    .map(function (course) {
      return `
      <div class="course-card fade-in">
        <img src="${course.image}" alt="${course.title}" class="course-card-img" />
        <div class="course-card-body">
          <div class="course-card-category">${course.category}</div>
          <h3 class="course-card-title">${course.title}</h3>
          <p class="course-card-desc">${course.description}</p>
          <div class="course-card-footer">
            <span class="course-price">${course.price}</span>
            <a href="details.html?id=${course.id}" class="btn btn-outline">View Details</a>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  // Re-init scroll reveal for new elements
  initScrollReveal();
}

// -------- Render Course Details --------
function renderCourseDetails() {
  const params = new URLSearchParams(window.location.search);
  const courseId = parseInt(params.get("id"));
  const course = courses.find(function (c) {
    return c.id === courseId;
  });

  if (!course) return;

  // Update page title
  document.title = course.title + " — LearnHub";

  // Fill in the detail sections
  const setHTML = function (id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
  };

  const setSrc = function (id, value) {
    const el = document.getElementById(id);
    if (el) el.src = value;
  };

  const setHref = function (id, value) {
    const el = document.getElementById(id);
    if (el) el.href = value;
  };

  setHTML("detail-title", course.title);
  setHTML("detail-category", course.category);
  setHTML("detail-description", course.description);
  setHTML("detail-price", course.price);
  setHTML("detail-original-price", course.originalPrice);
  setHTML("detail-duration", course.duration);
  setHTML("detail-lessons", course.lessons + " Lessons");
  setHTML("detail-level", course.level);
  setHTML("detail-students", course.students + " Students");
  setSrc("detail-image", course.image);
  setHref("detail-enroll-btn", "payment.html?id=" + course.id);
}

// -------- Pre-fill Enrollment Form --------
// Auto-fills course from URL + user name/email from localStorage
function prefillEnrollForm() {
  const params = new URLSearchParams(window.location.search);
  const courseName = params.get("course");
  const courseSelect = document.getElementById("enroll-course");

  // Pre-fill course from URL
  if (courseName && courseSelect) {
    for (let i = 0; i < courseSelect.options.length; i++) {
      if (courseSelect.options[i].value === courseName) {
        courseSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Pre-fill name and email from logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const nameField = document.getElementById("enroll-name");
    const emailField = document.getElementById("enroll-email");
    if (nameField && user.name) nameField.value = user.name;
    if (emailField && user.email) emailField.value = user.email;
  }
}

// -------- Enrollment Form Handler --------
// Sends enrollment data to POST /enroll on the backend
function initEnrollFormHandler() {
  const form = document.getElementById("enroll-form");
  const success = document.getElementById("enroll-success");

  if (form && success) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Collect form values
      const data = {
        name: document.getElementById("enroll-name").value,
        email: document.getElementById("enroll-email").value,
        phone: document.getElementById("enroll-phone").value,
        course: document.getElementById("enroll-course").value,
      };

      // Send POST request to backend
      fetch(API_URL + "/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          // Show success message from server
          alert(result.message);
          form.style.display = "none";
          success.classList.add("show");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch(function (error) {
          console.error("Enrollment error:", error);
          alert("Could not connect to server. Make sure the backend is running on port 5000.");
        });
    });
  }
}

// -------- Contact Form Handler --------
// Sends contact data to POST /contact on the backend
function initContactFormHandler() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("contact-success");

  if (form && success) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Collect form values
      const data = {
        name: document.getElementById("contact-name").value,
        email: document.getElementById("contact-email").value,
        message: document.getElementById("contact-message").value,
      };

      // Send POST request to backend
      fetch(API_URL + "/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          // Show success message from server
          alert(result.message);
          form.style.display = "none";
          success.classList.add("show");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch(function (error) {
          console.error("Contact error:", error);
          alert("Could not connect to server. Make sure the backend is running on port 5000.");
        });
    });
  }
}

// -------- Active Nav Link --------
function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// -------- Initialize --------
document.addEventListener("DOMContentLoaded", function () {
  initNavAuthState();
  initMobileMenu();
  initScrollReveal();
  setActiveNav();

  // Page-specific initializations
  renderCourseCards("home-courses", 3);
  renderCourseCards("all-courses");
  renderCourseDetails();
  prefillEnrollForm();
  initEnrollFormHandler();
  initContactFormHandler();
});
