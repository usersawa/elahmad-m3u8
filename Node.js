node -e "
const { execSync } = require('child_process');
const fs = require('fs');
const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
try {
  const m3u8 = execSync(\`yt-dlp -g '\${url}'\`).toString().trim();
  if (!fs.existsSync('data')) fs.mkdirSync('data');
  fs.writeFileSync('data/mbc_variety.json', JSON.stringify({ m3u8 }, null, 2));
  console.log('mbc_variety.json updated with m3u8 link:', m3u8);
} catch(e) {
  console.error('Failed to fetch m3u8:', e.message);
  process.exit(1);
}
"
