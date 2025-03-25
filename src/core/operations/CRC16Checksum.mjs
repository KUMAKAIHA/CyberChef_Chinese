/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import JSCRC from "js-crc";

/**
 * CRC-16 Checksum operation
 */
class CRC16Checksum extends Operation {

    /**
     * CRC16Checksum constructor
     */
    constructor() {
        super();

        this.name = "CRC-16 校验和";
        this.module = "Crypto";
        this.description = "循环冗余校验 (CRC) 是一种错误检测码，常用于数字网络和存储设备中，以检测原始数据的意外更改。<br><br>CRC 由 W. Wesley Peterson 于 1961 年发明。";
        this.infoURL = "https://wikipedia.org/wiki/Cyclic_redundancy_check";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return JSCRC.crc16(input);
    }

}

export default CRC16Checksum;
