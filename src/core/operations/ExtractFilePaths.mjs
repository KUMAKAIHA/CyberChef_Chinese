/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { search } from "../lib/Extract.mjs";
import { caseInsensitiveSort } from "../lib/Sort.mjs";

/**
 * Extract file paths operation
 */
class ExtractFilePaths extends Operation {

    /**
     * ExtractFilePaths constructor
     */
    constructor() {
        super();

        this.name = "提取文件路径";
        this.module = "Regex";
        this.description = "提取所有看起来像 Windows 或 UNIX 文件路径的内容。<br><br>请注意，如果选择 UNIX，可能会出现很多误报。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Windows",
                type: "boolean",
                value: true
            },
            {
                name: "UNIX",
                type: "boolean",
                value: true
            },
            {
                name: "显示总数",
                type: "boolean",
                value: false
            },
            {
                name: "排序",
                type: "boolean",
                value: false
            },
            {
                name: "去重",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [includeWinPath, includeUnixPath, displayTotal, sort, unique] = args,
            winDrive = "[A-Z]:\\\\",
            winName = "[A-Z\\d][A-Z\\d\\- '_\\(\\)~]{0,61}",
            winExt = "[A-Z\\d]{1,6}",
            winPath = winDrive + "(?:" + winName + "\\\\?)*" + winName +
                "(?:\\." + winExt + ")?",
            unixPath = "(?:/[A-Z\\d.][A-Z\\d\\-.]{0,61})+";
        let filePaths = "";

        if (includeWinPath && includeUnixPath) {
            filePaths = winPath + "|" + unixPath;
        } else if (includeWinPath) {
            filePaths = winPath;
        } else if (includeUnixPath) {
            filePaths = unixPath;
        }

        if (!filePaths) {
            return "";
        }

        const regex = new RegExp(filePaths, "ig");
        const results = search(
            input,
            regex,
            null,
            sort ? caseInsensitiveSort : null,
            unique
        );

        if (displayTotal) {
            return `总共找到：${results.length}\n\n${results.join("\n")}`;
        } else {
            return results.join("\n");
        }

    }

}

export default ExtractFilePaths;
