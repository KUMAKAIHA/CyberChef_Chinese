/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Strip HTML tags operation
 */
class StripHTMLTags extends Operation {

    /**
     * StripHTMLTags constructor
     */
    constructor() {
        super();

        this.name = "去除 HTML 标签";
        this.module = "Default";
        this.description = "从输入中移除所有 HTML 标签。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "移除缩进",
                "type": "boolean",
                "value": true
            },
            {
                "name": "移除多余换行符",
                "type": "boolean",
                "value": true
            }
        ];
        this.checks = [
            {
                pattern:  "(</html>|</div>|</body>)",
                flags:  "i",
                args:   [true, true]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [removeIndentation, removeLineBreaks] = args;

        input = Utils.stripHtmlTags(input);

        if (removeIndentation) {
            input = input.replace(/\n[ \f\t]+/g, "\n");
        }

        if (removeLineBreaks) {
            input = input
                .replace(/^\s*\n/, "") // first line
                .replace(/(\n\s*){2,}/g, "\n"); // all others
        }

        return input;
    }

}

export default StripHTMLTags;
