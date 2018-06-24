import { Balloon, NamedManager, Shell } from "cuttlebone";
import { GhostKernel, GhostKernelController, KernelPhase, routings } from "ghost-kernel";
import { EventRoutes } from "lazy-event-router";
import { NanikaStorage } from "nanika-storage";
import { Shiorif } from "shiorif";
import { TimerEventSource } from "ukagaka-timer-event-source";
import { genShiori } from "./shiori";

class HaltController extends GhostKernelController {
    async halted() {
        // とりあえずプロセス終了することで多少はそれっぽく
        process.exit();
    }
}

routings.push((routes) => {
    routes.from(KernelPhase, (r2) => {
        // @ts-ignore
        r2.controller(HaltController, (from, controller) => {
            from.on("halted", controller.halted);
        });
    });
}); // なんちゃってDIの力を発揮

export async function bootstrap(root: string, container: HTMLElement) {
    /** ベースウェアルートディレクトリ */
    const nanikaStorage = new NanikaStorage(root);

    /** シェルディレクトリ */
    const nanikaShellDirectory = nanikaStorage.shell("ikaga", "master");
    const cachedShellDirectory = await nanikaShellDirectory.toCached(); // 全ファイル読み込む
    /** {"surface0.png": データのArrayBuffer, "surface1.png": ...} 的なハッシュ */
    const shellFiles: {[path: string]: ArrayBuffer} = {};
    for (const file of cachedShellDirectory.childrenAllSync()) {
        if (file.isFileSync()) {
            const relativePath = cachedShellDirectory.relative(file.path).path;
            shellFiles[relativePath] = file.readFileSync().buffer;
        }
    }
    /** シェルオブジェクト */
    const shell = new Shell(shellFiles);
    await shell.load(); // ファイルデータをロードして透過かけたりする

    /** バルーンディレクトリ */
    const nanikaBalloonDirectory = nanikaStorage.balloon("origin");
    const cachedBalloonDirectory = await nanikaBalloonDirectory.toCached();
    const balloonFiles: {[path: string]: ArrayBuffer} = {};
    for (const file of cachedBalloonDirectory.childrenAllSync()) {
        if (file.isFileSync()) {
            const relativePath = cachedBalloonDirectory.relative(file.path).path;
            balloonFiles[relativePath] = file.readFileSync().buffer;
        }
    }
    /** バルーンオブジェクト */
    const balloon = new Balloon(balloonFiles);
    await balloon.load();

    /** シェル */
    const namedManager = new NamedManager();
    container.appendChild(namedManager.element); // DOMにアタッチ

    // シェルとバルーンを指定してnamed（ゴースト）を立ち上げる
    /** named（ゴースト） */
    const named = namedManager.materialize2(shell, balloon);
    // スコープ0, 1とも非表示にシテオク
    named.scope(0).surface(-1);
    named.scope(0).blimp(-1);
    named.scope(1).surface(-1);
    named.scope(1).blimp(-1);

    /** ゴーストディレクトリ */
    const nanikaGhostDirectory = nanikaStorage.ghost("ikaga");
    /** SHIORI */
    const shiori = genShiori(
        nanikaStorage.join("shiolink_adapter.exe").path,
        nanikaStorage.ghostMaster("ikaga").join("shiori.dll").path,
    );
    /** SHIORIインターフェース */
    const shiorif = new Shiorif(shiori, {synchronized: true});
    const req = shiorif.request;
    shiorif.request = function(this: Shiorif, request: any, convert?: any) {
        console.info(request.toString());
        const res = req.call(this, request, convert);
        res.then((res2: any) => console.info(res2.response.toString()));
        return res;
    };
    const dirpath = nanikaStorage.ghostMaster("ikaga").realpathSync() + "\\";
    const loadRes = await shiorif.load(dirpath);
    console.info(dirpath, loadRes);
    /** 時間イベントソース */
    const timerEventSource = new TimerEventSource();

    /** ゴーストを動作させるベースウェアカーネル（カーネルとは……？） */
    const ghostKernel = new GhostKernel(
        [shiorif, nanikaStorage, nanikaGhostDirectory, timerEventSource, namedManager, named],
        new EventRoutes(routings),
    );
    // OnBootで開始
    ghostKernel.startBy.boot();

    (window as {} as {ghostKernel: {}}).ghostKernel = ghostKernel; // デバッグコンソールから触る用

    return ghostKernel;
}
