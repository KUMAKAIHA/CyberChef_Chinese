/**
 * @author sg5506844 [sg5506844@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import rison from "rison";

/**
 * Rison Decode operation
 */
class RisonDecode extends Operation {

    /**
     * RisonDecode constructor
     */
    constructor() {
        super();

        this.name = "Rison 解码";
        this.module = "Encodings";
        this.description = "Rison 是一种数据序列化格式，针对 URI 的紧凑性进行了优化。 Rison 是 JSON 的一种变体，在 URI 编码后看起来明显更出色。 Rison 仍然表达与 JSON 完全相同的数据结构集，因此数据可以在两者之间来回转换而不会丢失或猜测。";
        this.infoURL = "https://github.com/Nanonid/rison";
        this.inputType = "string";
        this.outputType = "Object";
        this.args = [
            {
                name: "解码选项",
                type: "editableOption",
                value: ["解码", "解码对象", "解码数组"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {Object}
     */
    run(input, args) {
        const [decodeOption] = args;
        switch (decodeOption) {
            case "解码":
                return rison.decode(input);
            case "解码对象":
                return rison.decode_object(input);
            case "解码数组":
                return rison.decode_array(input);
            default:
                throw new OperationError("无效的解码选项");
        }
    }
}

export default RisonDecode;
