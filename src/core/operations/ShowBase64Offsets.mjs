/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {fromBase64, toBase64} from "../lib/Base64.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Show Base64 offsets operation
 */
class ShowBase64Offsets extends Operation {

    /**
     * ShowBase64Offsets constructor
     */
    constructor() {
        super();

        this.name = "显示 Base64 偏移量";
        this.module = "Default";
        this.description = "当一个字符串存在于一个数据块中，且整个数据块被 Base64 编码时，该字符串本身可以根据其在数据块中的偏移量以三种不同的 Base64 形式表示。<br><br>此操作显示给定字符串的所有可能偏移量，以便可以考虑每种可能的编码。";
        this.infoURL = "https://wikipedia.org/wiki/Base64#Output_padding";
        this.inputType = "byteArray";
        this.outputType = "html";
        this.args = [
            {
                name: "字符集",
                type: "binaryString",
                value: "A-Za-z0-9+/="
            },
            {
                name: "显示可变字符和填充",
                type: "boolean",
                value: true
            },
            {
                name: "输入格式",
                type: "option",
                value: ["Raw", "Base64"]
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const [alphabet, showVariable, format] = args;

        if (format === "Base64") {
            input = fromBase64(Utils.byteArrayToUtf8(input), null, "byteArray");
        }

        let offset0 = toBase64(input, alphabet),
            offset1 = toBase64([0].concat(input), alphabet),
            offset2 = toBase64([0, 0].concat(input), alphabet),
            staticSection = "",
            padding = "";

        const len0 = offset0.indexOf("="),
            len1 = offset1.indexOf("="),
            len2 = offset2.indexOf("="),
            script = "<script type='application/javascript'>$('[data-toggle=\"tooltip\"]').tooltip()</script>";

        if (input.length < 1) {
            throw new OperationError("请输入一个字符串。");
        }

        // Highlight offset 0
        if (len0 % 4 === 2) {
            staticSection = offset0.slice(0, -3);
            offset0 = "<span data-toggle='tooltip' data-placement='top' title='" +
                Utils.escapeHtml(fromBase64(staticSection, alphabet).slice(0, -2)) + "'>" +
                staticSection + "</span>" +
                "<span class='hl5'>" + offset0.substr(offset0.length - 3, 1) + "</span>" +
                "<span class='hl3'>" + offset0.substr(offset0.length - 2) + "</span>";
        } else if (len0 % 4 === 3) {
            staticSection = offset0.slice(0, -2);
            offset0 = "<span data-toggle='tooltip' data-placement='top' title='" +
                Utils.escapeHtml(fromBase64(staticSection, alphabet).slice(0, -1)) + "'>" +
                staticSection + "</span>" +
                "<span class='hl5'>" + offset0.substr(offset0.length - 2, 1) + "</span>" +
                "<span class='hl3'>" + offset0.substr(offset0.length - 1) + "</span>";
        } else {
            staticSection = offset0;
            offset0 = "<span data-toggle='tooltip' data-placement='top' title='" +
                Utils.escapeHtml(fromBase64(staticSection, alphabet)) + "'>" +
                staticSection + "</span>";
        }

        if (!showVariable) {
            offset0 = staticSection;
        }


        // Highlight offset 1
        padding = "<span class='hl3'>" + offset1.substr(0, 1) + "</span>" +
            "<span class='hl5'>" + offset1.substr(1, 1) + "</span>";
        offset1 = offset1.substr(2);
        if (len1 % 4 === 2) {
            staticSection = offset1.slice(0, -3);
            offset1 = padding + "<span data-toggle='tooltip' data-placement='top' title='" +
                Utils.escapeHtml(fromBase64("AA" + staticSection, alphabet).slice(1, -2)) + "'>" +
                staticSection + "</span>" +
                "<span class='hl5'>" + offset1.substr(offset1.length - 3, 1) + "</span>" +
                "<span class='hl3'>" + offset1.substr(offset1.length - 2) + "</span>";
        } else if (len1 % 4 === 3) {
            staticSection = offset1.slice(0, -2);
            offset1 = padding + "<span data-toggle='tooltip' data-placement='top' title='" +
                Utils.escapeHtml(fromBase64("AA" + staticSection, alphabet).slice(1, -1)) + "'>" +
                staticSection + "</span>" +
                "<span class='hl5'>" + offset1.substr(offset1.length - 2, 1) + "</span>" +
                "<span class='hl3'>" + offset1.substr(offset1.length - 1) + "</span>";
        } else {
            staticSection = offset1;
            offset1 = padding +  "<span data-toggle='tooltip' data-placement='top' title='" +
                Utils.escapeHtml(fromBase64("AA" + staticSection, alphabet).slice(1)) + "'>" +
                staticSection + "</span>";
        }

        if (!showVariable) {
            offset1 = staticSection;
        }

        // Highlight offset 2
        padding = "<span class='hl3'>" + offset2.substr(0, 2) + "</span>" +
            "<span class='hl5'>" + offset2.substr(2, 1) + "</span>";
        offset2 = offset2.substr(3);
        if (len2 % 4 === 2) {
            staticSection = offset2.slice(0, -3);
            offset2 = padding + "<span data-toggle='tooltip' data-placement='top' title='" +
                Utils.escapeHtml(fromBase64("AAA" + staticSection, alphabet).slice(2, -2)) + "'>" +
                staticSection + "</span>" +
                "<span class='hl5'>" + offset2.substr(offset2.length - 3, 1) + "</span>" +
                "<span class='hl3'>" + offset2.substr(offset2.length - 2) + "</span>";
        } else if (len2 % 4 === 3) {
            staticSection = offset2.slice(0, -2);
            offset2 = padding + "<span data-toggle='tooltip' data-placement='top' title='" +
                Utils.escapeHtml(fromBase64("AAA" + staticSection, alphabet).slice(2, -2)) + "'>" +
                staticSection + "</span>" +
                "<span class='hl5'>" + offset2.substr(offset2.length - 2, 1) + "</span>" +
                "<span class='hl3'>" + offset2.substr(offset2.length - 1) + "</span>";
        } else {
            staticSection = offset2;
            offset2 = padding +  "<span data-toggle='tooltip' data-placement='top' title='" +
                Utils.escapeHtml(fromBase64("AAA" + staticSection, alphabet).slice(2)) + "'>" +
                staticSection + "</span>";
        }

        if (!showVariable) {
            offset2 = staticSection;
        }

        return (showVariable ? "以 <span class='hl5'>绿色</span> 高亮显示的字符可能会因输入周围数据的变化而改变。" +
            "\n以 <span class='hl3'>红色</span> 高亮显示的字符仅用于填充目的。" +
            "\n未高亮显示的字符是 <span data-toggle='tooltip' data-placement='top' title='Tooltip on left'>静态的</span>。" +
            "\n悬停在静态部分上方可查看它们各自解码后的内容。\n" +
            "\n偏移量 0: " + offset0 +
            "\n偏移量 1: " + offset1 +
            "\n偏移量 2: " + offset2 +
            script :
            offset0 + "\n" + offset1 + "\n" + offset2);
    }

}

export default ShowBase64Offsets;
