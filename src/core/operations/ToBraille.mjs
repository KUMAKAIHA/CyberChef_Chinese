/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {BRAILLE_LOOKUP} from "../lib/Braille.mjs";

/**
 * To Braille operation
 */
class ToBraille extends Operation {

    /**
     * ToBraille constructor
     */
    constructor() {
        super();

        this.name = "转换为 盲文";
        this.module = "Default";
        this.description = "将文本转换为六点盲文符号。";
        this.infoURL = "https://wikipedia.org/wiki/Braille";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return input.split("").map(c => {
            const idx = BRAILLE_LOOKUP.ascii.indexOf(c.toUpperCase());
            return idx < 0 ? c : BRAILLE_LOOKUP.dot6[idx];
        }).join("");
    }

    /**
     * Highlight To Braille
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight To Braille in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default ToBraille;
