/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import { fromBase64, toBase64 } from "../lib/Base64.mjs";
import { fromHex } from "../lib/Hex.mjs";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import {isImage} from "../lib/FileType.mjs";

/**
 * Render Image operation
 */
class RenderImage extends Operation {

    /**
     * RenderImage constructor
     */
    constructor() {
        super();

        this.name = "渲染图像";
        this.module = "Image";
        this.description = "将输入数据显示为图像。支持以下格式：<br><br><ul><li>jpg/jpeg</li><li>png</li><li>gif</li><li>webp</li><li>bmp</li><li>ico</li></ul>";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.presentType = "html";
        this.args = [
            {
                "name": "输入格式",
                "type": "option",
                "value": ["Raw", "Base64", "Hex"]
            }
        ];
        this.checks = [
            {
                pattern: "^(?:\\xff\\xd8\\xff|\\x89\\x50\\x4e\\x47|\\x47\\x49\\x46|.{8}\\x57\\x45\\x42\\x50|\\x42\\x4d)",
                flags: "",
                args: ["Raw"],
                useful: true,
                output: {
                    mime: "image"
                }
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const inputFormat = args[0];

        if (!input.length) return [];

        // Convert input to raw bytes
        switch (inputFormat) {
            case "Hex":
                input = fromHex(input);
                break;
            case "Base64":
                // Don't trust the Base64 entered by the user.
                // Unwrap it first, then re-encode later.
                input = fromBase64(input, undefined, "byteArray");
                break;
            case "Raw":
            default:
                input = Utils.strToByteArray(input);
                break;
        }

        // Determine file type
        if (!isImage(input)) {
            throw new OperationError("无效的文件类型");
        }

        return input;
    }

    /**
     * Displays the image using HTML for web apps.
     *
     * @param {byteArray} data
     * @returns {html}
     */
    async present(data) {
        if (!data.length) return "";

        let dataURI = "data:";

        // Determine file type
        const mime = isImage(data);
        if (mime) {
            dataURI += mime + ";";
        } else {
            throw new OperationError("无效的文件类型");
        }

        // Add image data to URI
        dataURI += "base64," + toBase64(data);

        return "<img src='" + dataURI + "'>";
    }

}

export default RenderImage;
