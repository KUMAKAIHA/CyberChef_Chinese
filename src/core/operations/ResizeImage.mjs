/**
 * @author j433866 [j433866@gmail.com]
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
 * Resize Image operation
 */
class ResizeImage extends Operation {

    /**
     * ResizeImage constructor
     */
    constructor() {
        super();

        this.name = "调整图像大小";
        this.module = "Image";
        this.description = "将图像调整为指定的宽度和高度值。";
        this.infoURL = "https://wikipedia.org/wiki/Image_scaling";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "宽度",
                type: "number",
                value: 100,
                min: 1
            },
            {
                name: "高度",
                type: "number",
                value: 100,
                min: 1
            },
            {
                name: "单位类型",
                type: "option",
                value: ["像素", "百分比"]
            },
            {
                name: "保持宽高比",
                type: "boolean",
                value: false
            },
            {
                name: "调整大小算法",
                type: "option",
                value: [
                    "最近邻",
                    "双线性",
                    "双三次",
                    "埃尔米特",
                    "贝塞尔"
                ],
                defaultIndex: 1
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        let width = args[0],
            height = args[1];
        const unit = args[2],
            aspect = args[3],
            resizeAlg = args[4];

        const resizeMap = {
            "Nearest Neighbour": Jimp.RESIZE_NEAREST_NEIGHBOR,
            "Bilinear": Jimp.RESIZE_BILINEAR,
            "Bicubic": Jimp.RESIZE_BICUBIC,
            "Hermite": Jimp.RESIZE_HERMITE,
            "Bezier": Jimp.RESIZE_BEZIER
        };

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
            if (unit === "百分比") {
                width = image.getWidth() * (width / 100);
                height = image.getHeight() * (height / 100);
            }

            if (isWorkerEnvironment())
                self.sendStatusMessage("正在调整图像大小...");
            if (aspect) {
                image.scaleToFit(width, height, resizeMap[resizeAlg]);
            } else {
                image.resize(width, height, resizeMap[resizeAlg]);
            }

            let imageBuffer;
            if (image.getMIME() === "image/gif") {
                imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
            } else {
                imageBuffer = await image.getBufferAsync(Jimp.AUTO);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`调整图像大小时出错。 (${err})`);
        }
    }

    /**
     * Displays the resized image using HTML for web apps
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

export default ResizeImage;
