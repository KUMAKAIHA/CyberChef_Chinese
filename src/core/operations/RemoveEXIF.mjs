/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import { removeEXIF } from "../vendor/remove-exif.mjs";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Remove EXIF operation
 */
class RemoveEXIF extends Operation {

    /**
     * RemoveEXIF constructor
     */
    constructor() {
        super();

        this.name = "移除 EXIF 信息";
        this.module = "Image";
        this.description = [
            "从 JPEG 图像中移除 EXIF 数据。",
            "<br><br>",
            "照片中嵌入的 EXIF 数据通常包含关于图像文件本身以及用于创建它的设备的信息。",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Exif";
        this.inputType = "ArrayBuffer";
        this.outputType = "byteArray";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        input = new Uint8Array(input);
        // Do nothing if input is empty
        if (input.length === 0) return input;

        try {
            return removeEXIF(input);
        } catch (err) {
            // Simply return input if no EXIF data is found
            if (err === "Exif not found.") return input;
            throw new OperationError(`无法从图像中移除 EXIF 数据: ${err}`);
        }
    }

}

export default RemoveEXIF;
