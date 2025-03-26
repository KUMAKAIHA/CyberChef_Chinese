/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import kebabCase from "lodash/kebabCase.js";
import Operation from "../Operation.mjs";
import { replaceVariableNames } from "../lib/Code.mjs";

/**
 * To Kebab case operation
 */
class ToKebabCase extends Operation {

    /**
     * ToKebabCase constructor
     */
    constructor() {
        super();

        this.name = "转换为 短横线命名";
        this.module = "Code";
        this.description = "将输入字符串转换为短横线命名。\n<br><br>\n短横线命名是全小写，单词之间用短横线分隔。\n<br><br>\n例如：this-is-kebab-case\n<br><br>\n“尝试上下文感知” 将使操作尝试更好地转换变量名和函数名。";
        this.infoURL = "https://wikipedia.org/wiki/Kebab_case";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "尝试上下文感知",
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
            return replaceVariableNames(input, kebabCase);
        } else {
            return kebabCase(input);
        }
    }

}

export default ToKebabCase;
