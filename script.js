import { createFFmpeg, fetchFile } from 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.9/dist/ffmpeg.min.js';

window.generateVideo = async function () {
  const ffmpeg = createFFmpeg({
    corePath: './ffmpeg-core/ffmpeg-core.js',
    log: true
  });

  alert("⏳ Memuat FFmpeg...");
  if (!ffmpeg.isLoaded()) await ffmpeg.load();
  alert("✅ FFmpeg siap!");

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
};
