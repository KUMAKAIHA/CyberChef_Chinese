/**
 * @author arnydo [github@arnydo.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * FangURL operation
 */
class FangURL extends Operation {

    /**
     * FangURL constructor
     */
    constructor() {
        super();

        this.name = "URL 恢复毒化";
        this.module = "Default";
        this.description = "将“去毒化”的通用资源定位符 (URL) 还原。 也就是说，它会移除使其失效的修改（去毒化），以便可以再次使用。";
        this.infoURL = "https://isc.sans.edu/forums/diary/Defang+all+the_things/22744/";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "还原 [.]",
                type: "boolean",
                value: true
            },
            {
                name: "还原 hxxp",
                type: "boolean",
                value: true
            },
            {
                name: "还原 ://",
                type: "boolean",
                value: true
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [dots, http, slashes] = args;

        input = fangURL(input, dots, http, slashes);

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
function fangURL(url, dots, http, slashes) {
    if (dots) url = url.replace(/\[\.\]/g, ".");
    if (http) url = url.replace(/hxxp/g, "http");
    if (slashes) url = url.replace(/\[:\/\/\]/g, "://");

    return url;
}

export default FangURL;
