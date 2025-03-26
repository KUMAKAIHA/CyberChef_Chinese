/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import escodegen from "escodegen";
import * as esprima from "esprima";

/**
 * JavaScript Beautify operation
 */
class JavaScriptBeautify extends Operation {

    /**
     * JavaScriptBeautify constructor
     */
    constructor() {
        super();

        this.name = "JavaScript 美化";
        this.module = "Code";
        this.description = "解析并美化合法的 JavaScript 代码。也支持 JavaScript 对象表示法 (JSON)。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "缩进字符串",
                "type": "binaryShortString",
                "value": "\\t"
            },
            {
                "name": "引号",
                "type": "option",
                "value": ["自动", "单引号", "双引号"]
            },
            {
                "name": "在右花括号前添加分号",
                "type": "boolean",
                "value": true
            },
            {
                "name": "包含注释",
                "type": "boolean",
                "value": true
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const beautifyIndent = args[0] || "\\t",
            quotes = args[1].toLowerCase(),
            [,, beautifySemicolons, beautifyComment] = args;
        let result = "",
            AST;

        try {
            AST = esprima.parseScript(input, {
                range: true,
                tokens: true,
                comment: true
            });

            const options = {
                format: {
                    indent: {
                        style: beautifyIndent
                    },
                    quotes: quotes,
                    semicolons: beautifySemicolons,
                },
                comment: beautifyComment
            };

            if (options.comment)
                AST = escodegen.attachComments(AST, AST.comments, AST.tokens);

            result = escodegen.generate(AST, options);
        } catch (e) {
            // Leave original error so the user can see the detail
            throw new OperationError("无法解析 JavaScript。<br>" + e.message);
        }
        return result;
    }

}

export default JavaScriptBeautify;
