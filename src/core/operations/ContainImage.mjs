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
 * Contain Image operation
 */
class ContainImage extends Operation {

    /**
     * ContainImage constructor
     */
    constructor() {
        super();

        this.name = "包含图像";
        this.module = "Image";
        this.description = "将图像缩放到指定的宽度和高度，同时保持宽高比。图像可能会被 Letterbox 处理。";
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
            },
            {
                name: "不透明背景",
                type: "boolean",
                value: true
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [width, height, hAlign, vAlign, alg, opaqueBg] = args;

        const resizeMap = {
            "Nearest Neighbour": Jimp.RESIZE_NEAREST_NEIGHBOR,
            "Bilinear": Jimp.RESIZE_BILINEAR,
            "Bicubic": Jimp.RESIZE_BICUBIC,
            "Hermite": Jimp.RESIZE_HERMITE,
            "Bezier": Jimp.RESIZE_BEZIER
        };

        const alignMap = {
            "Left": Jimp.HORIZONTAL_ALIGN_LEFT,
            "Center": Jimp.HORIZONTAL_ALIGN_CENTER,
            "Right": Jimp.HORIZONTAL_ALIGN_RIGHT,
            "Top": Jimp.VERTICAL_ALIGN_TOP,
            "Middle": Jimp.VERTICAL_ALIGN_MIDDLE,
            "Bottom": Jimp.VERTICAL_ALIGN_BOTTOM
        };

        if (!isImage(input)) {
            throw new OperationError("无效的文件类型。");
        }

        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`加载图像时出错。(${err})`);
        }
        try {
            if (isWorkerEnvironment())
                self.sendStatusMessage("正在包含图像...");
            image.contain(width, height, alignMap[hAlign] | alignMap[vAlign], resizeMap[alg]);

            if (opaqueBg) {
                const newImage = await Jimp.read(width, height, 0x000000FF);
                newImage.blit(image, 0, 0);
                image = newImage;
            }

            let imageBuffer;
            if (image.getMIME() === "image/gif") {
                imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
            } else {
                imageBuffer = await image.getBufferAsync(Jimp.AUTO);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`包含图像时出错。(${err})`);
        }
    }

    /**
     * Displays the contained image using HTML for web apps
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

export default ContainImage;
