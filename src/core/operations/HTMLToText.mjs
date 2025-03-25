/**
 * @author tlwr [toby@toby.codes]
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * HTML To Text operation
 */
class HTMLToText extends Operation {

    /**
     * HTMLToText constructor
     */
    constructor() {
        super();

        this.name = "HTML 转换为文本";
        this.module = "Default";
        this.description = "将操作产生的 HTML 输出转换为可读文本，避免在 DOM 中渲染。";
        this.infoURL = "";
        this.inputType = "html";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {html} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return input;
    }

}

export default HTMLToText;
