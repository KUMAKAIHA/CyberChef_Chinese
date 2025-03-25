/**
 * @author pointhi [thomas.pointhuber@gmx.at]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import {isImage} from "../lib/FileType.mjs";
import {toBase64} from "../lib/Base64.mjs";
import {isWorkerEnvironment} from "../Utils.mjs";
import Jimp from "jimp/es/index.js";

/**
 * Generate Image operation
 */
class GenerateImage extends Operation {

    /**
     * GenerateImage constructor
     */
    constructor() {
        super();

        this.name = "生成图像";
        this.module = "Image";
        this.description = "使用输入数据作为像素值生成图像。";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                "name": "模式",
                "type": "option",
                "value": ["灰度", "红绿", "红绿蓝", "红绿蓝透明度", "Bits"]
            },
            {
                "name": "像素缩放因子",
                "type": "number",
                "value": 8,
            },
            {
                "name": "每行像素数",
                "type": "number",
                "value": 64,
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    async run(input, args) {
        const [mode, scale, width] = args;
        input = new Uint8Array(input);

        if (scale <= 0) {
            throw new OperationError("像素缩放因子需要大于 0");
        }

        if (width <= 0) {
            throw new OperationError("每行像素数需要大于 0");
        }

        const bytePerPixelMap = {
            "灰度": 1,
            "红绿": 2,
            "红绿蓝": 3,
            "红绿蓝透明度": 4,
            "Bits": 1/8,
        };

        const bytesPerPixel = bytePerPixelMap[mode];

        if (bytesPerPixel > 0 && input.length % bytesPerPixel  !== 0) {
            throw new OperationError(`字节数不是以下数值的约数：${bytesPerPixel}`);
        }

        const height = Math.ceil(input.length / bytesPerPixel / width);
        const image = await new Jimp(width, height, (err, image) => {});

        if (isWorkerEnvironment())
            self.sendStatusMessage("正在从数据生成图像...");

        if (mode === "Bits") {
            let index = 0;
            for (let j = 0; j < input.length; j++) {
                const curByte = Utils.bin(input[j]);
                for (let k = 0; k < 8; k++, index++) {
                    const x = index % width;
                    const y = Math.floor(index / width);

                    const value = curByte[k] === "0" ? 0xFF : 0x00;
                    const pixel = Jimp.rgbaToInt(value, value, value, 0xFF);
                    image.setPixelColor(pixel, x, y);
                }
            }
        } else {
            let i = 0;
            while (i < input.length) {
                const index = i / bytesPerPixel;
                const x = index % width;
                const y = Math.floor(index / width);

                let red = 0x00;
                let green = 0x00;
                let blue = 0x00;
                let alpha = 0xFF;

                switch (mode) {
                    case "灰度":
                        red = green = blue = input[i++];
                        break;

                    case "红绿":
                        red = input[i++];
                        green = input[i++];
                        break;

                    case "红绿蓝":
                        red = input[i++];
                        green = input[i++];
                        blue = input[i++];
                        break;

                    case "红绿蓝透明度":
                        red = input[i++];
                        green = input[i++];
                        blue = input[i++];
                        alpha = input[i++];
                        break;

                    default:
                        throw new OperationError(`Unsupported Mode: (${mode})`);
                }

                try {
                    const pixel = Jimp.rgbaToInt(red, green, blue, alpha);
                    image.setPixelColor(pixel, x, y);
                } catch (err) {
                    throw new OperationError(`从像素值生成图像时出错。 (${err})`);
                }
            }
        }

        if (scale !== 1) {
            if (isWorkerEnvironment())
                self.sendStatusMessage("正在缩放图像...");

            image.scaleToFit(width*scale, height*scale, Jimp.RESIZE_NEAREST_NEIGHBOR);
        }

        try {
            const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`生成图像时出错。 (${err})`);
        }
    }

    /**
     * Displays the generated image using HTML for web apps
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

export default GenerateImage;
