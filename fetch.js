const { execSync } = require("child_process");
const fs = require("fs");

const url =
  "https://www.elahmad.com/tv/live/shahid_shaka.php?id=mbc_max";

const cmd = `
yt-dlp -g
--geo-bypass
--add-header "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
--add-header "Referer: https://www.elahmad.com/"
"${url}"
`.replace(/\n/g, " ");

try {
  const m3u8 = execSync(cmd, { stdio: "pipe" }).toString().trim();

  if (!m3u8) throw new Error("Empty m3u8");

  if (!fs.existsSync("data")) fs.mkdirSync("data");

  fs.writeFileSync(
    "data/mbc_variety.json",
    JSON.stringify({ m3u8 }, null, 2)
  );

  console.log("FOUND M3U8:", m3u8);
} catch (e) {
  console.error("Failed to fetch m3u8:");
  console.error(e.message);
  process.exit(1);
}
