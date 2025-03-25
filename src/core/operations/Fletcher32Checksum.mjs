/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Fletcher-32 Checksum operation
 */
class Fletcher32Checksum extends Operation {

    /**
     * Fletcher32Checksum constructor
     */
    constructor() {
        super();

        this.name = "Fletcher-32 校验和";
        this.module = "Crypto";
        this.description = "Fletcher 校验和是一种用于计算位置相关的校验和算法，由 John Gould Fletcher 于 1970 年代后期在劳伦斯利弗莫尔实验室设计。<br><br>Fletcher 校验和的目标是以接近循环冗余校验的错误检测性能，但计算量更低，与求和技术相关。";
        this.infoURL = "https://wikipedia.org/wiki/Fletcher%27s_checksum#Fletcher-32";
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

        for (let i = 0; i < input.byteLength - 1; i += 2) {
            a = (a + input.getUint16(i, true)) % 0xffff;
            b = (b + a) % 0xffff;
        }
        if (input.byteLength % 2 !== 0) {
            a = (a + input.getUint8(input.byteLength - 1)) % 0xffff;
            b = (b + a) % 0xffff;
        }

        return Utils.hex(((b << 16) | a) >>> 0, 8);
    }

}

export default Fletcher32Checksum;
