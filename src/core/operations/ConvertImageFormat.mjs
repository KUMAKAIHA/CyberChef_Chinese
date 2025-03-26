/**
 * @author j433866 [j433866@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import Jimp from "jimp/es/index.js";

/**
 * Convert Image Format operation
 */
class ConvertImageFormat extends Operation {

    /**
     * ConvertImageFormat constructor
     */
    constructor() {
        super();

        this.name = "转换图像格式";
        this.module = "Image";
        this.description = "在不同图像格式之间转换。支持的格式:<br><ul><li>Joint Photographic Experts Group (JPEG)</li><li>Portable Network Graphics (PNG)</li><li>Bitmap (BMP)</li><li>Tagged Image File Format (TIFF)</li></ul><br>注意：GIF 文件支持作为输入，但不支持作为输出。";
        this.infoURL = "https://wikipedia.org/wiki/Image_file_formats";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "输出格式",
                type: "option",
                value: [
                    "JPEG",
                    "PNG",
                    "BMP",
                    "TIFF"
                ]
            },
            {
                name: "JPEG 质量",
                type: "number",
                value: 80,
                min: 1,
                max: 100
            },
            {
                name: "PNG 过滤器类型",
                type: "option",
                value: [
                    "Auto",
                    "None",
                    "Sub",
                    "Up",
                    "Average",
                    "Paeth"
                ]
            },
            {
                name: "PNG Deflate 压缩级别",
                type: "number",
                value: 9,
                min: 0,
                max: 9
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [format, jpegQuality, pngFilterType, pngDeflateLevel] = args;
        const formatMap = {
            "JPEG": Jimp.MIME_JPEG,
            "PNG": Jimp.MIME_PNG,
            "BMP": Jimp.MIME_BMP,
            "TIFF": Jimp.MIME_TIFF
        };

        const pngFilterMap = {
            "Auto": Jimp.PNG_FILTER_AUTO,
            "None": Jimp.PNG_FILTER_NONE,
            "Sub": Jimp.PNG_FILTER_SUB,
            "Up": Jimp.PNG_FILTER_UP,
            "Average": Jimp.PNG_FILTER_AVERAGE,
            "Paeth": Jimp.PNG_FILTER_PATH
        };

        const mime = formatMap[format];

        if (!isImage(input)) {
            throw new OperationError("无效的文件格式。");
        }
        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`打开图像文件时出错。 (${err})`);
        }
        try {
            switch (format) {
                case "JPEG":
                    image.quality(jpegQuality);
                    break;
                case "PNG":
                    image.filterType(pngFilterMap[pngFilterType]);
                    image.deflateLevel(pngDeflateLevel);
                    break;
            }

            const imageBuffer = await image.getBufferAsync(mime);
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`转换图像格式时出错。 (${err})`);
        }
    }

    /**
     * Displays the converted image using HTML for web apps
     *
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data) {
        if (!data.byteLength) return "";
        const dataArray = new Uint8Array(data);

        const type = isImage(dataArray);
        if (!type) {
            throw new OperationError("无效的文件类型。");
        }

        return `<img src="data:${type};base64,${toBase64(dataArray)}">`;
    }

}

export default ConvertImageFormat;
