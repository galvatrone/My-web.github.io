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
      lat: data.latitude,
      lon: data.longitude,
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
    ? ` GEO=${geo.country}/${geo.city} ISP=${geo.isp} COORD=${geo.lat},${geo.lon}`
    : "";

  const localIp = req.query.local_ip || "";

  console.log(
    `[${time}] IP=${ip} XFWD=${xfwd} LOCAL=${localIp} UA=${ua}${geoStr}`
  );

  res.status(204).end();
});
