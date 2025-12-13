const API = "/api";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response:", data); // 👈 Add this line

    const msg = document.getElementById("loginMsg");
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      msg.textContent = data.error || "Login failed";
    }
  } catch (err) {
    console.error("Login error:", err);
  }
});
