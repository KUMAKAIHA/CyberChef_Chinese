/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";
import {fromDecimal} from "../lib/Decimal.mjs";

/**
 * From Decimal operation
 */
class FromDecimal extends Operation {

    /**
     * FromDecimal constructor
     */
    constructor() {
        super();

        this.name = "从 十进制 转换";
        this.module = "Default";
        this.description = "将数据从有序整数数组转换回其原始形式。<br><br>例如，<code>72 101 108 108 111</code> 变为 <code>Hello</code>";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "分隔符",
                "type": "option",
                "value": DELIM_OPTIONS
            },
            {
                "name": "支持有符号值",
                "type": "boolean",
                "value": false
            }
        ];
        this.checks = [
            {
                pattern: "^(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5])(?: (?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5]))*$",
                flags: "",
                args: ["空格", false]
            },
            {
                pattern: "^(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5])(?:,(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5]))*$",
                flags: "",
                args: ["逗号", false]
            },
            {
                pattern: "^(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5])(?:;(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5]))*$",
                flags: "",
                args: ["分号", false]
            },
            {
                pattern: "^(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5])(?::(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5]))*$",
                flags: "",
                args: ["冒号", false]
            },
            {
                pattern: "^(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5])(?:\\n(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5]))*$",
                flags: "",
                args: ["换行符", false]
            },
            {
                pattern: "^(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5])(?:\\r\\n(?:\\d{1,2}|1\\d{2}|2[0-4]\\d|25[0-5]))*$",
                flags: "",
                args: ["CRLF", false]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        let data = fromDecimal(input, args[0]);
        if (args[1]) { // Convert negatives
            data = data.map(v => v < 0 ? 0xFF + v + 1 : v);
        }
        return data;
    }

}

export default FromDecimal;
