const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

// Initialize the database
const db = new Database('jobs.db', { verbose: console.log });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS job_skills (
    job_id INTEGER,
    skill_id INTEGER,
    FOREIGN KEY(job_id) REFERENCES jobs(id),
    FOREIGN KEY(skill_id) REFERENCES skills(id)
  );

  CREATE TABLE IF NOT EXISTS company_jobs (
    company_id INTEGER,
    job_id INTEGER,
    FOREIGN KEY(company_id) REFERENCES companies(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
  );
`);

// API endpoint to handle job creation
app.post('/add-job', (req, res) => {
  let { jobTitle, companyName, skills } = req.body;
  jobTitle = jobTitle.trim().toLowerCase()
  companyName = companyName.trim().toLowerCase()

  // Insert the job
  const jobStmt = db.prepare('INSERT INTO jobs (title) VALUES (?)');
  const jobInfo = jobStmt.run(jobTitle);
  const jobId = jobInfo.lastInsertRowid;

  // Insert the company if it doesn't exist
  let companyId;
  const companyStmt = db.prepare('SELECT id FROM companies WHERE name = ?');
  const existingCompany = companyStmt.get(companyName);
  if (existingCompany) {
    companyId = existingCompany.id;
  } else {
    const insertCompanyStmt = db.prepare('INSERT INTO companies (name) VALUES (?)');
    const companyInfo = insertCompanyStmt.run(companyName);
    companyId = companyInfo.lastInsertRowid;
  }

  // Insert into company_jobs
  const companyJobsStmt = db.prepare('INSERT INTO company_jobs (company_id, job_id) VALUES (?, ?)');
  companyJobsStmt.run(companyId, jobId);

  // Insert skills and job_skills
  const skillStmt = db.prepare('INSERT INTO skills (name) VALUES (?)');
  const skillSelectStmt = db.prepare('SELECT id FROM skills WHERE name = ?');
  const jobSkillsStmt = db.prepare('INSERT INTO job_skills (job_id, skill_id) VALUES (?, ?)');

  skills.forEach(skill => {
    skill = skill.trim().toLowerCase()
    let skillId;
    const existingSkill = skillSelectStmt.get(skill);
    if (existingSkill) {
      skillId = existingSkill.id;
    } else {
      const skillInfo = skillStmt.run(skill);
      skillId = skillInfo.lastInsertRowid;
    }
    jobSkillsStmt.run(jobId, skillId);
  });

  res.status(201).send({ message: 'Job created successfully!' });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
