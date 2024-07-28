const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

app.post('/generate-certificate', async (req, res) => {
  const { name, hours } = req.body;

  // Load the certificate template
  const templatePath = path.resolve(__dirname, 'templates', 'certificate_template.pdf');
  const templateBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const { width, height } = firstPage.getSize();

  // Find and replace placeholders
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSize = 30;

  // Modify these coordinates to match where your placeholders are in the PDF
  const nameX = 303;
  const nameY = 324;
  const hoursX = 273;
  const hoursY = 353;

  firstPage.drawText(name, {
    x: nameX,
    y: height - nameY,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`${hours} `, {
    x: hoursX,
    y: height - hoursY,
    size: 12.3,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
  res.send(Buffer.from(pdfBytes));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
