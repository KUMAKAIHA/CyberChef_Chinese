/**
 * @author c65722 []
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Stream from "../lib/Stream.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Strip UDP header operation
 */
class StripUDPHeader extends Operation {

    /**
     * StripUDPHeader constructor
     */
    constructor() {
        super();

        this.name = "去除 UDP 头部";
        this.module = "Default";
        this.description = "从 UDP 数据报中去除 UDP 头部，输出载荷。";
        this.infoURL = "https://wikipedia.org/wiki/User_Datagram_Protocol";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const HEADER_LEN = 8;

        const s = new Stream(new Uint8Array(input));
        if (s.length < HEADER_LEN) {
            throw new OperationError("需要 8 字节才能构成 UDP 头部");
        }

        s.moveTo(HEADER_LEN);

        return s.getBytes().buffer;
    }

}

export default StripUDPHeader;
