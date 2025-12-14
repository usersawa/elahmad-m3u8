const { exec } = require("child_process");

const url =
  "https://www.elahmad.com/tv/live/shahid_shaka.php?id=mbc_max";

exec(`yt-dlp -g "${url}"`, (error, stdout, stderr) => {
  if (error) {
    console.error("ERROR:", error.message);
    return;
  }

  if (stderr) {
    console.error("STDERR:", stderr);
  }

  const m3u8 = stdout.trim();

  if (!m3u8) {
    console.log("No m3u8 found");
    return;
  }

  console.log("FOUND M3U8:");
  console.log(m3u8);
});
