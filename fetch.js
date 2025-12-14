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

  const foundM3U8 = new Set();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  // 🔥 التقاط أي m3u8 من الشبكة (أهم جزء)
  page.on("request", (req) => {
    const u = req.url();
    if (u.includes(".m3u8")) {
      console.log("FOUND M3U8:", u);
      foundM3U8.add(u);
    }
  });

  page.on("response", (res) => {
    const u = res.url();
    if (u.includes(".m3u8")) {
      console.log("FOUND M3U8:", u);
      foundM3U8.add(u);
    }
  });

  try {
    console.log("Opening page...");
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 0, // لا Timeout
    });

    console.log("Waiting for network activity...");
    // ⏳ انتظار طويل لتوليد التوكن والبث
    await new Promise((r) => setTimeout(r, 30000));

    if (!fs.existsSync("data")) fs.mkdirSync("data");

    fs.writeFileSync(
      "data/mbc_variety.json",
      JSON.stringify(
        { links: Array.from(foundM3U8) },
        null,
        2
      )
    );

    console.log("========== RESULT ==========");
    console.log(Array.from(foundM3U8));
  } catch (err) {
    console.error("ERROR:", err);
  }

  await browser.close();
})();
