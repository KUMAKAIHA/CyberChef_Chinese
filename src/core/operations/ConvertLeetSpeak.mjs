/**
 * @author bartblaze []
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Convert Leet Speak operation
 */
class ConvertLeetSpeak extends Operation {
    /**
     * ConvertLeetSpeak constructor
     */
    constructor() {
        super();

        this.name = "转换 Leet Speak";
        this.module = "Default";
        this.description = "转换为和从 Leet Speak 转换。";
        this.infoURL = "https://wikipedia.org/wiki/Leet";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "方向",
                type: "option",
                value: ["转换为 Leet Speak", "从 Leet Speak 转换"],
                defaultIndex: 0
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const direction = args[0];

        if (direction === "转换为 Leet Speak") {
            return input.replace(/[a-z]/gi, char => {
                const leetChar = toLeetMap[char.toLowerCase()] || char;
                return char === char.toUpperCase() ? leetChar.toUpperCase() : leetChar;
            });
        } else if (direction === "从 Leet Speak 转换") {
            return input.replace(/[48cd3f6h1jklmn0pqr57uvwxyz]/gi, char => {
                const normalChar = fromLeetMap[char] || char;
                return normalChar;
            });
        }
    }
}

const toLeetMap = {
    "a": "4",
    "b": "b",
    "c": "c",
    "d": "d",
    "e": "3",
    "f": "f",
    "g": "g",
    "h": "h",
    "i": "1",
    "j": "j",
    "k": "k",
    "l": "l",
    "m": "m",
    "n": "n",
    "o": "0",
    "p": "p",
    "q": "q",
    "r": "r",
    "s": "5",
    "t": "7",
    "u": "u",
    "v": "v",
    "w": "w",
    "x": "x",
    "y": "y",
    "z": "z"
};

const fromLeetMap = {
    "4": "a",
    "b": "b",
    "c": "c",
    "d": "d",
    "3": "e",
    "f": "f",
    "g": "g",
    "h": "h",
    "1": "i",
    "j": "j",
    "k": "k",
    "l": "l",
    "m": "m",
    "n": "n",
    "0": "o",
    "p": "p",
    "q": "q",
    "r": "r",
    "5": "s",
    "7": "t",
    "u": "u",
    "v": "v",
    "w": "w",
    "x": "x",
    "y": "y",
    "z": "z"
};

export default ConvertLeetSpeak;
