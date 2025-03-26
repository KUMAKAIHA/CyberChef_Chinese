/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Unescape string operation
 */
class UnescapeString extends Operation {

    /**
     * UnescapeString constructor
     */
    constructor() {
        super();

        this.name = "取消转义字符串";
        this.module = "Default";
        this.description = "取消转义字符串中已被转义的字符。例如，<code>Don\\'t stop me now</code> 变为 <code>Don't stop me now</code>。<br><br>支持以下转义序列：<ul><li><code>\\n</code> (换行符/newline)</li><li><code>\\r</code> (回车符)</li><li><code>\\t</code> (水平制表符)</li><li><code>\\b</code> (退格符)</li><li><code>\\f</code> (换页符)</li><li><code>\\nnn</code> (八进制，其中 n 为 0-7)</li><li><code>\\xnn</code> (十六进制，其中 n 为 0-f)</li><li><code>\\\\</code> (反斜杠)</li><li><code>\\'</code> (单引号)</li><li><code>\\&quot;</code> (双引号)</li><li><code>\\unnnn</code> (Unicode 字符)</li><li><code>\\u{nnnnnn}</code> (Unicode 代码点)</li></ul>";
        this.infoURL = "https://wikipedia.org/wiki/Escape_sequence";
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
        return Utils.parseEscapedChars(input);
    }

}

export default UnescapeString;
