/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import vkbeautify from "vkbeautify";
import Operation from "../Operation.mjs";

/**
 * XML Minify operation
 */
class XMLMinify extends Operation {

    /**
     * XMLMinify constructor
     */
    constructor() {
        super();

        this.name = "XML 压缩";
        this.module = "Code";
        this.description = "压缩可扩展标记语言 (XML) 代码。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "保留注释",
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
        const preserveComments = args[0];
        return vkbeautify.xmlmin(input, preserveComments);
    }

}

export default XMLMinify;
