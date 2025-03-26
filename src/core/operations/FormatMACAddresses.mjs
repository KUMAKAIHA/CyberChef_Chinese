/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Format MAC addresses operation
 */
class FormatMACAddresses extends Operation {

    /**
     * FormatMACAddresses constructor
     */
    constructor() {
        super();

        this.name = "格式化 MAC 地址";
        this.module = "Default";
        this.description = "以多种不同格式显示给定的 MAC 地址。<br><br>地址应以列表形式给出，并以换行符、空格或逗号分隔。<br><br>警告：没有进行有效性检查。";
        this.infoURL = "https://wikipedia.org/wiki/MAC_address#Notational_conventions";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "输出大小写",
                "type": "option",
                "value": ["两者", "仅大写", "仅小写"]
            },
            {
                "name": "无分隔符",
                "type": "boolean",
                "value": true
            },
            {
                "name": "短划线分隔符",
                "type": "boolean",
                "value": true
            },
            {
                "name": "冒号分隔符",
                "type": "boolean",
                "value": true
            },
            {
                "name": "Cisco 样式",
                "type": "boolean",
                "value": false
            },
            {
                "name": "IPv6 接口 ID",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return "";

        const [
                outputCase,
                noDelim,
                dashDelim,
                colonDelim,
                ciscoStyle,
                ipv6IntID
            ] = args,
            outputList = [],
            macs = input.toLowerCase().split(/[,\s\r\n]+/);

        macs.forEach(function(mac) {
            const cleanMac = mac.replace(/[:.-]+/g, ""),
                macHyphen = cleanMac.replace(/(.{2}(?=.))/g, "$1-"),
                macColon = cleanMac.replace(/(.{2}(?=.))/g, "$1:"),
                macCisco = cleanMac.replace(/(.{4}(?=.))/g, "$1.");
            let macIPv6 = cleanMac.slice(0, 6) + "fffe" + cleanMac.slice(6);

            macIPv6 = macIPv6.replace(/(.{4}(?=.))/g, "$1:");
            let bite = parseInt(macIPv6.slice(0, 2), 16) ^ 2;
            bite = bite.toString(16).padStart(2, "0");
            macIPv6 = bite + macIPv6.slice(2);

            if (outputCase === "仅小写") {
                if (noDelim) outputList.push(cleanMac);
                if (dashDelim) outputList.push(macHyphen);
                if (colonDelim) outputList.push(macColon);
                if (ciscoStyle) outputList.push(macCisco);
                if (ipv6IntID) outputList.push(macIPv6);
            } else if (outputCase === "仅大写") {
                if (noDelim) outputList.push(cleanMac.toUpperCase());
                if (dashDelim) outputList.push(macHyphen.toUpperCase());
                if (colonDelim) outputList.push(macColon.toUpperCase());
                if (ciscoStyle) outputList.push(macCisco.toUpperCase());
                if (ipv6IntID) outputList.push(macIPv6.toUpperCase());
            } else {
                if (noDelim) outputList.push(cleanMac, cleanMac.toUpperCase());
                if (dashDelim) outputList.push(macHyphen, macHyphen.toUpperCase());
                if (colonDelim) outputList.push(macColon, macColon.toUpperCase());
                if (ciscoStyle) outputList.push(macCisco, macCisco.toUpperCase());
                if (ipv6IntID) outputList.push(macIPv6, macIPv6.toUpperCase());
            }

            outputList.push(
                "" // Empty line to delimit groups
            );
        });

        // Return the data as a string
        return outputList.join("\n");
    }

}

export default FormatMACAddresses;
