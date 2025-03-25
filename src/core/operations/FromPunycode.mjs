/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import punycode from "punycode";

/**
 * From Punycode operation
 */
class FromPunycode extends Operation {

    /**
     * FromPunycode constructor
     */
    constructor() {
        super();

        this.name = "从 Punycode 转换";
        this.module = "Encodings";
        this.description = "Punycode 是一种使用域名系统支持的有限 ASCII 字符子集来表示 Unicode 的方法。<br><br>例如：<code>mnchen-3ya</code> 解码为 <code>m\xfcnchen</code>";
        this.infoURL = "https://wikipedia.org/wiki/Punycode";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "国际化域名",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const idn = args[0];

        if (idn) {
            return punycode.toUnicode(input);
        } else {
            return punycode.decode(input);
        }
    }

}

export default FromPunycode;
