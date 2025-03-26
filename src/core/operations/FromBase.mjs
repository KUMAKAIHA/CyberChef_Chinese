/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import BigNumber from "bignumber.js";
import OperationError from "../errors/OperationError.mjs";

/**
 * From Base operation
 */
class FromBase extends Operation {

    /**
     * FromBase constructor
     */
    constructor() {
        super();

        this.name = "从 Base 转换";
        this.module = "Default";
        this.description = "将一个给定进制的数字转换为十进制。";
        this.infoURL = "https://wikipedia.org/wiki/Radix";
        this.inputType = "string";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "进制",
                "type": "number",
                "value": 36
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {BigNumber}
     */
    run(input, args) {
        const radix = args[0];
        if (radix < 2 || radix > 36) {
            throw new OperationError("错误：进制参数必须在 2 到 36 之间");
        }

        const number = input.replace(/\s/g, "").split(".");
        let result = new BigNumber(number[0], radix);

        if (number.length === 1) return result;

        // Fractional part
        for (let i = 0; i < number[1].length; i++) {
            const digit = new BigNumber(number[1][i], radix);
            result += digit.div(Math.pow(radix, i+1));
        }

        return result;
    }

}

export default FromBase;
