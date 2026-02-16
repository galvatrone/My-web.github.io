import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/log", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket.remoteAddress;
  const ua = req.headers["user-agent"];
  const time = new Date().toISOString();

  console.log([${time}] IP=${ip} UA=${ua});
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`IP logger listening on port ${port}`);
});