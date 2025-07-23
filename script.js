import { createFFmpeg, fetchFile } from 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.9/dist/ffmpeg.min.js';

window.downloadWasm = function () {
  const wasmUrl = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/ffmpeg-core.wasm";
  const a = document.createElement('a');
  a.href = wasmUrl;
  a.download = 'ffmpeg-core.wasm';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

window.generateVideo = async function () {
  try {
    alert("⏳ Memuat FFmpeg...");
    const ffmpeg = createFFmpeg({
      corePath: './ffmpeg-core/ffmpeg-core.js',
      log: true
    });

    if (!ffmpeg.isLoaded()) await ffmpeg.load();
    alert("✅ FFmpeg siap!");

    console.log("📸 Capture poster...");
    const canvas = await html2canvas(document.getElementById("pages"), { scale: 2 });
    const dataUrl = canvas.toDataURL("image/png");
    const imageBlob = await (await fetch(dataUrl)).blob();
    const imageData = new Uint8Array(await imageBlob.arrayBuffer());
    ffmpeg.FS('writeFile', 'poster.png', imageData);

    const qari = document.getElementById('mp4Qari').value;
    const s = document.getElementById('surah').value;
    const a = document.getElementById('ayah').value;
    const audioUrl = `https://everyayah.com/data/${qari}/${s}${a}.mp3`;

    alert("🎧 Mengambil audio...");
    const audioResp = await fetch(audioUrl);
    const audioData = new Uint8Array(await audioResp.arrayBuffer());
    ffmpeg.FS('writeFile', 'audio.mp3', audioData);

    alert("🎬 Menggabungkan gambar + audio...");
    await ffmpeg.run(
      '-loop', '1',
      '-i', 'poster.png',
      '-i', 'audio.mp3',
      '-c:v', 'libvpx',
      '-c:a', 'libvorbis',
      '-shortest',
      'output.webm'
    );

    const output = ffmpeg.FS('readFile', 'output.webm');
    const videoBlob = new Blob([output.buffer], { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(videoBlob);

    const aEl = document.createElement('a');
    aEl.href = videoUrl;
    aEl.download = `murottal-${s}-${a}.webm`;
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);

    alert("✅ Video berhasil diunduh!");
  } catch (err) {
    console.error("❌ Gagal:", err);
    alert("❌ Terjadi kesalahan: " + err.message);
  }
};
