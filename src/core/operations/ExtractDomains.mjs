/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { search, DOMAIN_REGEX, DMARC_DOMAIN_REGEX } from "../lib/Extract.mjs";
import { caseInsensitiveSort } from "../lib/Sort.mjs";

/**
 * Extract domains operation
 */
class ExtractDomains extends Operation {

    /**
     * ExtractDomains constructor
     */
    constructor() {
        super();

        this.name = "提取域名";
        this.module = "Regex";
        this.description = "提取完整限定域名。<br>请注意，这不包括路径。使用 <strong>提取 URL</strong> 来查找完整的 URL。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
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
            },
            {
                name: "下划线 (DMARC, DKIM 等)",
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
        const [displayTotal, sort, unique, dmarc] = args;

        const results = search(
            input,
            dmarc ? DMARC_DOMAIN_REGEX : DOMAIN_REGEX,
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

export default ExtractDomains;
