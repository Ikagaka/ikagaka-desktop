// tslint:disable no-any
import { bootstrap } from "../bootstrap";
import { dev } from "./dev";

export = function main(window: Window, nw: any) {
    global.console = window.console;
    const document = window.document;

    const win = nw.Window.get();
    win.maximize();

    if (process.env.DEV) dev(window, nw);

    window.addEventListener("DOMContentLoaded", async () => {
        try {
            const ghostKernel = await bootstrap("../../../baseware", document.body);
            console.log(ghostKernel);
        } catch (error) {
            console.error(error);
            win.showDevTools();
        }
    });
};
