/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {fuzzyMatch, calcMatchRanges, DEFAULT_WEIGHTS} from "../lib/FuzzyMatch.mjs";
import Utils from "../Utils.mjs";

/**
 * Fuzzy Match operation
 */
class FuzzyMatch extends Operation {

    /**
     * FuzzyMatch constructor
     */
    constructor() {
        super();

        this.name = "模糊匹配";
        this.module = "Default";
        this.description = "根据加权标准对输入内容进行模糊搜索，以查找模式。<br><br>例如，搜索 <code>dpan</code> 将匹配 <code><b>D</b>on't <b>Pan</b>ic</code>";
        this.infoURL = "https://wikipedia.org/wiki/Fuzzy_matching_(computer-assisted_translation)";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                name: "搜索",
                type: "binaryString",
                value: ""
            },
            {
                name: "连续匹配奖励",
                type: "number",
                value: DEFAULT_WEIGHTS.sequentialBonus,
                hint: "相邻匹配的奖励"
            },
            {
                name: "分隔符奖励",
                type: "number",
                value: DEFAULT_WEIGHTS.separatorBonus,
                hint: "如果匹配发生在分隔符之后则奖励"
            },
            {
                name: "驼峰式奖励",
                type: "number",
                value: DEFAULT_WEIGHTS.camelBonus,
                hint: "如果匹配是大写字母且前一个是小写字母则奖励"
            },
            {
                name: "首字母奖励",
                type: "number",
                value: DEFAULT_WEIGHTS.firstLetterBonus,
                hint: "如果首字母匹配则奖励"
            },
            {
                name: "前导字母惩罚",
                type: "number",
                value: DEFAULT_WEIGHTS.leadingLetterPenalty,
                hint: "对输入中在首次匹配之前出现的每个字母施加惩罚"
            },
            {
                name: "最大前导字母惩罚",
                type: "number",
                value: DEFAULT_WEIGHTS.maxLeadingLetterPenalty,
                hint: "前导字母的最大惩罚"
            },
            {
                name: "未匹配字母惩罚",
                type: "number",
                value: DEFAULT_WEIGHTS.unmatchedLetterPenalty
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const searchStr = args[0];
        const weights = {
            sequentialBonus: args[1],
            separatorBonus: args[2],
            camelBonus: args[3],
            firstLetterBonus: args[4],
            leadingLetterPenalty: args[5],
            maxLeadingLetterPenalty: args[6],
            unmatchedLetterPenalty: args[7]
        };
        const matches = fuzzyMatch(searchStr, input, true, weights);

        if (!matches) {
            return "未找到匹配项。";
        }

        let result = "", pos = 0, hlClass = "hl1";
        matches.forEach(([matches, score, idxs]) => {
            const matchRanges = calcMatchRanges(idxs);

            matchRanges.forEach(([start, length], i) => {
                result += Utils.escapeHtml(input.slice(pos, start));
                if (i === 0) result += `<span class="${hlClass}">`;
                pos = start + length;
                result += `<b>${Utils.escapeHtml(input.slice(start, pos))}</b>`;
            });
            result += "</span>";
            hlClass = hlClass === "hl1" ? "hl2" : "hl1";
        });

        result += Utils.escapeHtml(input.slice(pos, input.length));

        return result;
    }

}

export default FuzzyMatch;
