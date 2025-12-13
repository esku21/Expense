// dashboard.js
const API = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function fetchExpenses() {
  const res = await fetch(`${API}/expenses`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (res.status === 401 || res.status === 403) {
    window.location.href = "login.html";
    return;
  }
  const items = await res.json();
  renderExpenses(items);
}

function renderExpenses(items) {
  const tbody = document.getElementById("expenseBody");
  tbody.innerHTML = "";
  let total = 0;

  items.forEach((e) => {
    total += Number(e.amount);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.description}</td>
      <td>${e.category || "General"}</td>
      <td>${Number(e.amount).toFixed(2)}</td>
      <td>${new Date(e.date).toLocaleDateString()}</td>
      <td><button class="danger" data-id="${e._id}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("totalAmount").textContent = total.toFixed(2);
}

document.getElementById("expenseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;

  const res = await fetch(`${API}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ description, amount, date, category }),
  });

  const msg = document.getElementById("dashMsg");
  if (res.ok) {
    document.getElementById("expenseForm").reset();
    msg.textContent = "Expense added";
    fetchExpenses();
  } else {
    const data = await res.json();
    msg.textContent = data.error || "Failed to add expense";
  }
});

document.getElementById("expenseBody").addEventListener("click", async (e) => {
  if (e.target.matches("button[data-id]")) {
    const id = e.target.getAttribute("data-id");
    const res = await fetch(`${API}/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) fetchExpenses();
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// Boot
if (!getToken()) {
  window.location.href = "login.html";
} else {
  fetchExpenses();
}
