// tslint:disable no-any no-implicit-dependencies no-console

// from https://github.com/1j01/nw-dev

import * as chokidar from "chokidar";

export function dev(window: Window, nw: any) {
    const win = nw.Window.get();

    // error handle
    (window as any).CRASHED = false;
    process.removeAllListeners("uncaughtException");
    process.on("uncaughtException" as any, function() {
        if (!(window as any).CRASHED) {
            (window as any).CRASHED = true;
            console.warn("CRASH");
            win.showDevTools();
        }
        if (!(nw.App.manifest.window && nw.App.manifest.window.show)) {
            return win.show();
        }
    });
    window.onerror = () => {
        if (!(window as any).CRASHED) {
            (window as any).CRASHED = true;
            console.warn("CRASH");
            win.showDevTools();
        }

        return false;
    };

    // reload
    window.addEventListener("keydown", function(event) {
        switch (event.key) {
            case "F5": window.location.reload(); break;
            default: return;
        }
    });

    // live reload
    const watcher = chokidar.watch([".", ".."]);
    watcher.on("change", () => {
        watcher.close();

        // clear require cache
        for (const key of Object.keys(require.cache)) {
            // tslint:disable-next-line no-dynamic-delete
            delete require.cache[key];
        }

        win.removeAllListeners();
        win.closeDevTools();
        window.location.reload();
    });
}
