/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import BigNumber from "bignumber.js";
import OperationError from "../errors/OperationError.mjs";

/**
 * UNIX Timestamp to Windows Filetime operation
 */
class UNIXTimestampToWindowsFiletime extends Operation {

    /**
     * UNIXTimestampToWindowsFiletime constructor
     */
    constructor() {
        super();

        this.name = "UNIX 时间戳转换为 Windows 文件时间";
        this.module = "Default";
        this.description = "将 UNIX 时间戳转换为 Windows 文件时间值。<br><br>Windows 文件时间是一个 64 位的值，表示自 1601 年 1 月 1 日 UTC 以来 100 纳秒间隔的数量。<br><br>UNIX 时间戳是一个 32 位的值，表示自 1970 年 1 月 1 日 UTC（UNIX 纪元）以来的秒数。<br><br>此操作还支持毫秒、微秒和纳秒为单位的 UNIX 时间戳。";
        this.infoURL = "https://msdn.microsoft.com/en-us/library/windows/desktop/ms724284(v=vs.85).aspx";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "输入单位",
                "type": "option",
                "value": ["秒 (s)", "毫秒 (ms)", "微秒 (μs)", "纳秒 (ns)"]
            },
            {
                "name": "输出格式",
                "type": "option",
                "value": ["十进制", "Hex (大端)", "Hex (小端)"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [units, format] = args;

        if (!input) return "";

        input = new BigNumber(input);

        if (units === "秒 (s)") {
            input = input.multipliedBy(new BigNumber("10000000"));
        } else if (units === "毫秒 (ms)") {
            input = input.multipliedBy(new BigNumber("10000"));
        } else if (units === "微秒 (μs)") {
            input = input.multipliedBy(new BigNumber("10"));
        } else if (units === "纳秒 (ns)") {
            input = input.dividedBy(new BigNumber("100"));
        } else {
            throw new OperationError("无法识别的单位");
        }

        input = input.plus(new BigNumber("116444736000000000"));

        let result;
        if (format.startsWith("Hex")) {
            result = input.toString(16);
        } else {
            result = input.toFixed();
        }

        if (format === "Hex (小端)") {
            // Swap endianness
            let flipped = "";
            for (let i = result.length - 2; i >= 0; i -= 2) {
                flipped += result.charAt(i);
                flipped += result.charAt(i + 1);
            }
            if (result.length % 2 !== 0) {
                flipped += "0" + result.charAt(0);
            }
            result = flipped;
        }

        return result;
    }

}

export default UNIXTimestampToWindowsFiletime;
