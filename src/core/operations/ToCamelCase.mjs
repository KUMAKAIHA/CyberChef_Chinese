/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import camelCase from "lodash/camelCase.js";
import Operation from "../Operation.mjs";
import { replaceVariableNames } from "../lib/Code.mjs";

/**
 * To Camel case operation
 */
class ToCamelCase extends Operation {

    /**
     * ToCamelCase constructor
     */
    constructor() {
        super();

        this.name = "转换为 驼峰命名";
        this.module = "Code";
        this.description = "将输入字符串转换为驼峰命名。\n<br><br>\n驼峰命名法是指除了单词边界后的字母大写外，其余字母均为小写。\n<br><br>\n例如：thisIsCamelCase\n<br><br>\n“尝试识别上下文” 将使操作尝试更好地转换变量名和函数名。";
        this.infoURL = "https://wikipedia.org/wiki/Camel_case";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "尝试识别上下文",
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
        const smart = args[0];

        if (smart) {
            return replaceVariableNames(input, camelCase);
        } else {
            return camelCase(input);
        }
    }

}

export default ToCamelCase;
