// script.js

const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const backendUrl = "http://127.0.0.1:8000";

// ------------------- SWITCH LOGIN / REGISTER UI -------------------
if (registerBtn && loginBtn && container) {
  registerBtn.addEventListener('click', () => container.classList.add('active'));
  loginBtn.addEventListener('click', () => container.classList.remove('active'));
}

// ------------------- LOGIN -------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) {
      alert("Input fields not found");
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // match UserLogin model
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend (422)
        if (Array.isArray(data.detail)) {
          throw new Error(data.detail.map(d => d.msg).join(", "));
        } else {
          throw new Error(data.detail || "Login failed!");
        }
      }

      // Save token and redirect
      localStorage.setItem("token", data.access_token);
      window.location.href = "home.html"; 
    // alert("Login successful!");
    } catch (err) {
      alert(err.message);
      passwordInput.value = ""; // clear password field
    }
  });
}

// ------------------- REGISTER -------------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const full_name = document.getElementById("username").value.trim();

    if (!email || !password || !full_name) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name }), 
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          throw new Error(data.detail.map(d => d.msg).join(", "));
        } else {
          throw new Error(data.detail || "Registration failed!");
        }
      }

      alert(`User registered successfully!`);
      container?.classList.remove('active'); // switch to login
    } catch (err) {
      alert(err.message);
    }
  });
}

// ------------------- GET CURRENT USER -------------------
async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${backendUrl}/users/me`, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      if (Array.isArray(data.detail)) {
        throw new Error(data.detail.map(d => d.msg).join(", "));
      } else {
        throw new Error(data.detail || "Failed to fetch user");
      }
    }

    console.log("Logged-in user:", data);
    alert(`Welcome ${data.full_name || data.email}!`);
  } catch (err) {
    console.error(err.message);
  }
}
