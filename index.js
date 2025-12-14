const express = require("express");
const fetch = require("node-fetch");

const app = express();

// رابط البث الجديد
const TARGET_URL = "https://p-ltv.akamaized.net/ltv/ltv.m3u8";

app.get("*", async (req, res) => {
  try {
    const response = await fetch(TARGET_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Android TV; Android 13)",
        "Accept": "*/*"
      }
    });

    // Headers مهمة لتشغيل HLS
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // بث مباشر (streaming حقيقي)
    response.body.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("HLS Proxy running");
});
