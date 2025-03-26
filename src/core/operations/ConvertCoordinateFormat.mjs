/**
 * @author j433866 [j433866@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {FORMATS, convertCoordinates} from "../lib/ConvertCoordinates.mjs";

/**
 * Convert co-ordinate format operation
 */
class ConvertCoordinateFormat extends Operation {

    /**
     * ConvertCoordinateFormat constructor
     */
    constructor() {
        super();

        this.name = "转换坐标格式";
        this.module = "Hashing";
        this.description = "在不同格式之间转换地理坐标。<br><br>支持的格式：<ul><li>度分秒 (DMS)</li><li>度十进制分 (DDM)</li><li>十进制度 (DD)</li><li>Geohash</li><li>Military Grid Reference System (MGRS)</li><li>Ordnance Survey National Grid (OSNG)</li><li>Universal Transverse Mercator (UTM)</li></ul><br>该操作可以尝试自动检测输入坐标格式和分隔符，但这可能并不总是有效。";
        this.infoURL = "https://wikipedia.org/wiki/Geographic_coordinate_conversion";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "输入格式",
                "type": "option",
                "value": ["自动"].concat(FORMATS)
            },
            {
                "name": "输入分隔符",
                "type": "option",
                "value": [
                    "自动",
                    "方向在前",
                    "方向在后",
                    "\\n",
                    "逗号",
                    "分号",
                    "冒号"
                ]
            },
            {
                "name": "输出格式",
                "type": "option",
                "value": FORMATS
            },
            {
                "name": "输出分隔符",
                "type": "option",
                "value": [
                    "空格",
                    "\\n",
                    "逗号",
                    "分号",
                    "冒号"
                ]
            },
            {
                "name": "包含罗盘方向",
                "type": "option",
                "value": [
                    "无",
                    "之前",
                    "之后"
                ]
            },
            {
                "name": "精度",
                "type": "number",
                "value": 3
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.replace(/[\s+]/g, "") !== "") {
            const [inFormat, inDelim, outFormat, outDelim, incDirection, precision] = args;
            const result = convertCoordinates(input, inFormat, inDelim, outFormat, outDelim, incDirection, precision);
            return result;
        } else {
            return input;
        }
    }
}

export default ConvertCoordinateFormat;
