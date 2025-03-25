/**
 * @author MikeCAT
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * ROT47 Brute Force operation.
 */
class ROT47BruteForce extends Operation {

    /**
     * ROT47BruteForce constructor
     */
    constructor() {
        super();

        this.name = "ROT47 暴力破解";
        this.module = "Default";
        this.description = "尝试所有 ROT47 的可能偏移量。<br><br>您可以选择输入已知的明文（crib）来过滤结果。";
        this.infoURL = "https://wikipedia.org/wiki/ROT13#Variants";
        this.inputType = "byteArray";
        this.outputType = "string";
        this.args = [
            {
                name: "样本长度",
                type: "number",
                value: 100
            },
            {
                name: "样本偏移量",
                type: "number",
                value: 0
            },
            {
                name: "打印偏移量",
                type: "boolean",
                value: true
            },
            {
                name: "Crib (已知明文字符串)",
                type: "string",
                value: ""
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [sampleLength, sampleOffset, printAmount, crib] = args;
        const sample = input.slice(sampleOffset, sampleOffset + sampleLength);
        const cribLower = crib.toLowerCase();
        const result = [];
        for (let amount = 1; amount < 94; amount++) {
            const rotated = sample.slice();
            for (let i = 0; i < rotated.length; i++) {
                if (33 <= rotated[i] && rotated[i] <= 126) {
                    rotated[i] = (rotated[i] - 33 + amount) % 94 + 33;
                }
            }
            const rotatedString = Utils.byteArrayToUtf8(rotated);
            if (rotatedString.toLowerCase().indexOf(cribLower) >= 0) {
                const rotatedStringEscaped = Utils.escapeWhitespace(rotatedString);
                if (printAmount) {
                    const amountStr = "偏移量 = " + (" " + amount).slice(-2) + ": ";
                    result.push(amountStr + rotatedStringEscaped);
                } else {
                    result.push(rotatedStringEscaped);
                }
            }
        }
        return result.join("\n");
    }
}

export default ROT47BruteForce;
