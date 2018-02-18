const fetch = require("node-fetch");
const NarLoader = require("narloader");
const { NanikaStorage } = require("nanika-storage");

const ns = new NanikaStorage(__dirname, "..", "baseware");

/**
 * @param {string} url
 * @param {boolean} overwrite
 */
async function installNar(url, overwrite = false) {
    try{
        const res = await fetch(url);
        const buf = await res.buffer();
        const nar = await NarLoader.loadFromBuffer(buf);
        const installInfo = nar.installInfoSync();
        const ghostExists = installInfo.type === "ghost" && ns.ghost(installInfo.directory).existsSync();
        const balloonExists = installInfo.type === "balloon" && ns.balloon(installInfo.directory).existsSync();
        if (ghostExists || balloonExists) {
            if (overwrite) {
                await ns.uninstall(installInfo.type, installInfo.directory);
            } else {
                return;
            }
        }
        await ns.install(nar);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

installNar(process.argv[2], process.argv[3] === "--overwrite");
