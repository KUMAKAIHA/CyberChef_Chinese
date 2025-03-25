/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Pad lines operation
 */
class PadLines extends Operation {

    /**
     * PadLines constructor
     */
    constructor() {
        super();

        this.name = "填充行";
        this.module = "Default";
        this.description = "在每行开头或结尾添加指定数量的指定字符";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "位置",
                "type": "option",
                "value": ["开始", "结尾"]
            },
            {
                "name": "长度",
                "type": "number",
                "value": 5
            },
            {
                "name": "字符",
                "type": "binaryShortString",
                "value": " "
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [position, len, chr] = args,
            lines = input.split("\n");
        let output = "",
            i = 0;

        if (position === "Start") {
            for (i = 0; i < lines.length; i++) {
                output += lines[i].padStart(lines[i].length+len, chr) + "\n";
            }
        } else if (position === "End") {
            for (i = 0; i < lines.length; i++) {
                output += lines[i].padEnd(lines[i].length+len, chr) + "\n";
            }
        }

        return output.slice(0, output.length-1);
    }

}

export default PadLines;
