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
import jimp from "jimp/es/index.js";

/**
 * Cover Image operation
 */
class CoverImage extends Operation {

    /**
     * CoverImage constructor
     */
    constructor() {
        super();

        this.name = "覆盖图像";
        this.module = "Image";
        this.description = "将图像缩放到给定的宽度和高度，保持宽高比。图像可能会被裁剪。";
        this.infoURL = "";
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
                name: "水平对齐",
                type: "option",
                value: [
                    "左",
                    "居中",
                    "右"
                ],
                defaultIndex: 1
            },
            {
                name: "垂直对齐",
                type: "option",
                value: [
                    "顶部",
                    "中间",
                    "底部"
                ],
                defaultIndex: 1
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
        const [width, height, hAlign, vAlign, alg] = args;

        const resizeMap = {
            "Nearest Neighbour": jimp.RESIZE_NEAREST_NEIGHBOR,
            "Bilinear": jimp.RESIZE_BILINEAR,
            "Bicubic": jimp.RESIZE_BICUBIC,
            "Hermite": jimp.RESIZE_HERMITE,
            "Bezier": jimp.RESIZE_BEZIER
        };

        const alignMap = {
            "Left": jimp.HORIZONTAL_ALIGN_LEFT,
            "Center": jimp.HORIZONTAL_ALIGN_CENTER,
            "Right": jimp.HORIZONTAL_ALIGN_RIGHT,
            "Top": jimp.VERTICAL_ALIGN_TOP,
            "Middle": jimp.VERTICAL_ALIGN_MIDDLE,
            "Bottom": jimp.VERTICAL_ALIGN_BOTTOM
        };

        if (!isImage(input)) {
            throw new OperationError("无效的文件类型。");
        }

        let image;
        try {
            image = await jimp.read(input);
        } catch (err) {
            throw new OperationError(`加载图像时出错。 (${err})`);
        }
        try {
            if (isWorkerEnvironment())
                self.sendStatusMessage("正在包含图像...");
            image.cover(width, height, alignMap[hAlign] | alignMap[vAlign], resizeMap[alg]);
            let imageBuffer;
            if (image.getMIME() === "image/gif") {
                imageBuffer = await image.getBufferAsync(jimp.MIME_PNG);
            } else {
                imageBuffer = await image.getBufferAsync(jimp.AUTO);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`包含图像时出错。 (${err})`);
        }
    }

    /**
     * Displays the covered image using HTML for web apps
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

export default CoverImage;
