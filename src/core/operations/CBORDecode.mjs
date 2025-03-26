/**
 * @author Danh4 [dan.h4@ncsc.gov.uk]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Cbor from "cbor";

/**
 * CBOR Decode operation
 */
class CBORDecode extends Operation {

    /**
     * CBORDecode constructor
     */
    constructor() {
        super();

        this.name = "CBOR 解码";
        this.module = "Serialise";
        this.description = "简明二进制对象表示法（CBOR）是一种基于JSON的二进制数据序列化格式。与JSON类似，它允许传输包含键值对的数据对象，但采用更简洁的编码方式。这种设计以牺牲人类可读性为代价，提高了数据处理和传输效率。该标准由IETF RFC 8949定义。";
        this.infoURL = "https://wikipedia.org/wiki/CBOR";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        return Cbor.decodeFirstSync(Buffer.from(input).toString("hex"));
    }

}

export default CBORDecode;
