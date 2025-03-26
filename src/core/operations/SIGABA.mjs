/**
 * Emulation of the SIGABA machine.
 *
 * @author hettysymes
 * @copyright hettysymes 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {LETTERS} from "../lib/Enigma.mjs";
import {NUMBERS, CR_ROTORS, I_ROTORS, SigabaMachine, CRRotor, IRotor} from "../lib/SIGABA.mjs";

/**
 * Sigaba operation
 */
class Sigaba extends Operation {

    /**
     * Sigaba constructor
     */
    constructor() {
        super();

        this.name = "SIGABA";
        this.module = "Bletchley";
        this.description = "使用二战时期 SIGABA 密码机进行加密/解密。<br><br>SIGABA，也称为 ECM Mark II，在二战期间至 20 世纪 50 年代被美国用于消息加密。它在 20 世纪 30 年代由美国陆军和海军开发，至今仍未被破解。SIGABA 由 15 个转子组成：5 个密码转子和 10 个转子（5 个控制转子和 5 个索引转子），用于控制密码转子的步进。SIGABA 的转子步进比当时的其他转子机器（如 Enigma）复杂得多。所有示例转子绕线均为随机示例集。<br><br>要配置转子绕线，对于密码转子和控制转子，请输入一个字母字符串，该字符串从 A 映射到 Z；对于索引转子，请输入一个数字序列，该序列从 0 映射到 9。请注意，加密与解密不同，因此请先选择所需的模式。<br><br>注意：虽然此工具已针对其他软件模拟器进行了测试，但尚未针对硬件进行测试。";
        this.infoURL = "https://wikipedia.org/wiki/SIGABA";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "第 1 个（左侧）密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 1 个密码转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 1 个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 2 个密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 2 个密码转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 2 个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 3 个（中间）密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 3 个密码转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 3 个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 4 个密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 4 个密码转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 4 个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 5 个（右侧）密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 5 个密码转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 5 个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 1 个（左侧）控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 1 个控制转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 1 个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 2 个控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 2 个控制转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 2 个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 3 个（中间）控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 3 个控制转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 3 个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 4 个控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 4 个控制转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 4 个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 5 个（右侧）控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 5 个控制转子反向",
                type: "boolean",
                value: false
            },
            {
                name: "第 5 个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第 1 个（左侧）索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 1 个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "第 2 个索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 2 个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "第 3 个（中间）索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 3 个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "第 4 个索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 4 个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "第 5 个（右侧）索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第 5 个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "SIGABA 模式",
                type: "option",
                value: ["加密", "解密"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const sigabaSwitch = args[40];
        const cipherRotors = [];
        const controlRotors = [];
        const indexRotors = [];
        for (let i=0; i<5; i++) {
            const rotorWiring = args[i*3];
            cipherRotors.push(new CRRotor(rotorWiring, args[i*3+2], args[i*3+1]));
        }
        for (let i=5; i<10; i++) {
            const rotorWiring = args[i*3];
            controlRotors.push(new CRRotor(rotorWiring, args[i*3+2], args[i*3+1]));
        }
        for (let i=15; i<20; i++) {
            const rotorWiring = args[i*2];
            indexRotors.push(new IRotor(rotorWiring, args[i*2+1]));
        }
        const sigaba = new SigabaMachine(cipherRotors, controlRotors, indexRotors);
        let result;
        if (sigabaSwitch === "加密") {
            result = sigaba.encrypt(input);
        } else if (sigabaSwitch === "解密") {
            result = sigaba.decrypt(input);
        }
        return result;
    }

}
export default Sigaba;
