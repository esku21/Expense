// register.js
const API = "/api";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  const msg = document.getElementById("registerMsg");
  if (res.ok) {
    msg.textContent = "Registration successful. Redirecting to login...";
    setTimeout(() => (window.location.href = "login.html"), 1000);
  } else {
    msg.textContent = data.error || "Failed to register";
  }
});
