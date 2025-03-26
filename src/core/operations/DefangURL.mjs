/**
 * @author arnydo [arnydo@protonmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {URL_REGEX, DOMAIN_REGEX} from "../lib/Extract.mjs";

/**
 * DefangURL operation
 */
class DefangURL extends Operation {

    /**
     * DefangURL constructor
     */
    constructor() {
        super();

        this.name = "URL 去毒化";
        this.module = "Default";
        this.description = "对通用资源定位符 (URL) 进行“去毒化”处理；即使 URL 失效，从而消除意外点击恶意链接的风险。\n\n这通常用于处理恶意链接或 IOC。\n\n与“提取 URL”操作结合使用效果更佳。";
        this.infoURL = "https://isc.sans.edu/forums/diary/Defang+all+the+things/22744/";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "转义点号",
                type: "boolean",
                value: true
            },
            {
                name: "转义 http",
                type: "boolean",
                value: true
            },
            {
                name: "转义 ://",
                type: "boolean",
                value: true
            },
            {
                name: "处理",
                type: "option",
                value: ["有效域名和完整 URL", "仅完整 URL", "全部"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [dots, http, slashes, process] = args;

        switch (process) {
            case "有效域名和完整 URL":
                input = input.replace(URL_REGEX, x => {
                    return defangURL(x, dots, http, slashes);
                });
                input = input.replace(DOMAIN_REGEX, x => {
                    return defangURL(x, dots, http, slashes);
                });
                break;
            case "仅完整 URL":
                input = input.replace(URL_REGEX, x => {
                    return defangURL(x, dots, http, slashes);
                });
                break;
            case "全部":
                input = defangURL(input, dots, http, slashes);
                break;
        }

        return input;
    }

}


/**
 * Defangs a given URL
 *
 * @param {string} url
 * @param {boolean} dots
 * @param {boolean} http
 * @param {boolean} slashes
 * @returns {string}
 */
function defangURL(url, dots, http, slashes) {
    if (dots) url = url.replace(/\./g, "[.]");
    if (http) url = url.replace(/http/gi, "hxxp");
    if (slashes) url = url.replace(/:\/\//g, "[://]");

    return url;
}

export default DefangURL;
