
// tslint:disable no-console no-magic-numbers

// tslint:disable no-implicit-dependencies
import { spawn } from "child_process";
import { ShiolinkClient } from "shiolink-client";
import { ShioriEncodeLayer } from "shiori-encode-layer";

export function genShiori(adapterPath: string, shioriPath: string) {
    const ps = spawn(adapterPath, [shioriPath]);
    ps.stdout.resume();

    return new ShioriEncodeLayer(new ShiolinkClient(ps.stdout, ps.stdin));
}
