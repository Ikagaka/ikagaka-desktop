import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

let mainWindow: BrowserWindow | undefined;

app.on("ready", () => {
    mainWindow = new BrowserWindow();
    mainWindow.setTitle("イカガカ");
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
    }));
    mainWindow.on("closed", () => {
        mainWindow = undefined;
    });
});

app.on("window-all-closed", () => {
    app.quit();
});
