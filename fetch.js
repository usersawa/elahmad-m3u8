const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const url =
    "https://www.wohotv.com/android/tv/الإخبارية-السورية/793";

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  let foundM3U8 = "";

  // اعتراض الردود (الأهم)
  page.on("response", async (res) => {
    const u = res.url();
    if (u.includes(".m3u8")) {
      console.log("FOUND M3U8:", u);
      if (!foundM3U8) foundM3U8 = u;
    }
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    // انتظار أي iframe أو فيديو
    await new Promise((r) => setTimeout(r, 5000));

    // محاولة تشغيل الفيديو تلقائيًا
    await page.evaluate(() => {
      const video = document.querySelector("video");
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });

    // انتظار تحميل الشبكة بعد التشغيل
    await new Promise((r) => setTimeout(r, 10000));

    if (!fs.existsSync("data")) fs.mkdirSync("data");

    fs.writeFileSync(
      "data/mbc_variety.json",
      JSON.stringify({ link: foundM3U8 }, null, 2)
    );

    console.log("FINAL m3u8:", foundM3U8);
  } catch (err) {
    console.error("ERROR:", err);
  }

  await browser.close();
})();
