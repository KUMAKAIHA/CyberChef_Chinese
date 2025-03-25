/**
 * @author linuxgemini [ilteris@asenkron.com.tr]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { FROM_MODHEX_DELIM_OPTIONS, fromModhex } from "../lib/Modhex.mjs";

/**
 * From Modhex operation
 */
class FromModhex extends Operation {

    /**
     * FromModhex constructor
     */
    constructor() {
        super();

        this.name = "从 Modhex 转换";
        this.module = "Default";
        this.description = "将 Modhex 字节字符串转换回其原始值。";
        this.infoURL = "https://en.wikipedia.org/wiki/YubiKey#ModHex";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "分隔符",
                type: "option",
                value: FROM_MODHEX_DELIM_OPTIONS
            }
        ];
        this.checks = [
            {
                pattern: "^(?:[cbdefghijklnrtuv]{2})+$",
                flags: "i",
                args: ["无"]
            },
            {
                pattern: "^[cbdefghijklnrtuv]{2}(?: [cbdefghijklnrtuv]{2})*$",
                flags: "i",
                args: ["空格"]
            },
            {
                pattern: "^[cbdefghijklnrtuv]{2}(?:,[cbdefghijklnrtuv]{2})*$",
                flags: "i",
                args: ["逗号"]
            },
            {
                pattern: "^[cbdefghijklnrtuv]{2}(?:;[cbdefghijklnrtuv]{2})*$",
                flags: "i",
                args: ["分号"]
            },
            {
                pattern: "^[cbdefghijklnrtuv]{2}(?::[cbdefghijklnrtuv]{2})*$",
                flags: "i",
                args: ["冒号"]
            },
            {
                pattern: "^[cbdefghijklnrtuv]{2}(?:\\n[cbdefghijklnrtuv]{2})*$",
                flags: "i",
                args: ["换行符"]
            },
            {
                pattern: "^[cbdefghijklnrtuv]{2}(?:\\r\\n[cbdefghijklnrtuv]{2})*$",
                flags: "i",
                args: ["CRLF"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const delim = args[0] || "Auto";
        return fromModhex(input, delim, 2);
    }
}

export default FromModhex;
