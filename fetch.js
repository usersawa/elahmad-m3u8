const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const channels = {
    "mbc_variety": "https://www.elahmad.com/tv/mobiletv/glarb.php?id=mbc_variety",
    "mbc1": "https://www.elahmad.com/tv/mobiletv/glarb.php?id=mbc1",
    "mbc2": "https://www.elahmad.com/tv/mobiletv/glarb.php?id=mbc2"
  };

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  for (const [name, url] of Object.entries(channels)) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      const m3u8 = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('video, source'))
          .map(v => v.src || v.getAttribute('src'))
          .filter(src => src && src.endsWith('.m3u8'));
        return links[0] || '';
      });

      const data = { link: m3u8 };
      if (!fs.existsSync('data')) fs.mkdirSync('data');
      fs.writeFileSync(`data/${name}.json`, JSON.stringify(data));
      console.log(`Updated ${name}: ${m3u8}`);

    } catch (e) {
      console.log(`Error fetching ${name}:`, e);
    }
  }

  await browser.close();
})();
