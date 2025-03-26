/**
 * @author bwhitn [brian.m.whitney@outlook.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @author d98762625 [d98762625@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import BigNumber from "bignumber.js";
import Operation from "../Operation.mjs";
import { multi, createNumArray } from "../lib/Arithmetic.mjs";
import { ARITHMETIC_DELIM_OPTIONS } from "../lib/Delim.mjs";


/**
 * Multiply operation
 */
class Multiply extends Operation {

    /**
     * Multiply constructor
     */
    constructor() {
        super();

        this.name = "乘";
        this.module = "Default";
        this.description = "对数字列表执行乘法运算。如果字符串中的项目不是数字，则会将其从列表中排除。<br><br>例如：<code>0x0a 8 .5</code> 变为 <code>40</code>";
        this.infoURL = "https://wikipedia.org/wiki/Multiplication";
        this.inputType = "string";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "分隔符",
                "type": "option",
                "value": ARITHMETIC_DELIM_OPTIONS,
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {BigNumber}
     */
    run(input, args) {
        const val = multi(createNumArray(input, args[0]));
        return BigNumber.isBigNumber(val) ? val : new BigNumber(NaN);
    }

}

export default Multiply;
