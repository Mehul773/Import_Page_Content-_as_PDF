// index.js
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.post("/convert-to-pdf", async (req, res) => {
  // Create a browser instance
  const browser = await puppeteer.launch();
  // Create a new page
  const page = await browser.newPage();
  // Website URL to export as pdf
  const { url } = req.body;
  console.log(url);
  // Open URL in current page
  await page.goto(url, { waitUntil: "networkidle0" });
  //To reflect CSS used for screens instead of print
  await page.emulateMediaType("screen");
  // Downlaod the PDF
  const pdf = await page.pdf({
    path: "result.pdf",
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
  });
  // Close the browser instance
  await browser.close();
  return res.json(null);
});
