const fs = require("fs");
const JSZip = require("jszip");
const fetch = require("node-fetch").default;
const path = require("path");

const exePath = path.join(__dirname, "..", "baseware", "shiolink_adapter.exe");
if (fs.existsSync(exePath)) {
    console.warn("shiolink_adapter.exe already exists");
    process.exit();
}

fetch("https://github.com/Ikagaka/shiolink_adapter/releases/download/1.0.0.1/shiolink_adapter.zip").then((response) => {
    if (!response.ok) throw new Error("cannot download");
    return response.buffer();
})
.then(JSZip.loadAsync)
.then((zip) => zip.file("shiolink_adapter.exe").async("nodebuffer"))
.then((file) => {
    fs.writeFileSync(exePath, file);
    console.warn("shiolink_adapter.exe downloaded");
});
