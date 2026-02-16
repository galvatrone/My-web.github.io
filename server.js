import express from "express";

const app = express();
const port = process.env.PORT || 3000;

async function getGeo(ip) {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return {
      country: data.country,
      city: data.city,
      isp: data.connection?.isp,
    };
  } catch {
    return null;
  }
}

app.get("/log", async (req, res) => {
  const xfwd = req.headers["x-forwarded-for"] || "";
  const ip =
    xfwd.split(",")[0]?.trim() ||
    req.socket.remoteAddress;
  const ua = req.headers["user-agent"];
  const time = new Date().toISOString();

  const geo = await getGeo(ip);
  const geoStr = geo
    ? ` GEO=${geo.country}/${geo.city} ISP=${geo.isp}`
    : "";

  console.log(
    `[${time}] IP=${ip} XFWD=${xfwd} UA=${ua}${geoStr}`
  );

  res.status(204).end();
});

app.listen(port, () => {
  console.log(`IP logger listening on port ${port}`);
});
