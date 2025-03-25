/**
 * @author sg5506844 [sg5506844@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import rison from "rison";

/**
 * Rison Encode operation
 */
class RisonEncode extends Operation {

    /**
     * RisonEncode constructor
     */
    constructor() {
        super();

        this.name = "Rison 编码";
        this.module = "Encodings";
        this.description = "Rison 是一种数据序列化格式，针对 URI 的紧凑性进行了优化。 Rison 是 JSON 的一种变体，在 URI 编码后看起来明显更优。 Rison 仍然表达与 JSON 完全相同的数据结构集，因此数据可以在两者之间来回转换而不会丢失或产生歧义。";
        this.infoURL = "https://github.com/Nanonid/rison";
        this.inputType = "Object";
        this.outputType = "string";
        this.args = [
            {
                name: "编码选项",
                type: "option",
                value: ["编码", "编码对象", "编码数组", "编码 URI"]
            },
        ];
    }

    /**
     * @param {Object} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [encodeOption] = args;
        switch (encodeOption) {
            case "编码":
                return rison.encode(input);
            case "编码对象":
                return rison.encode_object(input);
            case "编码数组":
                return rison.encode_array(input);
            case "编码 URI":
                return rison.encode_uri(input);
            default:
                throw new OperationError("无效的编码选项");
        }
    }
}

export default RisonEncode;
