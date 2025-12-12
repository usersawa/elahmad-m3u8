const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const url = "https://www.elahmad.com/tv/mobiletv/glarb.php?id=mbc_variety";

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 70000 });

    // نبحث داخل كل السكربتات والملفات المحملة
    const m3u8 = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"));

      for (const s of scripts) {
        const txt = s.textContent;
        if (txt && txt.includes(".m3u8")) {
          const match = txt.match(/https?:\/\/[^'"]+\.m3u8/);
          if (match) return match[0];
        }
      }

      // محاولة ثانية: الروابط القادمة من الشبكة
      return "";
    });

    if (!fs.existsSync("data")) fs.mkdirSync("data");

    fs.writeFileSync(
      "data/mbc_variety.json",
      JSON.stringify({ link: m3u8 }, null, 2)
    );

    console.log("Extracted m3u8:", m3u8);
  } catch (err) {
    console.log("Error:", err);
  }

  await browser.close();
})();
