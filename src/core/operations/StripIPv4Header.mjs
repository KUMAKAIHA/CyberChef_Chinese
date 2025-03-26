/**
 * @author c65722 []
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Stream from "../lib/Stream.mjs";

/**
 * Strip IPv4 header operation
 */
class StripIPv4Header extends Operation {

    /**
     * StripIPv4Header constructor
     */
    constructor() {
        super();

        this.name = "去除 IPv4 头部";
        this.module = "Default";
        this.description = "从 IPv4 数据包中去除 IPv4 头部，输出载荷。";
        this.infoURL = "https://wikipedia.org/wiki/IPv4";
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
        const MIN_HEADER_LEN = 20;

        const s = new Stream(new Uint8Array(input));
        if (s.length < MIN_HEADER_LEN) {
            throw new OperationError("输入长度小于最小 IPv4 头部长度");
        }

        const ihl = s.readInt(1) & 0x0f;
        const dataOffsetBytes = ihl * 4;
        if (s.length < dataOffsetBytes) {
            throw new OperationError("输入长度小于 IHL");
        }

        s.moveTo(dataOffsetBytes);

        return s.getBytes().buffer;
    }

}

export default StripIPv4Header;
