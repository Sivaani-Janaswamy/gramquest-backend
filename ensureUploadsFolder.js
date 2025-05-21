// ensureUploadsFolder.js
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "uploads");
const gitkeepPath = path.join(uploadsDir, ".gitkeep");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created /uploads/ directory");
}

if (!fs.existsSync(gitkeepPath)) {
  fs.writeFileSync(gitkeepPath, "");
  console.log("✅ Added .gitkeep to /uploads/");
}
