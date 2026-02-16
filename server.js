import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const STATS_KEY = process.env.STATS_KEY || "mysecret"; // задай в Render

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE = path.join(__dirname, "logs.jsonl");

async function getGeo(ip) {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    console.log("ipwho status", res.status);
    if (!res.ok) return null;
    const data = await res.json();
    console.log("ipwho data", data);
    if (!data.success) return null;
    return {
      country: data.country,
      city: data.city,
      isp: data.connection?.isp,
      lat: data.latitude,
      lon: data.longitude,
      region: data.region,
      timezone: data.timezone?.id,
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
    th, td { border: 1px solid #555; padding: 4px 8px; }
  </style>
</head>
<body>
  <h1>Статистика</h1>
  <p>Всего заходов: ${stats.total}</p>

  <h2>По IP</h2>
  <table>
    <tr><th>IP</th><th>Хитов</th></tr>
    ${Object.entries(stats.byIp)
      .map(([ip, count]) => `<tr><td>${ip}</td><td>${count}</td></tr>`)
      .join("")}
  </table>

  <h2>По странам</h2>
  <table>
    <tr><th>Страна</th><th>Хитов</th></tr>
    ${Object.entries(stats.byCountry)
      .map(([country, count]) => `<tr><td>${country}</td><td>${count}</td></tr>`)
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
