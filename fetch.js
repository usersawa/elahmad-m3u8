const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = "https://www.elahmad.com/tv/mobiletv/glarb.php?id=mbc_variety";

  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // البحث عن رابط m3u8 داخل أي <script> يحتوي على ".m3u8"
    const m3u8 = await page.evaluate(() => {
      const script = Array.from(document.scripts)
        .map(s => s.textContent)
        .find(t => t.includes(".m3u8"));
      const match = script?.match(/https?:\/\/[^'"]+\.m3u8/);
      return match ? match[0] : "";
    });

    // إنشاء مجلد data إذا لم يكن موجود
    if (!fs.existsSync('data')) fs.mkdirSync('data');

    // كتابة JSON
    fs.writeFileSync(`data/mbc_variety.json`, JSON.stringify({ link: m3u8 }));
    console.log(`Updated mbc_variety: ${m3u8}`);
  } catch (e) {
    console.log("Error fetching mbc_variety:", e);
    fs.writeFileSync(`data/mbc_variety.json`, JSON.stringify({ link: "" }));
  }

  await browser.close();
})();
