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
 * Add Text To Image operation
 */
class AddTextToImage extends Operation {

    /**
     * AddTextToImage constructor
     */
    constructor() {
        super();

        this.name = "向图像添加文本";
        this.module = "Image";
        this.description = "向图片添加文本。<br><br>文本可以水平或垂直对齐，或者手动指定位置。<br>Roboto 字体有多种变体，可以设置任何尺寸或颜色。";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "文本",
                type: "string",
                value: ""
            },
            {
                name: "水平对齐",
                type: "option",
                value: ["无", "左", "居中", "右"]
            },
            {
                name: "垂直对齐",
                type: "option",
                value: ["无", "顶端", "中间", "底端"]
            },
            {
                name: "X 坐标",
                type: "number",
                value: 0
            },
            {
                name: "Y 坐标",
                type: "number",
                value: 0
            },
            {
                name: "大小",
                type: "number",
                value: 32,
                min: 8
            },
            {
                name: "字体",
                type: "option",
                value: [
                    "Roboto",
                    "Roboto Black",
                    "Roboto Mono",
                    "Roboto Slab"
                ]
            },
            {
                name: "红色",
                type: "number",
                value: 255,
                min: 0,
                max: 255
            },
            {
                name: "绿色",
                type: "number",
                value: 255,
                min: 0,
                max: 255
            },
            {
                name: "蓝色",
                type: "number",
                value: 255,
                min: 0,
                max: 255
            },
            {
                name: "透明度",
                type: "number",
                value: 255,
                min: 0,
                max: 255
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const text = args[0],
            hAlign = args[1],
            vAlign = args[2],
            size = args[5],
            fontFace = args[6],
            red = args[7],
            green = args[8],
            blue = args[9],
            alpha = args[10];

        let xPos = args[3],
            yPos = args[4];

        if (!isImage(input)) {
            throw new OperationError("Invalid file type.");
        }

        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`Error loading image. (${err})`);
        }
        try {
            if (isWorkerEnvironment())
                self.sendStatusMessage("Adding text to image...");

            const fontsMap = {};
            const fonts = [
                import(/* webpackMode: "eager" */ "../../web/static/fonts/bmfonts/Roboto72White.fnt"),
                import(/* webpackMode: "eager" */ "../../web/static/fonts/bmfonts/RobotoBlack72White.fnt"),
                import(/* webpackMode: "eager" */ "../../web/static/fonts/bmfonts/RobotoMono72White.fnt"),
                import(/* webpackMode: "eager" */ "../../web/static/fonts/bmfonts/RobotoSlab72White.fnt")
            ];

            await Promise.all(fonts)
                .then(fonts => {
                    fontsMap.Roboto = fonts[0];
                    fontsMap["Roboto Black"] = fonts[1];
                    fontsMap["Roboto Mono"] = fonts[2];
                    fontsMap["Roboto Slab"] = fonts[3];
                });


            // Make Webpack load the png font images
            await Promise.all([
                import(/* webpackMode: "eager" */ "../../web/static/fonts/bmfonts/Roboto72White.png"),
                import(/* webpackMode: "eager" */ "../../web/static/fonts/bmfonts/RobotoSlab72White.png"),
                import(/* webpackMode: "eager" */ "../../web/static/fonts/bmfonts/RobotoMono72White.png"),
                import(/* webpackMode: "eager" */ "../../web/static/fonts/bmfonts/RobotoBlack72White.png")
            ]);

            const font = fontsMap[fontFace];

            // LoadFont needs an absolute url, so append the font name to self.docURL
            const jimpFont = await Jimp.loadFont(self.docURL + "/" + font.default);

            jimpFont.pages.forEach(function(page) {
                if (page.bitmap) {
                    // Adjust the RGB values of the image pages to change the font colour.
                    const pageWidth = page.bitmap.width;
                    const pageHeight = page.bitmap.height;
                    for (let ix = 0; ix < pageWidth; ix++) {
                        for (let iy = 0; iy < pageHeight; iy++) {
                            const idx = (iy * pageWidth + ix) << 2;

                            const newRed = page.bitmap.data[idx] - (255 - red);
                            const newGreen = page.bitmap.data[idx + 1] - (255 - green);
                            const newBlue = page.bitmap.data[idx + 2] - (255 - blue);
                            const newAlpha = page.bitmap.data[idx + 3] - (255 - alpha);

                            // Make sure the bitmap values don't go below 0 as that makes jimp very unhappy
                            page.bitmap.data[idx] = (newRed > 0) ? newRed : 0;
                            page.bitmap.data[idx + 1] = (newGreen > 0) ? newGreen : 0;
                            page.bitmap.data[idx + 2] = (newBlue > 0) ? newBlue : 0;
                            page.bitmap.data[idx + 3] = (newAlpha > 0) ? newAlpha : 0;
                        }
                    }
                }
            });

            // Create a temporary image to hold the rendered text
            const textImage = new Jimp(Jimp.measureText(jimpFont, text), Jimp.measureTextHeight(jimpFont, text));
            textImage.print(jimpFont, 0, 0, text);

            // Scale the rendered text image to the correct size
            const scaleFactor = size / 72;
            if (size !== 1) {
                // Use bicubic for decreasing size
                if (size > 1) {
                    textImage.scale(scaleFactor, Jimp.RESIZE_BICUBIC);
                } else {
                    textImage.scale(scaleFactor, Jimp.RESIZE_BILINEAR);
                }
            }

            // If using the alignment options, calculate the pixel values AFTER the image has been scaled
            switch (hAlign) {
                case "Left":
                    xPos = 0;
                    break;
                case "Center":
                    xPos = (image.getWidth() / 2) - (textImage.getWidth() / 2);
                    break;
                case "Right":
                    xPos = image.getWidth() - textImage.getWidth();
                    break;
            }

            switch (vAlign) {
                case "Top":
                    yPos = 0;
                    break;
                case "Middle":
                    yPos = (image.getHeight() / 2) - (textImage.getHeight() / 2);
                    break;
                case "Bottom":
                    yPos = image.getHeight() - textImage.getHeight();
                    break;
            }

            // Blit the rendered text image onto the original source image
            image.blit(textImage, xPos, yPos);

            let imageBuffer;
            if (image.getMIME() === "image/gif") {
                imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
            } else {
                imageBuffer = await image.getBufferAsync(Jimp.AUTO);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`Error adding text to image. (${err})`);
        }
    }

    /**
     * Displays the blurred image using HTML for web apps
     *
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data) {
        if (!data.byteLength) return "";
        const dataArray = new Uint8Array(data);

        const type = isImage(dataArray);
        if (!type) {
            throw new OperationError("Invalid file type.");
        }

        return `<img src="data:${type};base64,${toBase64(dataArray)}">`;
    }

}

export default AddTextToImage;
