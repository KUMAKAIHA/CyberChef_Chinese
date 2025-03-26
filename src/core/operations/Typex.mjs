/**
 * Emulation of the Typex machine.
 *
 * Tested against a genuine Typex machine using a variety of inputs
 * and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import {LETTERS, Reflector} from "../lib/Enigma.mjs";
import {ROTORS, REFLECTORS, TypexMachine, Plugboard, Rotor} from "../lib/Typex.mjs";

/**
 * Typex operation
 */
class Typex extends Operation {
    /**
     * Typex constructor
     */
    constructor() {
        super();

        this.name = "Typex";
        this.module = "Bletchley";
        this.description = "使用二战 Typex 机器进行加密/解密。<br><br>Typex 最初由英国皇家空军在二战前建造，基于恩尼格玛密码机，但进行了一些改进，包括使用五个转子、更多步进点和可互换的接线核心。它在英国和英联邦军队中广泛使用。后来出现了一些变体；这里我们模拟二战时期的 Mark 22 Typex，带有用于反射器和输入的插线板。Typex 转子定期更换，且没有公开的；这里提供了一个随机示例集。<br><br>要配置反射器插线板，请在反射器框中输入连接字母对的字符串，例如 `AB CD EF` 将 A 连接到 B，C 连接到 D，E 连接到 F（你需要连接每个字母）。还有一个输入插线板：与恩尼格玛密码机的插线板不同，它不限于成对连接，因此像转子一样输入（无需步进）。要创建你自己的转子，请输入转子将 A 到 Z 映射到的字母，按顺序排列，可以选择后跟 `&lt;` 然后是步进点列表。<br><br>关于恩尼格玛密码机、Typex 和 Bombe 操作的更详细描述<a href='https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex'>可以在这里找到</a>。";
        this.infoURL = "https://wikipedia.org/wiki/Typex";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "第 1 个（左侧）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 1 个转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 1 个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 1 个转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 2 个转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "第 2 个转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 2 个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 2 个转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 3 个（中间）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 2
            },
            {
                name: "第 3 个转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 3 个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 3 个转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 4 个（静态）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 3
            },
            {
                name: "第 4 个转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 4 个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 4 个转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 5 个（右侧，静态）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 4
            },
            {
                name: "第 5 个转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 5 个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 5 个转子初始值",
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
                name: "Typex 键盘模拟",
                type: "option",
                value: ["None", "Encrypt", "Decrypt"]
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
        const reflectorstr = args[20];
        const plugboardstr = args[21];
        const typexKeyboard = args[22];
        const removeOther = args[23];
        const rotors = [];
        for (let i=0; i<5; i++) {
            const [rotorwiring, rotorsteps] = this.parseRotorStr(args[i*4]);
            rotors.push(new Rotor(rotorwiring, rotorsteps, args[i*4 + 1], args[i*4+2], args[i*4+3]));
        }
        // Rotors are handled in reverse
        rotors.reverse();
        const reflector = new Reflector(reflectorstr);
        let plugboardstrMod = plugboardstr;
        if (plugboardstrMod === "") {
            plugboardstrMod = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        const plugboard = new Plugboard(plugboardstrMod);
        if (removeOther) {
            if (typexKeyboard === "Encrypt") {
                input = input.replace(/[^A-Za-z0-9 /%£()',.-]/g, "");
            } else {
                input = input.replace(/[^A-Za-z]/g, "");
            }
        }
        const typex = new TypexMachine(rotors, reflector, plugboard, typexKeyboard);
        let result = typex.crypt(input);
        if (removeOther && typexKeyboard !== "Decrypt") {
            // Five character cipher groups is traditional
            result = result.replace(/([A-Z]{5})(?!$)/g, "$1 ");
        }
        return result;
    }

    /**
     * Highlight Typex
     * This is only possible if we're passing through non-alphabet characters.
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        if (args[18] === false) {
            return pos;
        }
    }

    /**
     * Highlight Typex in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        if (args[18] === false) {
            return pos;
        }
    }

}

export default Typex;
