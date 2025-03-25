/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Fletcher-64 Checksum operation
 */
class Fletcher64Checksum extends Operation {

    /**
     * Fletcher64Checksum constructor
     */
    constructor() {
        super();

        this.name = "Fletcher-64 校验和";
        this.module = "Crypto";
        this.description = "Fletcher 校验和算法是由 John Gould Fletcher 于 1970 年代后期在劳伦斯利弗莫尔实验室设计的位置相关校验和算法。<br><br>Fletcher 校验和算法的目的是提供接近循环冗余校验的错误检测性能，但计算量更低，与求和技术相关。";
        this.infoURL = "https://wikipedia.org/wiki/Fletcher%27s_checksum#Fletcher-64";
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
        let a = 0,
            b = 0;
        if (ArrayBuffer.isView(input)) {
            input = new DataView(input.buffer, input.byteOffset, input.byteLength);
        } else {
            input = new DataView(input);
        }

        for (let i = 0; i < input.byteLength - 3; i += 4) {
            a = (a + input.getUint32(i, true)) % 0xffffffff;
            b = (b + a) % 0xffffffff;
        }
        if (input.byteLength % 4 !== 0) {
            let lastValue = 0;
            for (let i = 0; i < input.byteLength % 4; i++) {
                lastValue = (lastValue << 8) | input.getUint8(input.byteLength - 1 - i);
            }
            a = (a + lastValue) % 0xffffffff;
            b = (b + a) % 0xffffffff;
        }

        return Utils.hex(b >>> 0, 8) + Utils.hex(a >>> 0, 8);
    }

}

export default Fletcher64Checksum;
