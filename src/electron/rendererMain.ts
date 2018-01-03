import { Named } from "cuttlebone";
import { remote } from "electron";
import { bootstrap } from "../bootstrap";

const win = remote.BrowserWindow.getFocusedWindow();

document.addEventListener("DOMContentLoaded", async () => {
    const ghostKernel = await bootstrap("./baseware", document.body);

    // マウスイベント背景透過処理
    let inScopeCount = 0;
    const changeScopeCount = (up: boolean) => {
        console.error("ch", inScopeCount, up);
        const prevInScope = inScopeCount !== 0;
        inScopeCount += up ? 1 : -1;
        const curInScope = inScopeCount !== 0;
        if (curInScope !== prevInScope) {
            (win.setIgnoreMouseEvents as any)(!curInScope, {forward: true}); // tslint:disable-line no-any
        }
    };
    const named = ghostKernel.component(Named);
    const scope0Element = (named.scope(0) as {} as {element: HTMLDivElement}).element;
    const scope1Element = (named.scope(1) as {} as {element: HTMLDivElement}).element;
    scope0Element.addEventListener("mouseenter", () => changeScopeCount(true));
    scope0Element.addEventListener("mouseleave", () => changeScopeCount(false));
    scope1Element.addEventListener("mouseenter", () => changeScopeCount(true));
    scope1Element.addEventListener("mouseleave", () => changeScopeCount(false));
    (win.setIgnoreMouseEvents as any)(true, {forward: true}); // tslint:disable-line no-any
});
