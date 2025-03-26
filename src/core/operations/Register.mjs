/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Dish from "../Dish.mjs";
import XRegExp from "xregexp";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Register operation
 */
class Register extends Operation {

    /**
     * Register constructor
     */
    constructor() {
        super();

        this.name = "注册";
        this.flowControl = true;
        this.module = "Regex";
        this.description = "从输入中提取数据并存储到寄存器中，这些寄存器随后可以作为参数传递到后续的操作中。使用正则表达式捕获组来选择要提取的数据。<br><br>要在参数中使用寄存器，请使用 <code>$Rn</code> 符号，其中 n 是寄存器号，从 0 开始。<br><br>例如：<br>输入: <code>Test</code><br>提取器: <code>(.*)</code><br>参数: <code>$R0</code> 变为 <code>Test</code><br><br>寄存器可以在参数中使用反斜杠进行转义。例如，<code>\\$R0</code> 将变为 <code>$R0</code> 而不是 <code>Test</code>。";
        this.infoURL = "https://wikipedia.org/wiki/Regular_expression#Syntax";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "提取器",
                "type": "binaryString",
                "value": "([\\s\\S]*)"
            },
            {
                "name": "不区分大小写",
                "type": "boolean",
                "value": true
            },
            {
                "name": "多行匹配",
                "type": "boolean",
                "value": false
            },
            {
                "name": "点号匹配所有字符",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @returns {Object} The updated state of the recipe.
     */
    async run(state) {
        const ings = state.opList[state.progress].ingValues;
        const [extractorStr, i, m, s] = ings;

        let modifiers = "";
        if (i) modifiers += "i";
        if (m) modifiers += "m";
        if (s) modifiers += "s";

        const extractor = new XRegExp(extractorStr, modifiers),
            input = await state.dish.get(Dish.STRING),
            registers = input.match(extractor);

        if (!registers) return state;

        if (isWorkerEnvironment()) {
            self.setRegisters(state.forkOffset + state.progress, state.numRegisters, registers.slice(1));
        }

        /**
         * Replaces references to registers (e.g. $R0) with the contents of those registers.
         *
         * @param {string} str
         * @returns {string}
         */
        function replaceRegister(str) {
            // Replace references to registers ($Rn) with contents of registers
            return str.replace(/(\\*)\$R(\d{1,2})/g, (match, slashes, regNum) => {
                const index = parseInt(regNum, 10) + 1;
                if (index <= state.numRegisters || index >= state.numRegisters + registers.length)
                    return match;
                if (slashes.length % 2 !== 0) return match.slice(1); // Remove escape
                return slashes + registers[index - state.numRegisters];
            });
        }

        // Step through all subsequent ops and replace registers in args with extracted content
        for (let i = state.progress + 1; i < state.opList.length; i++) {
            if (state.opList[i].disabled) continue;

            let args = state.opList[i].ingValues;
            args = args.map(arg => {
                if (typeof arg !== "string" && typeof arg !== "object") return arg;

                if (typeof arg === "object" && Object.prototype.hasOwnProperty.call(arg, "string")) {
                    arg.string = replaceRegister(arg.string);
                    return arg;
                }
                return replaceRegister(arg);
            });
            state.opList[i].ingValues = args;
        }

        state.numRegisters += registers.length - 1;
        return state;
    }

}

export default Register;
