import { Balloon, NamedManager, Shell } from "cuttlebone";
import { GhostKernel } from "ghost-kernel";
import { NanikaStorage } from "nanika-storage";
import { Shiorif } from "shiorif";
import { TimerEventSource } from "ukagaka-timer-event-source";

document.addEventListener("DOMContentLoaded", async () => {
    const nanikaStorage = new NanikaStorage("./baseware");

    const shiori = {
        async load() { return 1; },
        async unload() { return 1; },
        async request(req: string) {
            // console.info(req);
            let msg: string;
            if (/GET Version|OnTranslate/.test(req)) {
                msg = "SHIORI/3.0 400 Bad Request\r\n\r\n";
            } else {
                const reqstr = req.replace(/\\/g, "\\\\").replace(/\r/g, "\\r").replace(/\n/g, "\\\\n\\n");
                msg = `SHIORI/3.0 200 OK\r\nValue: \\h\\s[0]\\_q${reqstr}\\_q\\u\\s[10]UNY\\e\r\n\r\n`;
            }
            // console.warn(msg);

            return msg;
        },
    };

    const shiorif = new Shiorif(shiori);

    const nanikaGhostDirectory = nanikaStorage.ghost("ikaga");

    const timerEventSource = new TimerEventSource();

    const namedManager = new NamedManager();
    document.body.appendChild(namedManager.element);

    const nanikaShellDirectory = nanikaStorage.shell("ikaga", "master");
    const cachedShellDirectory = await nanikaShellDirectory.toCached();
    const shellFiles: {[path: string]: ArrayBuffer} = {};
    for (const file of cachedShellDirectory.childrenAllSync()) {
        if (file.isFileSync()) {
            const relativePath = cachedShellDirectory.relative(file.path).path;
            shellFiles[relativePath] = file.readFileSync().buffer;
        }
    }
    const shell = new Shell(shellFiles);
    await shell.load();

    const nanikaBalloonDirectory = nanikaStorage.balloon("origin");
    const cachedBalloonDirectory = await nanikaBalloonDirectory.toCached();
    const balloonFiles: {[path: string]: ArrayBuffer} = {};
    for (const file of cachedBalloonDirectory.childrenAllSync()) {
        if (file.isFileSync()) {
            const relativePath = cachedBalloonDirectory.relative(file.path).path;
            balloonFiles[relativePath] = file.readFileSync().buffer;
        }
    }
    const balloon = new Balloon(balloonFiles);
    await balloon.load();

    const named = namedManager.materialize2(shell, balloon);
    named.scope(0).surface(-1);
    named.scope(0).blimp(-1);
    named.scope(1).surface(-1);
    named.scope(1).blimp(-1);

    const gk = new GhostKernel([shiorif, nanikaStorage, nanikaGhostDirectory, timerEventSource, namedManager, named]);
    gk.startBy.boot();

    (window as {} as {gk: {}}).gk = gk;
});
