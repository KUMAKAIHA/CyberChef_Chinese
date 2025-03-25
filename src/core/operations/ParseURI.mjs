/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import url from "url";

/**
 * Parse URI operation
 */
class ParseURI extends Operation {

    /**
     * ParseURI constructor
     */
    constructor() {
        super();

        this.name = "解析 URI";
        this.module = "URL";
        this.description = "美化打印复杂的统一资源标识符 (URI) 字符串，使其易于阅读。对于包含大量参数的统一资源定位符 (URL) 尤其有用。";
        this.infoURL = "https://wikipedia.org/wiki/Uniform_Resource_Identifier";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const uri = url.parse(input, true);

        let output = "";

        if (uri.protocol) output += "协议:\t" + uri.protocol + "\n";
        if (uri.auth) output += "认证信息:\t\t" + uri.auth + "\n";
        if (uri.hostname) output += "主机名:\t" + uri.hostname + "\n";
        if (uri.port) output += "端口:\t\t" + uri.port + "\n";
        if (uri.pathname) output += "路径名:\t" + uri.pathname + "\n";
        if (uri.query) {
            const keys = Object.keys(uri.query);
            let padding = 0;

            keys.forEach(k => {
                padding = (k.length > padding) ? k.length : padding;
            });

            output += "参数:\n";
            for (const key in uri.query) {
                output += "\t" + key.padEnd(padding, " ");
                if (uri.query[key].length) {
                    output += " = " + uri.query[key] + "\n";
                } else {
                    output += "\n";
                }
            }
        }
        if (uri.hash) output += "Hash:\t\t" + uri.hash + "\n";

        return output;
    }

}

export default ParseURI;
