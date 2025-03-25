/**
 * @author Vel0x [dalemy@microsoft.com]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import jsesc from "jsesc";

/**
 * Escape string operation
 */
class EscapeString extends Operation {

    /**
     * EscapeString constructor
     */
    constructor() {
        super();

        this.name = "转义字符串";
        this.module = "工具";
        this.description = "转义字符串中的特殊字符，使其不会引起冲突。例如，<code>Don't stop me now</code> 变为 <code>Don\\'t stop me now</code>。<br><br>支持以下转义序列：<ul><li><code>\\n</code> (换行符)</li><li><code>\\r</code> (回车符)</li><li><code>\\t</code> (水平制表符)</li><li><code>\\b</code> (退格符)</li><li><code>\\f</code> (换页符)</li><li><code>\\xnn</code> (十六进制，其中 n 为 0-f)</li><li><code>\\\\</code> (反斜杠)</li><li><code>\\'</code> (单引号)</li><li><code>\\&quot;</code> (双引号)</li><li><code>\\unnnn</code> (Unicode 字符)</li><li><code>\\u{nnnnnn}</code> (Unicode 代码点)</li></ul>";
        this.infoURL = "https://wikipedia.org/wiki/Escape_sequence";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "转义级别",
                "type": "option",
                "value": ["特殊字符", "全部", "最小化"]
            },
            {
                "name": "转义引号",
                "type": "option",
                "value": ["单引号", "双引号", "反引号"]
            },
            {
                "name": "JSON 兼容",
                "type": "boolean",
                "value": false
            },
            {
                "name": "ES6 兼容",
                "type": "boolean",
                "value": true
            },
            {
                "name": "十六进制大写",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @example
     * EscapeString.run("Don't do that", [])
     * > "Don\'t do that"
     * EscapeString.run(`Hello
     * World`, [])
     * > "Hello\nWorld"
     */
    run(input, args) {
        const level = args[0],
            quotes = args[1],
            jsonCompat = args[2],
            es6Compat = args[3],
            lowercaseHex = !args[4];

        return jsesc(input, {
            quotes: quotes.toLowerCase(),
            es6: es6Compat,
            escapeEverything: level === "全部",
            minimal: level === "最小化",
            json: jsonCompat,
            lowercaseHex: lowercaseHex,
        });
    }

}

export default EscapeString;
