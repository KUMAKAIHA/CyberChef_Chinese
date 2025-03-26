/**
 * @author klaxon [klaxon@veyr.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { GenerateParagraphs, GenerateSentences, GenerateWords, GenerateBytes } from "../lib/LoremIpsum.mjs";

/**
 * Generate Lorem Ipsum operation
 */
class GenerateLoremIpsum extends Operation {

    /**
     * GenerateLoremIpsum constructor
     */
    constructor() {
        super();

        this.name = "生成 Lorem Ipsum 文本";
        this.module = "Default";
        this.description = "生成不同长度的 Lorem Ipsum 占位符文本。";
        this.infoURL = "https://wikipedia.org/wiki/Lorem_ipsum";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "长度",
                "type": "number",
                "value": "3"
            },
            {
                "name": "长度单位",
                "type": "option",
                "value": ["Paragraphs", "Sentences", "Words", "Bytes"]
            }

        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [length, lengthType] = args;
        if (length < 1) {
            throw new OperationError("长度必须大于 0");
        }
        switch (lengthType) {
            case "Paragraphs":
                return GenerateParagraphs(length);
            case "Sentences":
                return GenerateSentences(length);
            case "Words":
                return GenerateWords(length);
            case "Bytes":
                return GenerateBytes(length);
            default:
                throw new OperationError("无效的长度类型");

        }
    }

}

export default GenerateLoremIpsum;
