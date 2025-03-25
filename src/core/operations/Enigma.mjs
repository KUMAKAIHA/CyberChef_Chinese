/**
 * Emulation of the Enigma machine.
 *
 * Tested against various genuine Enigma machines using a variety of inputs
 * and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import {ROTORS, LETTERS, ROTORS_FOURTH, REFLECTORS, Rotor, Reflector, Plugboard, EnigmaMachine} from "../lib/Enigma.mjs";

/**
 * Enigma operation
 */
class Enigma extends Operation {
    /**
     * Enigma constructor
     */
    constructor() {
        super();

        this.name = "Enigma";
        this.module = "Bletchley";
        this.description = "使用二战恩尼格玛机进行加密/解密操作。<br><br>恩尼格玛机曾被包括德军在内的多方在二战期间广泛使用，作为便携式密码机，用于保护敏感的军事、外交和商业通信。<br><br>本工具提供了标准的德军转子和反射器配置。要配置插线板，请输入一系列连接的字母对，例如 <code>AB CD EF</code> 表示 A 连接到 B，C 连接到 D，E 连接到 F。这也可用于创建自定义反射器。要创建自定义转子，请输入转子将 A 到 Z 映射到的字母顺序，可选择在后面添加 <code>&lt;</code> 和步进点列表。<br>与真实的恩尼格玛机相比，本工具在转子放置等方面具有相当大的自由度（例如，真实的四转子恩尼格玛机仅使用薄型反射器以及第四槽位的 Beta 或 Gamma 转子）。<br><br>有关恩尼格玛机、Typex 和 Bombe 操作的更详细描述，<a href='https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex'>请点击此处查看</a>。";
        this.infoURL = "https://wikipedia.org/wiki/Enigma_machine";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "型号",
                type: "argSelector",
                value: [
                    {
                        name: "3 转子",
                        off: [1, 2, 3]
                    },
                    {
                        name: "4 转子",
                        on: [1, 2, 3]
                    }
                ]
            },
            {
                name: "最左侧（第 4 个）转子",
                type: "editableOption",
                value: ROTORS_FOURTH,
                defaultIndex: 0
            },
            {
                name: "最左侧转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "最左侧转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "左侧转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "左侧转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "左侧转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "中间转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "中间转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "中间转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "右侧转子",
                type: "editableOption",
                value: ROTORS,
                // Default config is the rotors I-III *left to right*
                defaultIndex: 2
            },
            {
                name: "右侧转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "右侧转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "反射器",
                type: "editableOption",
                value: REFLECTORS
            },
            {
                name: "插线板",
                type: "string",
                value: ""
            },
            {
                name: "严格输出",
                hint: "移除非字母字符并分组输出",
                type: "boolean",
                value: true
            },
        ];
    }

    /**
     * Helper - for ease of use rotors are specified as a single string; this
     * method breaks the spec string into wiring and steps parts.
     *
     * @param {string} rotor - Rotor specification string.
     * @param {number} i - For error messages, the number of this rotor.
     * @returns {string[]}
     */
    parseRotorStr(rotor, i) {
        if (rotor === "") {
            throw new OperationError(`Rotor ${i} must be provided.`);
        }
        if (!rotor.includes("<")) {
            return [rotor, ""];
        }
        return rotor.split("<", 2);
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const model = args[0];
        const reflectorstr = args[13];
        const plugboardstr = args[14];
        const removeOther = args[15];
        const rotors = [];
        for (let i=0; i<4; i++) {
            if (i === 0 && model === "3-rotor") {
                // Skip the 4th rotor settings
                continue;
            }
            const [rotorwiring, rotorsteps] = this.parseRotorStr(args[i*3 + 1], 1);
            rotors.push(new Rotor(rotorwiring, rotorsteps, args[i*3 + 2], args[i*3 + 3]));
        }
        // Rotors are handled in reverse
        rotors.reverse();
        const reflector = new Reflector(reflectorstr);
        const plugboard = new Plugboard(plugboardstr);
        if (removeOther) {
            input = input.replace(/[^A-Za-z]/g, "");
        }
        const enigma = new EnigmaMachine(rotors, reflector, plugboard);
        let result = enigma.crypt(input);
        if (removeOther) {
            // Five character cipher groups is traditional
            result = result.replace(/([A-Z]{5})(?!$)/g, "$1 ");
        }
        return result;
    }

    /**
     * Highlight Enigma
     * This is only possible if we're passing through non-alphabet characters.
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        if (args[13] === false) {
            return pos;
        }
    }

    /**
     * Highlight Enigma in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        if (args[13] === false) {
            return pos;
        }
    }

}

export default Enigma;
