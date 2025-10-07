const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn')
const loginBtn = document.querySelector('.login-btn')

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})

const backendUrl = "http://127.0.0.1:8000";

// ------------------- LOGIN -------------------
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
        const response = await fetch(`${backendUrl}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });

        if (!response.ok) throw new Error("Login failed!");

        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        
        // Navigate to home page after successful login
        window.location.href = "home.html";  // <-- put your home/dashboard page here
    } catch (err) {
        alert(err.message);
    }
});


// ------------------- REGISTER -------------------
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const full_name = document.getElementById("username").value;

    try {
        const response = await fetch(`${backendUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, full_name }),
        });

        if (!response.ok) throw new Error("Registration failed!");

        const data = await response.json();
        alert(`User registered! Email: ${data.email}`);
        console.log("Registered user:", data);
    } catch (err) {
        alert(err.message);
    }
});

// ------------------- GET CURRENT USER -------------------
async function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch(`${backendUrl}/users/me`, {
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        console.log("Logged-in user:", data);
        // Optionally display user info on page
        alert(`Welcome ${data.full_name}!`);
    } catch (err) {
        console.error(err.message);
    }
}
