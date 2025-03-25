/**
 * @author GCHQ Contributor [3]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Protobuf from "../lib/Protobuf.mjs";

/**
 * Protobuf Decode operation
 */
class ProtobufDecode extends Operation {

    /**
     * ProtobufDecode constructor
     */
    constructor() {
        super();

        this.name = "Protobuf 解码";
        this.module = "Protobuf";
        this.description = "将任何 Protobuf 编码的数据解码为 JSON 格式，并使用字段编号作为字段键。<br><br>如果定义了 .proto schema，编码数据将参考该 schema 进行解码。仅解码一个消息实例。 <br><br><u>显示未知字段</u><br>当使用 schema 时，此选项显示输入数据中存在但未在 schema 中定义的字段。<br><br><u>显示类型</u><br>在其名称旁边显示字段的类型。对于未定义的字段，则显示 wiretype 和示例类型。";
        this.infoURL = "https://wikipedia.org/wiki/Protocol_Buffers";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.args = [
            {
                name: "Schema (.proto 文本)",
                type: "text",
                value: "",
                rows: 8,
                hint: "此功能支持拖拽操作"
            },
            {
                name: "显示未知字段",
                type: "boolean",
                value: false
            },
            {
                name: "显示类型",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        input = new Uint8Array(input);
        try {
            return Protobuf.decode(input, args);
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default ProtobufDecode;
