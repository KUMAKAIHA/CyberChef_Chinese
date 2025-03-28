/**
 * @author masq [github.cyberchef@masq.cc]
 * @author n1073645
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * To Case Insensitive Regex operation
 */
class ToCaseInsensitiveRegex extends Operation {

    /**
     * ToCaseInsensitiveRegex constructor
     */
    constructor() {
        super();

        this.name = "转换为 大小写不敏感正则";
        this.module = "Default";
        this.description = "将区分大小写的正则表达式字符串转换为不区分大小写的正则表达式字符串，以防 i 标志不可用。<br><br>例如：<code>Mozilla/[0-9].[0-9] .*</code> 变为 <code>[mM][oO][zZ][iI][lL][lL][aA]/[0-9].[0-9] .*</code>";
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

        /**
         * Simulates look behind behaviour since javascript doesn't support it.
         *
         * @param {string} input
         * @returns {string}
         */
        function preProcess(input) {
            let result = "";
            for (let i = 0; i < input.length; i++) {
                const temp = input.charAt(i);
                if (temp.match(/[a-zA-Z]/g) && (input.charAt(i-1) !== "-") && (input.charAt(i+1) !== "-"))
                    result += "[" + temp.toLowerCase() + temp.toUpperCase() + "]";
                else
                    result += temp;
            }
            return result;
        }

        try {
            RegExp(input);
        } catch (error) {
            throw new OperationError("无效的正则表达式（请注意此版本的 node 不支持后顾断言）。");
        }

        // Example: [test] -> [[tT][eE][sS][tT]]
        return preProcess(input)

            // Example: [A-Z] -> [A-Za-z]
            .replace(/([A-Z]-[A-Z]|[a-z]-[a-z])/g, m => `${m[0].toUpperCase()}-${m[2].toUpperCase()}${m[0].toLowerCase()}-${m[2].toLowerCase()}`)

            // Example: [H-d] -> [A-DH-dh-z]
            .replace(/[A-Z]-[a-z]/g, m => `A-${m[2].toUpperCase()}${m}${m[0].toLowerCase()}-z`)

            // Example: [!-D] -> [!-Da-d]
            .replace(/\\?[ -@]-[A-Z]/g, m => `${m}a-${m[2].toLowerCase()}`)

            // Example: [%-^] -> [%-^a-z]
            .replace(/\\?[ -@]-\\?[[-`]/g, m => `${m}a-z`)

            // Example: [K-`] -> [K-`k-z]
            .replace(/[A-Z]-\\?[[-`]/g, m => `${m}${m[0].toLowerCase()}-z`)

            // Example: [[-}] -> [[-}A-Z]
            .replace(/\\?[[-`]-\\?[{-~]/g, m => `${m}A-Z`)

            // Example: [b-}] -> [b-}B-Z]
            .replace(/[a-z]-\\?[{-~]/g, m => `${m}${m[0].toUpperCase()}-Z`)

            // Example: [<-j] -> [<-z]
            .replace(/\\?[ -@]-[a-z]/g, m => `${m[0]}-z`)

            // Example: [^-j] -> [A-J^-j]
            .replace(/\\?[[-`]-[a-z]/g, m => `A-${m[2].toUpperCase()}${m}`);

    }
}

export default ToCaseInsensitiveRegex;
