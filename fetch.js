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

  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 90000,
    });

    // انتظار تحميل الإطارات
    await new Promise(r => setTimeout(r, 5000));

    // البحث داخل جميع الـ iframes وتشغيل الفيديو إن وُجد
    const frames = page.frames();
    for (const frame of frames) {
      try {
        await frame.evaluate(() => {
          const video = document.querySelector("video");
          if (video) {
            video.muted = true;
            video.play().catch(() => {});
          }
        });
      } catch (e) {}
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
