const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/generate-pdf", async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send("Falta el parámetro 'url'");
    }

    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="output.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).send("Error al generar el PDF: " + error.message);
    }
});

app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
