/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {LETTER_DELIM_OPTIONS, WORD_DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * To Morse Code operation
 */
class ToMorseCode extends Operation {

    /**
     * ToMorseCode constructor
     */
    constructor() {
        super();

        this.name = "转换为 莫尔斯电码";
        this.module = "Default";
        this.description = "将字母数字字符转换为国际摩尔斯电码。<br><br>忽略非摩尔斯电码字符。<br><br>例如：<code>SOS</code> 变为 <code>... --- ...</code>";
        this.infoURL = "https://wikipedia.org/wiki/Morse_code";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "格式选项",
                "type": "option",
                "value": ["-/.", "_/.", "Dash/Dot", "DASH/DOT", "dash/dot"]
            },
            {
                "name": "字母分隔符",
                "type": "option",
                "value": LETTER_DELIM_OPTIONS
            },
            {
                "name": "单词分隔符",
                "type": "option",
                "value": WORD_DELIM_OPTIONS
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const format = args[0].split("/");
        const dash = format[0];
        const dot = format[1];

        const letterDelim = Utils.charRep(args[1]);
        const wordDelim = Utils.charRep(args[2]);

        input = input.split(/\r?\n/);
        input = Array.prototype.map.call(input, function(line) {
            let words = line.split(/ +/);
            words = Array.prototype.map.call(words, function(word) {
                const letters = Array.prototype.map.call(word, function(character) {
                    const letter = character.toUpperCase();
                    if (typeof MORSE_TABLE[letter] == "undefined") {
                        return "";
                    }

                    return MORSE_TABLE[letter];
                });

                return letters.join("<ld>");
            });
            line = words.join("<wd>");
            return line;
        });
        input = input.join("\n");

        input = input.replace(
            /<dash>|<dot>|<ld>|<wd>/g,
            function(match) {
                switch (match) {
                    case "<dash>": return dash;
                    case "<dot>": return dot;
                    case "<ld>": return letterDelim;
                    case "<wd>": return wordDelim;
                }
            }
        );

        return input;
    }

}

const MORSE_TABLE = {
    "A": "<dot><dash>",
    "B": "<dash><dot><dot><dot>",
    "C": "<dash><dot><dash><dot>",
    "D": "<dash><dot><dot>",
    "E": "<dot>",
    "F": "<dot><dot><dash><dot>",
    "G": "<dash><dash><dot>",
    "H": "<dot><dot><dot><dot>",
    "I": "<dot><dot>",
    "J": "<dot><dash><dash><dash>",
    "K": "<dash><dot><dash>",
    "L": "<dot><dash><dot><dot>",
    "M": "<dash><dash>",
    "N": "<dash><dot>",
    "O": "<dash><dash><dash>",
    "P": "<dot><dash><dash><dot>",
    "Q": "<dash><dash><dot><dash>",
    "R": "<dot><dash><dot>",
    "S": "<dot><dot><dot>",
    "T": "<dash>",
    "U": "<dot><dot><dash>",
    "V": "<dot><dot><dot><dash>",
    "W": "<dot><dash><dash>",
    "X": "<dash><dot><dot><dash>",
    "Y": "<dash><dot><dash><dash>",
    "Z": "<dash><dash><dot><dot>",
    "1": "<dot><dash><dash><dash><dash>",
    "2": "<dot><dot><dash><dash><dash>",
    "3": "<dot><dot><dot><dash><dash>",
    "4": "<dot><dot><dot><dot><dash>",
    "5": "<dot><dot><dot><dot><dot>",
    "6": "<dash><dot><dot><dot><dot>",
    "7": "<dash><dash><dot><dot><dot>",
    "8": "<dash><dash><dash><dot><dot>",
    "9": "<dash><dash><dash><dash><dot>",
    "0": "<dash><dash><dash><dash><dash>",
    ".": "<dot><dash><dot><dash><dot><dash>",
    ",": "<dash><dash><dot><dot><dash><dash>",
    ":": "<dash><dash><dash><dot><dot><dot>",
    ";": "<dash><dot><dash><dot><dash><dot>",
    "!": "<dash><dot><dash><dot><dash><dash>",
    "?": "<dot><dot><dash><dash><dot><dot>",
    "'": "<dot><dash><dash><dash><dash><dot>",
    "\"": "<dot><dash><dot><dot><dash><dot>",
    "/": "<dash><dot><dot><dash><dot>",
    "-": "<dash><dot><dot><dot><dot><dash>",
    "+": "<dot><dash><dot><dash><dot>",
    "(": "<dash><dot><dash><dash><dot>",
    ")": "<dash><dot><dash><dash><dot><dash>",
    "@": "<dot><dash><dash><dot><dash><dot>",
    "=": "<dash><dot><dot><dot><dash>",
    "&": "<dot><dash><dot><dot><dot>",
    "_": "<dot><dot><dash><dash><dot><dash>",
    "$": "<dot><dot><dot><dash><dot><dot><dash>",
    " ": "<dot><dot><dot><dot><dot><dot><dot>"
};

export default ToMorseCode;
