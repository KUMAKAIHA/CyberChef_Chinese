/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { scanForFileTypes } from "../lib/FileType.mjs";
import { FILE_SIGNATURES } from "../lib/FileSignatures.mjs";

/**
 * Scan for Embedded Files operation
 */
class ScanForEmbeddedFiles extends Operation {

    /**
     * ScanForEmbeddedFiles constructor
     */
    constructor() {
        super();

        this.name = "扫描内嵌文件";
        this.module = "Default";
        this.description = "通过在所有偏移处查找 magic bytes 扫描数据中潜在的内嵌文件。此操作容易产生误报。<br><br>警告：大于约 100KB 的文件将需要非常长的时间来处理。";
        this.infoURL = "https://wikipedia.org/wiki/List_of_file_signatures";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = Object.keys(FILE_SIGNATURES).map(cat => {
            return {
                name: cat,
                type: "boolean",
                value: cat === "Miscellaneous" ? false : true
            };
        });
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let output = "正在扫描数据中的 'magic bytes'，这可能表示存在内嵌文件。以下结果可能是误报，不应被视为可靠。任何足够长的文件都可能巧合地包含这些 magic bytes。\n",
            numFound = 0;
        const categories = [],
            data = new Uint8Array(input);

        args.forEach((cat, i) => {
            if (cat) categories.push(Object.keys(FILE_SIGNATURES)[i]);
        });

        const types = scanForFileTypes(data, categories);

        if (types.length) {
            types.forEach(type => {
                numFound++;
                output += `\n偏移量 ${type.offset} (0x${Utils.hex(type.offset)}):
  文件类型:   ${type.fileDetails.name}
  扩展名:   ${type.fileDetails.extension}
  MIME 类型:   ${type.fileDetails.mime}\n`;

                if (type?.fileDetails?.description?.length) {
                    output += `  描述: ${type.fileDetails.description}\n`;
                }
            });
        }

        if (numFound === 0) {
            output += "\n未找到内嵌文件。";
        }

        return output;
    }

}

export default ScanForEmbeddedFiles;
