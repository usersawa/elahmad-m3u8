const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = "https://www.elahmad.com/tv/mobiletv/glarb.php?id=mbc_variety";

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // البحث عن أي رابط m3u8 في الفيديو أو source
    const m3u8 = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('video, source'))
        .map(v => v.src || v.getAttribute('src'))
        .filter(src => src && src.endsWith('.m3u8'));
      return links[0] || '';
    });

    const data = { link: m3u8 };
    if (!fs.existsSync('data')) fs.mkdirSync('data');
    fs.writeFileSync(`data/mbc_variety.json`, JSON.stringify(data));

    console.log(`Updated mbc_variety: ${m3u8}`);
  } catch (e) {
    console.log("Error fetching mbc_variety:", e);
  }

  await browser.close();
})();
