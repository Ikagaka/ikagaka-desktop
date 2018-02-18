
// tslint:disable no-console no-magic-numbers

// tslint:disable-next-line no-implicit-dependencies
import * as ShioriJK from "shiorijk";

const reqParser = new ShioriJK.Shiori.Request.Parser();

const defaultResponse = () => new ShioriJK.Message.Response({
    headers: {Sender: "dummy-shiori", Charset: "UTF-8"},
    status_line: {protocol: "SHIORI", version: "3.0", code: 200},
});

export const shiori = {
    async load() { return 1; },
    async unload() { return 1; },
    async request(requestStr: string) {
        const request = reqParser.parse(requestStr);
        if (["OnTranslate", "OnSecondChange"].indexOf(request.headers.ID || "") === -1) console.info(requestStr);
        const response = defaultResponse();
        if (request.request_line.version !== "3.0") {
            response.status_line.code = 400;
        } else {
            switch (request.headers.ID) {
                case "OnBoot": response.headers.header.Value = "\\h\\s[0]わたしです。\\u\\s[10]うにゅー。\\e"; break;
                case "OnMouseDoubleClick":
                    // tslint:disable-next-line prefer-conditional-expression
                    if (request.headers.Reference(3) === "0") {
                        response.headers.header.Value = "\\h\\s[0]つつきー\\e";
                    } else {
                        response.headers.header.Value = "\\u\\s[10]あいててー\\e";
                    }
                    break;
                default: response.status_line.code = 204;
            }
        }
        if (response.status_line.code === 200) console.warn(response.toString());

        return response.toString();
    },
};
