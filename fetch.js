const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const url =
    "https://www.elahmad.com/tv/live/shahid_shaka.php?id=mbc_max";

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  const page = await browser.newPage();

  let foundM3U8 = new Set();

  // مراقبة كل الردود
  page.on("response", async (res) => {
    const u = res.url();
    if (u.includes(".m3u8")) {
      console.log("FOUND M3U8 (response):", u);
      foundM3U8.add(u);
    }
  });

  // مراقبة الطلبات أيضًا
  page.on("request", (req) => {
    const u = req.url();
    if (u.includes(".m3u8")) {
      console.log("FOUND M3U8 (request):", u);
      foundM3U8.add(u);
    }
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  // دالة تحميل آمنة مع retry
  async function safeGoto(page, url) {
    for (let i = 0; i < 3; i++) {
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
        return;
      } catch (e) {
        console.log(`Retrying... attempt ${i + 1}`);
      }
    }
    throw new Error("Failed to load page after 3 attempts");
  }

  try {
    await safeGoto(page, url);

    // انتظار تحميل الإطارات
    await new Promise(r => setTimeout(r, 5000));

    // البحث داخل جميع الـ iframes وتشغيل الفيديو إن وُجد
    const frames = page.frames();
    for (const frame of frames) {
      try {
        await frame.waitForSelector("video", { timeout: 10000 });
        await frame.evaluate(() => {
          const video = document.querySelector("video");
          if (video) {
            video.muted = true;
            video.play().catch(() => {});
          }
        });
      } catch (e) {
        console.log("No video in this frame or timeout");
      }
    }

    // انتظار توليد روابط البث
    await new Promise(r => setTimeout(r, 15000));

    if (!fs.existsSync("data")) fs.mkdirSync("data");

    fs.writeFileSync(
      "data/mbc_variety.json",
      JSON.stringify(
        { links: Array.from(foundM3U8) },
        null,
        2
      )
    );

    console.log("FINAL M3U8 LINKS:", Array.from(foundM3U8));
  } catch (err) {
    console.error("ERROR:", err);
  }

  await browser.close();
})();
