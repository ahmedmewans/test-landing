const fs = require("fs");
const pdf = require("pdf-parse");
async function run() {
  const files = [
    "e:/learning/new-portfolio/resume/Ahmed Abdo-FrontEnd-Resume.pdf",
    "e:/learning/new-portfolio/resume/Ahmed Abdo-FrontEnd-CV.pdf",
  ];
  for (const file of files) {
    try {
      const dataBuffer = fs.readFileSync(file);
      const data = await pdf(dataBuffer);
      console.log(`---TEXT FROM ${file}---\n${data.text}`);
    } catch (e) {
      console.error(`Error reading ${file}:`, e);
    }
  }
}
run();
