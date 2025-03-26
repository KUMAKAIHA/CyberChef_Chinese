/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {detectFileType} from "../lib/FileType.mjs";
import {FILE_SIGNATURES} from "../lib/FileSignatures.mjs";

// Concat all supported extensions into a single flat list
const exts = [].concat.apply([], Object.keys(FILE_SIGNATURES).map(cat =>
    [].concat.apply([], FILE_SIGNATURES[cat].map(sig =>
        sig.extension.split(",")
    ))
)).unique().sort().join(", ");

/**
 * Detect File Type operation
 */
class DetectFileType extends Operation {

    /**
     * DetectFileType constructor
     */
    constructor() {
        super();

        this.name = "检测文件类型";
        this.module = "Default";
        this.description = "尝试基于“魔术字节”猜测数据的 MIME（多用途互联网邮件扩展）类型。<br><br>目前支持以下文件类型：" +
            exts + "。";
        this.infoURL = "https://wikipedia.org/wiki/List_of_file_signatures";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = Object.keys(FILE_SIGNATURES).map(cat => {
            return {
                name: cat,
                type: "boolean",
                value: true
            };
        });
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const data = new Uint8Array(input),
            categories = [];

        args.forEach((cat, i) => {
            if (cat) categories.push(Object.keys(FILE_SIGNATURES)[i]);
        });

        const types = detectFileType(data, categories);

        if (!types.length) {
            return "未知文件类型。您是否尝试检查此数据的熵，以确定它是否可能被加密或压缩？";
        } else {
            const results = types.map(type => {
                let output = `文件类型：   ${type.name}
扩展名：   ${type.extension}
MIME 类型：   ${type.mime}\n`;

                if (type?.description?.length) {
                    output += `描述： ${type.description}\n`;
                }

                return output;
            });

            return results.join("\n");
        }
    }

}

export default DetectFileType;
