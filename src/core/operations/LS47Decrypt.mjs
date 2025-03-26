/**
 * @author n1073645 [n1073645@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import * as LS47 from "../lib/LS47.mjs";

/**
 * LS47 Decrypt operation
 */
class LS47Decrypt extends Operation {

    /**
     * LS47Decrypt constructor
     */
    constructor() {
        super();

        this.name = "LS47 解密";
        this.module = "Crypto";
        this.description = "这是对 Alan Kaminsky 描述的 ElsieFour 密码的一种轻微改进。我们使用 7x7 字符而不是原始的（勉强容纳的）6x6 字符，以便能够加密一些结构化信息。我们还描述了一个简单的密钥扩展算法，因为记住密码很常见。与 ElsieFour 类似的安全性考虑仍然适用。<br>LS47 字母表由以下字符组成：<code>_abcdefghijklmnopqrstuvwxyz.0123456789,-+*/:?!'()</code><br>LS47 密钥是字母表的一种排列，然后以 7x7 网格的形式表示，用于加密或解密。";
        this.infoURL = "https://github.com/exaexa/ls47";

        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "密码",
                type: "string",
                value: ""
            },
            {
                name: "填充",
                type: "number",
                value: 10
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        this.paddingSize = parseInt(args[1], 10);

        LS47.initTiles();

        const key = LS47.deriveKey(args[0]);
        return LS47.decryptPad(key, input, this.paddingSize);
    }

}

export default LS47Decrypt;
