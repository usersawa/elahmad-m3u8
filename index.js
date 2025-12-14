import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.get('*', async (req, res) => {
    const targetUrl = 'https://games2.elahmad.xyz/tv770_www.elahmad.com_alikhbaria_syria/tracks-v1a1/mono.m3u8?token=31a77ee40e121b03401d6ab160baba33df1bc0bb-b13126b4eba97997817b4ea0d3ccb564-1765733977-1765723177';
    const response = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Android TV; Android 13)' }
    });
    const body = await response.arrayBuffer();
    res.set('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(body));
});

app.listen(process.env.PORT || 10000, () => console.log('Proxy running'));
