// server.js
// Простой Express backend для приёма заявок с фронта.
// Запуск: `npm init -y` -> `npm i express cors body-parser` (+ nodemailer если нужно)
// node server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SUBMISSIONS_DIR = path.join(__dirname, 'submissions');
const CSV_PATH = path.join(SUBMISSIONS_DIR, 'requests.csv');

app.use(cors());
app.use(express.json({limit:'250kb'}));

// ensure submissions folder and CSV header
if (!fs.existsSync(SUBMISSIONS_DIR)) fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });
if (!fs.existsSync(CSV_PATH)) {
  fs.writeFileSync(CSV_PATH, 'sentAt,company,name,email,usecase,message,lang,pageUrl\n', { encoding:'utf8' });
}

function escapeCsv(v) {
  if (v === null || v === undefined) return '';
  return `"${String(v).replace(/"/g,'""')}"`;
}

app.post('/api/submit', (req, res) => {
  try {
    const { company, name, email, usecase, message, lang, pageUrl, sentAt } = req.body || {};
    // basic validation
    if (!company || !name || !email) {
      return res.status(400).send('Missing required fields: company, name or email');
    }
    const row = [
      sentAt || new Date().toISOString(),
      company, name, email, usecase || '', message || '', lang || '', pageUrl || ''
    ].map(escapeCsv).join(',') + '\n';

    fs.appendFile(CSV_PATH, row, (err) => {
      if (err) {
        console.error('Write error:', err);
        return res.status(500).send('Server error');
      }
      console.log('New submission:', { company, name, email, usecase });
      // OPTIONAL: send notification email (nodemailer) -> see commented block below
      res.status(200).send('OK');
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
});

/* OPTIONAL: nodemailer example (uncomment and configure)
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', port: 587, secure: false,
  auth: { user: 'username', pass: 'password' }
});
function sendNotificationEmail(submission){
  const mail = {
    from: 'AetherDrones <no-reply@aetherdrones.com>',
    to: 'sales@aetherdrones.com',
    subject: `New pilot request: ${submission.company}`,
    text: `New request from ${submission.name} (${submission.email})\n\nUse case: ${submission.usecase}\n\nMessage:\n${submission.message}`
  };
  transporter.sendMail(mail, (err, info)=> {
    if(err) console.error('Mail error', err);
    else console.log('Mail sent', info.response);
  });
}
*/

app.listen(PORT, () => {
  console.log(`AetherDrones backend running on port ${PORT}`);
  console.log(`Submissions stored in: ${CSV_PATH}`);
});
