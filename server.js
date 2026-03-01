import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const STATS_KEY = process.env.STATS_KEY || "mysecret"; // задай в Render
const CONTACT_TO = process.env.CONTACT_TO || "michaelok929@gmail.com";
const ALLOWED_ORIGINS = new Set([
  "https://www.oneix.ltd",
  "https://oneix.ltd",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE = path.join(__dirname, "logs.jsonl");

async function getGeo(ip) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,lat,lon,isp,regionName,timezone,message`);
    console.log("ip-api status", res.status);
    if (!res.ok) return null;
    const data = await res.json();
    console.log("ip-api data", data);
    if (data.status !== "success") return null;
    return {
      country: data.country,
      city: data.city,
      isp: data.isp,
      lat: data.lat,
      lon: data.lon,
      region: data.regionName,
      timezone: data.timezone,
    };
  } catch (e) {
    console.error("getGeo error:", e);
    return null;
  }
}


function appendLog(entry) {
  const line = JSON.stringify(entry) + "\n";
  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error("appendLog error:", err);
  });
}

app.get("/log", async (req, res) => {
  const xfwd = req.headers["x-forwarded-for"] || "";
  const ip =
    xfwd.split(",")[0]?.trim() ||
    req.socket.remoteAddress;
  const ua = req.headers["user-agent"] || "";
  const time = new Date().toISOString();
  const referer = req.headers["referer"] || "";
  const lang = req.headers["accept-language"] || "";
  const localIp = req.query.local_ip || "";

  const geo = await getGeo(ip);

  const logEntry = {
    time,
    ip,
    xfwd,
    localIp,
    ua,
    referer,
    lang,
    lat: geo?.lat ?? null,
    lon: geo?.lon ?? null,
    geo,
  };

  console.log(JSON.stringify(logEntry));
  appendLog(logEntry);

  res.status(204).end();
});


// простая статистика: по IP и по странам
function computeStats(entries) {
  const byIp = {};
  const byCountry = {};

  for (const e of entries) {
    const ip = e.ip || "unknown";
    byIp[ip] = (byIp[ip] || 0) + 1;

    const country = e.geo?.country || "Unknown";
    byCountry[country] = (byCountry[country] || 0) + 1;
  }

  return { byIp, byCountry, total: entries.length };
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendContactEmail(payload) {
  let nodemailer;
  try {
    ({ default: nodemailer } = await import("nodemailer"));
  } catch (error) {
    const err = new Error("Email transport is not installed.");
    err.statusCode = 503;
    throw err;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.CONTACT_FROM || user;

  if (!host || !user || !pass || !from) {
    const err = new Error("SMTP is not configured.");
    err.statusCode = 503;
    throw err;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Address: ${payload.address || "Not provided"}`,
    `Service: ${payload.service || "Not selected"}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Address:</strong> ${escapeHtml(payload.address || "Not provided")}</p>
    <p><strong>Service:</strong> ${escapeHtml(payload.service || "Not selected")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message).replaceAll("\n", "<br>")}</p>
  `;

  await transporter.sendMail({
    from,
    to: CONTACT_TO,
    replyTo: payload.email,
    subject: `Website inquiry from ${payload.name}`,
    text,
    html,
  });
}

app.post("/api/contact", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const address = String(req.body?.address || "").trim();
  const service = String(req.body?.service || "").trim();
  const message = String(req.body?.message || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message || !emailPattern.test(email)) {
    return res.status(400).json({
      ok: false,
      message: "Please provide a valid name, email, and message.",
    });
  }

  try {
    await sendContactEmail({ name, email, address, service, message });
    return res.json({
      ok: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("contact send error:", error);
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: "Unable to send message right now. Please try again later.",
    });
  }
});

app.get("/stats", (req, res) => {
  // форма ввода пароля
  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Stats Login</title>
  <style>
    body { font-family: sans-serif; padding: 16px; background: #111; color: #eee; }
    input { padding: 6px 10px; margin-right: 8px; }
    button { padding: 6px 12px; }
  </style>
</head>
<body>
  <h1>Вход в статистику</h1>
  <form method="POST" action="/stats">
    <input type="password" name="password" placeholder="Пароль" />
    <button type="submit">Войти</button>
  </form>
</body>
</html>
`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.post("/stats", (req, res) => {
  const pass = req.body.password;
  if (pass !== STATS_KEY) {
    return res.status(401).send("Неверный пароль");
  }

  let entries = [];
  try {
    if (fs.existsSync(LOG_FILE)) {
      const lines = fs.readFileSync(LOG_FILE, "utf8").trim().split("\n");
      entries = lines
        .filter((l) => l.trim().length > 0)
        .map((l) => {
          try { return JSON.parse(l); } catch { return null; }
        })
        .filter(Boolean);
    }
  } catch (e) {
    console.error("read stats error:", e);
  }

  const stats = computeStats(entries);
  const last = entries.slice(-100).reverse(); // последние 100 записей

  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Stats</title>
  <style>
    body { font-family: sans-serif; padding: 16px; background: #111; color: #eee; }
    h1, h2 { margin-bottom: 8px; }
    table { border-collapse: collapse; margin-bottom: 16px; }
    th, td { border: 1px solid #555; padding: 4px 8px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Статистика</h1>
  <p>Всего заходов: ${stats.total}</p>

  <h2>По IP (агрегировано)</h2>
  <table>
    <tr><th>IP</th><th>Хитов</th></tr>
    ${Object.entries(stats.byIp)
      .map(([ip, count]) => `<tr><td>${ip}</td><td>${count}</td></tr>`)
      .join("")}
  </table>

  <h2>По странам (агрегировано)</h2>
  <table>
    <tr><th>Страна</th><th>Хитов</th></tr>
    ${Object.entries(stats.byCountry)
      .map(([country, count]) => `<tr><td>${country}</td><td>${count}</td></tr>`)
      .join("")}
  </table>

  <h2>Последние заходы</h2>
  <table>
    <tr>
      <th>Время</th>
      <th>IP</th>
      <th>LOCAL</th>
      <th>Страна</th>
      <th>Город</th>
      <th>UA</th>
    </tr>
    ${last
      .map(
        (e) => `<tr>
          <td>${e.time}</td>
          <td>${e.ip}</td>
          <td>${e.localIp || ""}</td>
          <td>${e.geo?.country || ""}</td>
          <td>${e.geo?.city || ""}</td>
          <td>${e.ua}</td>
        </tr>`
      )
      .join("")}
  </table>
</body>
</html>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.listen(port, () => {
console.log(`IP logger listening on port ${port}`);
});
