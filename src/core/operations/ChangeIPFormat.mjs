/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import {fromHex} from "../lib/Hex.mjs";

/**
 * Change IP format operation
 */
class ChangeIPFormat extends Operation {

    /**
     * ChangeIPFormat constructor
     */
    constructor() {
        super();

        this.name = "更改 IP 格式";
        this.module = "Default";
        this.description = "将 IP 地址从一种格式转换为另一种格式，例如 <code>172.20.23.54</code> 转换为 <code>ac141736</code>";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "输入格式",
                "type": "option",
                "value": ["Dotted Decimal", "Decimal", "Octal", "Hex"]
            },
            {
                "name": "输出格式",
                "type": "option",
                "value": ["Dotted Decimal", "Decimal", "Octal", "Hex"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [inFormat, outFormat] = args,
            lines = input.split("\n");
        let output = "",
            j = 0;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === "") continue;
            let baIp = [];
            let octets;

            if (inFormat === outFormat) {
                output += lines[i] + "\n";
                continue;
            }

            // Convert to byte array IP from input format
            switch (inFormat) {
                case "Dotted Decimal":
                    octets = lines[i].split(".");
                    for (j = 0; j < octets.length; j++) {
                        baIp.push(parseInt(octets[j], 10));
                    }
                    break;
                case "Decimal":
                    baIp = this.fromNumber(lines[i].toString(), 10);
                    break;
                case "Octal":
                    baIp = this.fromNumber(lines[i].toString(), 8);
                    break;
                case "Hex":
                    baIp = fromHex(lines[i]);
                    break;
                default:
                    throw new OperationError("不支持的输入 IP 格式");
            }

            let ddIp;
            let decIp;
            let hexIp;

            // Convert byte array IP to output format
            switch (outFormat) {
                case "Dotted Decimal":
                    ddIp = "";
                    for (j = 0; j < baIp.length; j++) {
                        ddIp += baIp[j] + ".";
                    }
                    output += ddIp.slice(0, ddIp.length-1) + "\n";
                    break;
                case "Decimal":
                    decIp = ((baIp[0] << 24) | (baIp[1] << 16) | (baIp[2] << 8) | baIp[3]) >>> 0;
                    output += decIp.toString() + "\n";
                    break;
                case "Octal":
                    decIp = ((baIp[0] << 24) | (baIp[1] << 16) | (baIp[2] << 8) | baIp[3]) >>> 0;
                    output += "0" + decIp.toString(8) + "\n";
                    break;
                case "Hex":
                    hexIp = "";
                    for (j = 0; j < baIp.length; j++) {
                        hexIp += Utils.hex(baIp[j]);
                    }
                    output += hexIp + "\n";
                    break;
                default:
                    throw new OperationError("不支持的输出 IP 格式");
            }
        }

        return output.slice(0, output.length-1);
    }

    /**
     * Constructs an array of IP address octets from a numerical value.
     * @param {string} value The value of the IP address
     * @param {number} radix The numeral system to be used
     * @returns {number[]}
     */
    fromNumber(value, radix) {
        const decimal = parseInt(value, radix);
        const baIp = [];
        baIp.push(decimal >> 24 & 255);
        baIp.push(decimal >> 16 & 255);
        baIp.push(decimal >> 8 & 255);
        baIp.push(decimal & 255);
        return baIp;
    }

}

export default ChangeIPFormat;
