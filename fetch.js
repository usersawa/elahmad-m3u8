const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const url =
    "https://www.elahmad.com/tv/mobiletv/glarb.php?id=mbc_variety";

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  let foundM3U8 = "";

  // التقاط طلبات الشبكة
  page.on("request", (req) => {
    const u = req.url();
    if (u.includes(".m3u8")) {
      console.log("FOUND:", u);
      if (!foundM3U8) {
        foundM3U8 = u;
      }
    }
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 80000,
    });

    // انتظار تحميل المشغل
    await page.waitForTimeout(8000);

    if (!fs.existsSync("data")) {
      fs.mkdirSync("data");
    }

    fs.writeFileSync(
      "data/mbc_variety.json",
      JSON.stringify({ link: foundM3U8 }, null, 2)
    );

    console.log("Extracted m3u8:", foundM3U8);
  } catch (err) {
    console.error("Error:", err);
  }

  await browser.close();
})();    fs.writeFileSync(
      "data/mbc_variety.json",
      JSON.stringify({ link: foundM3U8 }, null, 2)
    );

    console.log("Extracted:", foundM3U8);
  } catch (err) {
    console.log("Error:", err);
  }

  await browser.close();
})();
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
