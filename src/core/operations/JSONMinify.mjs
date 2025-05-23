/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import vkbeautify from "vkbeautify";
import Operation from "../Operation.mjs";

/**
 * JSON Minify operation
 */
class JSONMinify extends Operation {

    /**
     * JSONMinify constructor
     */
    constructor() {
        super();

        this.name = "JSON 压缩";
        this.module = "Code";
        this.description = "压缩 JavaScript 对象表示法 (JSON) 代码。";
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
        if (!input) return "";
        return vkbeautify.jsonmin(input);
    }

}

export default JSONMinify;
