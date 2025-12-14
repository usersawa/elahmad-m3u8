import express from "express";
import fetch from "node-fetch";

const app = express();

// رابط m3u8 الأصلي (ضع الرابط الجديد عند انتهاء صلاحية الـ Token)
const TARGET_URL = "https://games2.elahmad.xyz/tv770_www.elahmad.com_alikhbaria_syria/tracks-v1a1/mono.m3u8?token=31a77ee40e121b03401d6ab160baba33df1bc0bb-b13126b4eba97997817b4ea0d3ccb564-1765733977-1765723177";

app.get("*", async (req, res) => {
  try {
    // إعادة توجيه الطلب مع محاكاة كل Headers مهمة
    const response = await fetch(TARGET_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Android TV; Android 13)",
        "Referer": "https://games2.elahmad.xyz/",
        "Origin": "https://games2.elahmad.xyz",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive"
      }
    });

    // إعادة نفس المحتوى كـ Stream
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Access-Control-Allow-Origin", "*");

    response.body.pipe(res);

  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).send("Proxy Error");
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Proxy running"));
