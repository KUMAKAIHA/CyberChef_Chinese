/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import * as esprima from "esprima";

/**
 * JavaScript Parser operation
 */
class JavaScriptParser extends Operation {

    /**
     * JavaScriptParser constructor
     */
    constructor() {
        super();

        this.name = "JavaScript 解析器";
        this.module = "Code";
        this.description = "返回有效 JavaScript 代码的抽象语法树。";
        this.infoURL = "https://wikipedia.org/wiki/Abstract_syntax_tree";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "位置信息",
                "type": "boolean",
                "value": false
            },
            {
                "name": "范围信息",
                "type": "boolean",
                "value": false
            },
            {
                "name": "包含 tokens 数组",
                "type": "boolean",
                "value": false
            },
            {
                "name": "包含 comments 数组",
                "type": "boolean",
                "value": false
            },
            {
                "name": "报告错误并尝试继续",
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
        const [parseLoc, parseRange, parseTokens, parseComment, parseTolerant] = args,
            options = {
                loc:      parseLoc,
                range:    parseRange,
                tokens:   parseTokens,
                comment:  parseComment,
                tolerant: parseTolerant
            };
        let result = {};

        result = esprima.parseScript(input, options);
        return JSON.stringify(result, null, 2);
    }

}

export default JavaScriptParser;
