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
import { isWorkerEnvironment } from "../Utils.mjs";
import Jimp from "jimp/es/index.js";

/**
 * Image Filter operation
 */
class ImageFilter extends Operation {

    /**
     * ImageFilter constructor
     */
    constructor() {
        super();

        this.name = "图像滤镜";
        this.module = "Image";
        this.description = "对图像应用灰度或棕褐色滤镜。";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "滤镜类型",
                type: "option",
                value: [
                    "Greyscale",
                    "Sepia"
                ]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [filterType] = args;
        if (!isImage(input)) {
            throw new OperationError("无效的文件类型。");
        }

        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`加载图像时出错。 (${err})`);
        }
        try {
            if (isWorkerEnvironment())
                self.sendStatusMessage("正在对图像应用 " + filterType.toLowerCase() + " 滤镜...");
            if (filterType === "Greyscale") {
                image.greyscale();
            } else {
                image.sepia();
            }

            let imageBuffer;
            if (image.getMIME() === "image/gif") {
                imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
            } else {
                imageBuffer = await image.getBufferAsync(Jimp.AUTO);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`应用滤镜到图像时出错。 (${err})`);
        }
    }

    /**
     * Displays the blurred image using HTML for web apps
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

export default ImageFilter;
