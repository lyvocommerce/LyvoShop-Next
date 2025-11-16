// src/services/auth.js
const API_BASE = import.meta.env.VITE_API_URL || "https://api.lyvoshop.app";

export async function authTelegram(initData) {
  // ⚠️ Передаём как простую строку, без JSON.stringify
  const res = await fetch(`${API_BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: initData, // ← чистая строка, без изменений
  });

  if (!res.ok) {
    console.error("❌ Auth failed:", res.status);
    throw new Error(`Auth failed: ${res.status}`);
  }

  const data = await res.json();
  console.log("✅ Auth response:", data);
  return data;
}