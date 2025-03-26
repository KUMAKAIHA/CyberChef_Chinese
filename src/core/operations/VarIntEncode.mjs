/**
 * @author GCHQ Contributor [3]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Protobuf from "../lib/Protobuf.mjs";

/**
 * VarInt Encode operation
 */
class VarIntEncode extends Operation {

    /**
     * VarIntEncode constructor
     */
    constructor() {
        super();

        this.name = "VarInt 编码";
        this.module = "Default";
        this.description = "将 Vn 整数编码为 VarInt 格式。VarInt 是一种高效的变长整数编码方式，常用于 Protobuf。";
        this.infoURL = "https://developers.google.com/protocol-buffers/docs/encoding#varints";
        this.inputType = "number";
        this.outputType = "byteArray";
        this.args = [];
    }

    /**
     * @param {number} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        try {
            return Protobuf.varIntEncode(input);
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default VarIntEncode;
