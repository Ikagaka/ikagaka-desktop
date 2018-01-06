// tslint:disable no-any no-console
import { bootstrap } from "./bootstrap";
import { dev } from "./dev";

declare var nw: any;

export = function main() {
    const win = nw.Window.get();
    if (nw.App.manifest.window.transparent) win.maximize();

    if (process.env.DEV) dev(window, nw);

    window.addEventListener("DOMContentLoaded", async () => {
        try {
            const ghostKernel = await bootstrap("../../baseware", document.body);
            console.log(ghostKernel);
        } catch (error) {
            console.error(error);
            win.showDevTools();
        }
    });
};
