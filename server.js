const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { spawn } = require("child_process");
const ffmpegPath = require("ffmpeg-static");

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

app.post("/convert", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `uploads/${req.file.filename}.mp4`;

  const ffmpeg = spawn(ffmpegPath, [
    "-i", inputPath,
    "-c:v", "libx264",
    "-preset", "fast",
    "-c:a", "aac",
    "-b:a", "128k",
    outputPath
  ]);

  ffmpeg.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  ffmpeg.on("close", (code) => {
    if (code !== 0) return res.status(500).send("Conversion failed.");
    res.download(outputPath, "converted.mp4", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
