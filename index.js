const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

// ضع هنا رابط السيرفر الأصلي بدون اسم الملف النهائي
// مثال: https://p-ltv.akamaized.net/ltv
const TARGET = "https://p-ltv.akamaized.net/ltv";

// Proxy لكل الطلبات (playlist + ts chunks)
app.use("/", proxy(TARGET, {
  proxyReqPathResolver: req => {
    // يضيف نفس path من الطلب الأصلي
    return req.originalUrl;
  },
  proxyReqOptDecorator: opts => {
    // محاكاة User-Agent لأي طلب
    opts.headers["User-Agent"] = "Mozilla/5.0 (Android TV; Android 13)";
    return opts;
  },
  proxyErrorHandler: (err, res, next) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HLS Proxy running on port ${PORT}`));
