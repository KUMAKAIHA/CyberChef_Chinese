/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { DELIM_OPTIONS } from "../lib/Delim.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * To Charcode operation
 */
class ToCharcode extends Operation {

    /**
     * ToCharcode constructor
     */
    constructor() {
        super();

        this.name = "转换为 Charcode";
        this.module = "Default";
        this.description = "将文本转换为 Unicode 字符代码等效形式。<br><br>例如：<code>Γειά σου</code> 变为 <code>0393 03b5 03b9 03ac 20 03c3 03bf 03c5</code>";
        this.infoURL = "https://wikipedia.org/wiki/Plane_(Unicode)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "分隔符",
                "type": "option",
                "value": DELIM_OPTIONS
            },
            {
                "name": "进制",
                "type": "number",
                "value": 16
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if base argument out of range
     */
    run(input, args) {
        const delim = Utils.charRep(args[0] || "Space"),
            base = args[1];
        let output = "",
            padding,
            ordinal;

        if (base < 2 || base > 36) {
            throw new OperationError("错误：进制参数必须在 2 到 36 之间");
        }

        const charcode = Utils.strToCharcode(input);
        for (let i = 0; i < charcode.length; i++) {
            ordinal = charcode[i];

            if (base === 16) {
                if (ordinal < 256) padding = 2;
                else if (ordinal < 65536) padding = 4;
                else if (ordinal < 16777216) padding = 6;
                else if (ordinal < 4294967296) padding = 8;
                else padding = 2;

                if (padding > 2 && isWorkerEnvironment()) self.setOption("attemptHighlight", false);

                output += Utils.hex(ordinal, padding) + delim;
            } else {
                if (isWorkerEnvironment()) self.setOption("attemptHighlight", false);
                output += ordinal.toString(base) + delim;
            }
        }

        return output.slice(0, -delim.length);
    }

}

export default ToCharcode;
