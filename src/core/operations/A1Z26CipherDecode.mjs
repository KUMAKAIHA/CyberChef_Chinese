/**
 * @author Jarmo van Lenthe [github.com/jarmovanlenthe]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * A1Z26 Cipher Decode operation
 */
class A1Z26CipherDecode extends Operation {

    /**
     * A1Z26CipherDecode constructor
     */
    constructor() {
        super();

        this.name = "A1Z26 密码解码";
        this.module = "Ciphers";
        this.description = "将字母顺序数字转换为其对应的字母字符。<br><br>例如，<code>1</code> 变为 <code>a</code>，<code>2</code> 变为 <code>b</code>。";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "分隔符",
                type: "option",
                value: DELIM_OPTIONS
            }
        ];
        this.checks = [
            {
                pattern:  "^\\s*([12]?[0-9] )+[12]?[0-9]\\s*$",
                flags:  "",
                args:   ["空格"]
            },
            {
                pattern:  "^\\s*([12]?[0-9],)+[12]?[0-9]\\s*$",
                flags:  "",
                args:   ["逗号"]
            },
            {
                pattern:  "^\\s*([12]?[0-9];)+[12]?[0-9]\\s*$",
                flags:  "",
                args:   ["分号"]
            },
            {
                pattern:  "^\\s*([12]?[0-9]:)+[12]?[0-9]\\s*$",
                flags:  "",
                args:   ["冒号"]
            },
            {
                pattern:  "^\\s*([12]?[0-9]\\n)+[12]?[0-9]\\s*$",
                flags:  "",
                args:   ["换行符"]
            },
            {
                pattern:  "^\\s*([12]?[0-9]\\r\\n)+[12]?[0-9]\\s*$",
                flags:  "",
                args:   ["CRLF"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = Utils.charRep(args[0] || "Space");

        if (input.length === 0) {
            return [];
        }

        const bites = input.split(delim);
        let latin1 = "";
        for (let i = 0; i < bites.length; i++) {
            if (bites[i] < 1 || bites[i] > 26) {
                throw new OperationError("错误：所有数字必须在 1 到 26 之间。");
            }
            latin1 += Utils.chr(parseInt(bites[i], 10) + 96);
        }
        return latin1;
    }

}

export default A1Z26CipherDecode;
