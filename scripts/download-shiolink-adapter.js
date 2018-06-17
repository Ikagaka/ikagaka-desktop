const fs = require("fs");
const fetch = require("node-fetch").default;
const path = require("path");

const exePath = path.join(__dirname, "..", "baseware", "shiolink_adapter.exe");
if (fs.existsSync(exePath)) {
    console.warn("shiolink_adapter.exe already exists");
    process.exit();
}

fetch("https://github.com/Ikagaka/shiolink_adapter/raw/master/shiolink_adapter.exe").then((response) => {
    if (!response.ok) throw new Error("cannot download");
    return response.buffer();
}).then((file) => {
    fs.writeFileSync(exePath, file);
    console.warn("shiolink_adapter.exe downloaded");
});
