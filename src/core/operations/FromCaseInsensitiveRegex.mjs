/**
 * @author masq [github.cyberchef@masq.cc]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * From Case Insensitive Regex operation
 */
class FromCaseInsensitiveRegex extends Operation {

    /**
     * FromCaseInsensitiveRegex constructor
     */
    constructor() {
        super();

        this.name = "从 大小写不敏感正则转换";
        this.module = "Default";
        this.description = "将大小写不敏感的正则表达式字符串转换为大小写敏感的正则表达式字符串（不保证是原始大小写），以防当时 i 标志不可用，而现在可用，或者您需要再次区分大小写。<br><br>例如：<code>[mM][oO][zZ][iI][lL][lL][aA]/[0-9].[0-9] .*</code> 变为 <code>Mozilla/[0-9].[0-9] .*</code>";
        this.infoURL = "https://wikipedia.org/wiki/Regular_expression";
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
        return input.replace(/\[[a-z]{2}\]/ig, m => m[1].toUpperCase() === m[2].toUpperCase() ? m[1] : m);
    }
}

export default FromCaseInsensitiveRegex;
