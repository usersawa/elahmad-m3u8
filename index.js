const express = require("express");
const proxy = require("express-http-proxy");

const app = express();
const TARGET = "https://p-ltv.akamaized.net/ltv";

app.use("/", proxy(TARGET, {
  proxyReqPathResolver: req => `/ltv.m3u8`,
  proxyReqOptDecorator: opts => {
    opts.headers["User-Agent"] = "Mozilla/5.0 (Android TV; Android 13)";
    return opts;
  }
}));

app.listen(process.env.PORT || 3000, () => console.log("HLS Proxy running"));
