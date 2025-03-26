/**
 * @author Ge0rg3 [georgeomnet+cyberchef@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import Jimp from "jimp/es/index.js";

/**
 * View Bit Plane operation
 */
class ViewBitPlane extends Operation {

    /**
     * ViewBitPlane constructor
     */
    constructor() {
        super();

        this.name = "查看位平面";
        this.module = "Image";
        this.description = "提取并显示任何给定图像的位平面。 这些位平面仅显示来自每个像素的单个位，可用于在隐写术中隐藏消息。";
        this.infoURL = "https://wikipedia.org/wiki/Bit_plane";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "颜色",
                type: "option",
                value: COLOUR_OPTIONS
            },
            {
                name: "位",
                type: "number",
                value: 0
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    async run(input, args) {
        if (!isImage(input)) throw new OperationError("Please enter a valid image file.");

        const [colour, bit] = args,
            parsedImage = await Jimp.read(input),
            width = parsedImage.bitmap.width,
            height = parsedImage.bitmap.height,
            colourIndex = COLOUR_OPTIONS.indexOf(colour),
            bitIndex = 7-bit;

        if (bit < 0 || bit > 7) {
            throw new OperationError("Error: Bit argument must be between 0 and 7");
        }

        let pixel, bin, newPixelValue;

        parsedImage.scan(0, 0, width, height, function(x, y, idx) {
            pixel = this.bitmap.data[idx + colourIndex];
            bin = Utils.bin(pixel);
            newPixelValue = 255;

            if (bin.charAt(bitIndex) === "1") newPixelValue = 0;

            for (let i=0; i < 3; i++) {
                this.bitmap.data[idx + i] = newPixelValue;
            }
            this.bitmap.data[idx + 3] = 255;

        });

        const imageBuffer = await parsedImage.getBufferAsync(Jimp.AUTO);

        return new Uint8Array(imageBuffer).buffer;
    }

    /**
     * Displays the extracted data as an image for web apps.
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data) {
        if (!data.byteLength) return "";
        const type = isImage(data);

        return `<img src="data:${type};base64,${toBase64(data)}">`;
    }

}

const COLOUR_OPTIONS = [
    "红色",
    "绿色",
    "蓝色",
    "Alpha"
];

export default ViewBitPlane;
