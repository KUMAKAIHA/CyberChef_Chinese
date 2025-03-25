/**
 * Emulation of the Lorenz SZ40/42a/42b cipher attachment.
 *
 * Tested against the Colossus Rebuild at Bletchley Park's TNMOC
 * using a variety of inputs and settings to confirm correctness.
 *
 * @author VirtualColossus [martin@virtualcolossus.co.uk]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Lorenz operation
 */
class Lorenz extends Operation {

    /**
     * Lorenz constructor
     */
    constructor() {
        super();

        this.name = "Lorenz";
        this.module = "Bletchley";
        this.description = "Lorenz SZ40/42 密码机附件是二战时期德国的转子密码机，带有十二个转子，以内联方式连接在远程电传打字机之间。<br><br>它使用 Vernam 密码，带有两组五个转子（在布莱切利公园分别称为 psi(ψ) 轮和 chi(χ) 轮），以创建两个伪随机的五位比特流，以 ITA2 编码，并与明文进行异或运算。另外两个转子，称为 mu(μ) 或电机轮，可以保持 psi 轮的步进，意味着它们是间歇性步进的。<br><br>每个转子在其圆周周围具有不同数量的凸轮/突耳，可以设置为活动或非活动状态，从而改变密钥流。<br><br>模拟了三种型号的 Lorenz 密码机：SZ40、SZ42a 和 SZ42b，并包括了三种示例轮型模式（突耳设置）（KH、ZMUG 和 BREAM），可以选择使用字母 'x' 表示活动突耳，'.' 表示非活动突耳来设置自定义模式。<br><br>输入可以是发送时的明文或 ITA2，以及接收时的 ITA2。<br><br>要了解更多信息，请访问 Virtual Lorenz，这是一个在线的、基于浏览器的 Lorenz SZ40/42 模拟器：<a href='https://lorenz.virtualcolossus.co.uk' target='_blank'>lorenz.virtualcolossus.co.uk</a>。<br><br>关于此操作的更详细描述，请访问 <a href='https://github.com/gchq/CyberChef/wiki/Lorenz-SZ' target='_blank'>here</a>。";
        this.infoURL = "https://wikipedia.org/wiki/Lorenz_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "型号",
                type: "option",
                value: ["SZ40", "SZ42a", "SZ42b"]
            },
            {
                name: "轮型模式",
                type: "argSelector",
                value: [
                    {
                        name: "KH 模式",
                        off: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    },
                    {
                        name: "ZMUG 模式",
                        off: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    },
                    {
                        name: "BREAM 模式",
                        off: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    },
                    {
                        name: "无模式",
                        off: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    },
                    {
                        name: "自定义",
                        on: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    }
                ]
            },
            {
                name: "KT-Schalter",
                type: "boolean",
                value: false
            },
            {
                name: "模式",
                type: "argSelector",
                value: [
                    {
                        name: "发送",
                        on: [4],
                        off: [5]
                    },
                    {
                        name: "接收",
                        off: [4],
                        on: [5]
                    }
                ]
            },
            {
                name: "输入类型",
                type: "option",
                value: ["Plaintext", "ITA2"]
            },
            {
                name: "输出类型",
                type: "option",
                value: ["Plaintext", "ITA2"]
            },
            {
                name: "ITA2 格式",
                type: "option",
                value: ["5/8/9", "+/-/."]
            },
            {
                name: "Ψ1 起始位置 (1-43)",
                type: "number",
                value: 1
            },
            {
                name: "Ψ2 起始位置 (1-47)",
                type: "number",
                value: 1
            },
            {
                name: "Ψ3 起始位置 (1-51)",
                type: "number",
                value: 1
            },
            {
                name: "Ψ4 起始位置 (1-53)",
                type: "number",
                value: 1
            },
            {
                name: "Ψ5 起始位置 (1-59)",
                type: "number",
                value: 1
            },
            {
                name: "Μ37 起始位置 (1-37)",
                type: "number",
                value: 1
            },
            {
                name: "Μ61 起始位置 (1-61)",
                type: "number",
                value: 1
            },
            {
                name: "Χ1 起始位置 (1-41)",
                type: "number",
                value: 1
            },
            {
                name: "Χ2 起始位置 (1-31)",
                type: "number",
                value: 1
            },
            {
                name: "Χ3 起始位置 (1-29)",
                type: "number",
                value: 1
            },
            {
                name: "Χ4 起始位置 (1-26)",
                type: "number",
                value: 1
            },
            {
                name: "Χ5 起始位置 (1-23)",
                type: "number",
                value: 1
            },
            {
                name: "Ψ1 凸轮 (43)",
                type: "string",
                value: ".x...xx.x.x..xxx.x.x.xxxx.x.x.x.x.x..x.xx.x"
            },
            {
                name: "Ψ2 凸轮 (47)",
                type: "string",
                value: ".xx.x.xxx..x.x.x..x.xx.x.xxx.x....x.xx.x.x.x..x"
            },
            {
                name: "Ψ3 凸轮 (51)",
                type: "string",
                value: ".x.x.x..xxx....x.x.xx.x.x.x..xxx.x.x..x.x.xx..x.x.x"
            },
            {
                name: "Ψ4 凸轮 (53)",
                type: "string",
                value: ".xx...xxxxx.x.x.xx...x.xx.x.x..x.x.xx.x..x.x.x.x.x.x."
            },
            {
                name: "Ψ5 凸轮 (59)",
                type: "string",
                value: "xx...xx.x..x.xx.x...x.x.x.x.x.x.x.x.xx..xxxx.x.x...xx.x..x."
            },
            {
                name: "Μ37 凸轮 (37)",
                type: "string",
                value: "x.x.x.x.x.x...x.x.x...x.x.x...x.x...."
            },
            {
                name: "Μ61 凸轮 (61)",
                type: "string",
                value: ".xxxx.xxxx.xxx.xxxx.xx....xxx.xxxx.xxxx.xxxx.xxxx.xxx.xxxx..."
            },
            {
                name: "Χ1 凸轮 (41)",
                type: "string",
                value: ".x...xxx.x.xxxx.x...x.x..xxx....xx.xxxx.."
            },
            {
                name: "Χ2 凸轮 (31)",
                type: "string",
                value: "x..xxx...x.xxxx..xx..x..xx.xx.."
            },
            {
                name: "Χ3 凸轮 (29)",
                type: "string",
                value: "..xx..x.xxx...xx...xx..xx.xx."
            },
            {
                name: "Χ4 凸轮 (26)",
                type: "string",
                value: "xx..x..xxxx..xx.xxx....x.."
            },
            {
                name: "Χ5 凸轮 (23)",
                type: "string",
                value: "xx..xx....xxxx.x..x.x.."
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {

        const model = args[0],
            pattern = args[1],
            kt = args[2],
            mode = args[3],
            intype = args[4],
            outtype = args[5],
            format = args[6],
            lugs1 = args[19],
            lugs2 = args[20],
            lugs3 = args[21],
            lugs4 = args[22],
            lugs5 = args[23],
            lugm37 = args[24],
            lugm61 = args[25],
            lugx1 = args[26],
            lugx2 = args[27],
            lugx3 = args[28],
            lugx4 = args[29],
            lugx5 = args[30];

        let s1 = args[7],
            s2 = args[8],
            s3 = args[9],
            s4 = args[10],
            s5 = args[11],
            m37 = args[12],
            m61 = args[13],
            x1 = args[14],
            x2 = args[15],
            x3 = args[16],
            x4 = args[17],
            x5 = args[18];

        this.reverseTable();

        if (s1<1 || s1>43) throw new OperationError("Ψ1 start must be between 1 and 43");
        if (s2<1 || s2>47) throw new OperationError("Ψ2 start must be between 1 and 47");
        if (s3<1 || s3>51) throw new OperationError("Ψ3 start must be between 1 and 51");
        if (s4<1 || s4>53) throw new OperationError("Ψ4 start must be between 1 and 53");
        if (s5<1 || s5>59) throw new OperationError("Ψ5 start must be between 1 and 59");
        if (m37<1 || m37>37) throw new OperationError("Μ37 start must be between 1 and 37");
        if (m61<1 || m61>61) throw new OperationError("Μ61 start must be between 1 and 61");
        if (x1<1 || x1>41) throw new OperationError("Χ1 start must be between 1 and 41");
        if (x2<1 || x2>31) throw new OperationError("Χ2 start must be between 1 and 31");
        if (x3<1 || x3>29) throw new OperationError("Χ3 start must be between 1 and 29");
        if (x4<1 || x4>26) throw new OperationError("Χ4 start must be between 1 and 26");
        if (x5<1 || x5>23) throw new OperationError("Χ5 start must be between 1 and 23");

        // Initialise chosen wheel pattern
        let chosenSetting = "";
        if (pattern === "Custom") {
            const re = new RegExp("^[.xX]*$");
            if (lugs1.length !== 43 || !re.test(lugs1)) throw new OperationError("Ψ1 custom lugs must be 43 long and can only include . or x ");
            if (lugs2.length !== 47 || !re.test(lugs2)) throw new OperationError("Ψ2 custom lugs must be 47 long and can only include . or x");
            if (lugs3.length !== 51 || !re.test(lugs3)) throw new OperationError("Ψ3 custom lugs must be 51 long and can only include . or x");
            if (lugs4.length !== 53 || !re.test(lugs4)) throw new OperationError("Ψ4 custom lugs must be 53 long and can only include . or x");
            if (lugs5.length !== 59 || !re.test(lugs5)) throw new OperationError("Ψ5 custom lugs must be 59 long and can only include . or x");
            if (lugm37.length !== 37 || !re.test(lugm37)) throw new OperationError("M37 custom lugs must be 37 long and can only include . or x");
            if (lugm61.length !== 61 || !re.test(lugm61)) throw new OperationError("M61 custom lugs must be 61 long and can only include . or x");
            if (lugx1.length !== 41 || !re.test(lugx1)) throw new OperationError("Χ1 custom lugs must be 41 long and can only include . or x");
            if (lugx2.length !== 31 || !re.test(lugx2)) throw new OperationError("Χ2 custom lugs must be 31 long and can only include . or x");
            if (lugx3.length !== 29 || !re.test(lugx3)) throw new OperationError("Χ3 custom lugs must be 29 long and can only include . or x");
            if (lugx4.length !== 26 || !re.test(lugx4)) throw new OperationError("Χ4 custom lugs must be 26 long and can only include . or x");
            if (lugx5.length !== 23 || !re.test(lugx5)) throw new OperationError("Χ5 custom lugs must be 23 long and can only include . or x");
            chosenSetting = INIT_PATTERNS["No Pattern"];
            chosenSetting.S[1] = this.readLugs(lugs1);
            chosenSetting.S[2] = this.readLugs(lugs2);
            chosenSetting.S[3] = this.readLugs(lugs3);
            chosenSetting.S[4] = this.readLugs(lugs4);
            chosenSetting.S[5] = this.readLugs(lugs5);
            chosenSetting.M[1] = this.readLugs(lugm61);
            chosenSetting.M[2] = this.readLugs(lugm37);
            chosenSetting.X[1] = this.readLugs(lugx1);
            chosenSetting.X[2] = this.readLugs(lugx2);
            chosenSetting.X[3] = this.readLugs(lugx3);
            chosenSetting.X[4] = this.readLugs(lugx4);
            chosenSetting.X[5] = this.readLugs(lugx5);
        } else {
            chosenSetting = INIT_PATTERNS[pattern];
        }
        const chiSettings = chosenSetting.X; // Pin settings for Chi links (X)
        const psiSettings = chosenSetting.S; // Pin settings for Psi links (S)
        const muSettings = chosenSetting.M; // Pin settings for Motor links (M)

        // Convert input text to ITA2 (including figure/letter shifts)
        const ita2Input = this.convertToITA2(input, intype, mode);

        let thisPsi = [];
        let thisChi = [];
        let m61lug = muSettings[1][m61-1];
        let m37lug = muSettings[2][m37-1];
        const p5 = [0, 0, 0];

        const self = this;
        const letters = Array.prototype.map.call(ita2Input, function(character) {
            const letter = character.toUpperCase();

            // Store lugs used in limitations, need these later
            let x2bptr = x2+1;
            if (x2bptr===32) x2bptr=1;
            let s1bptr = s1+1;
            if (s1bptr===44) s1bptr=1;

            thisChi = [
                chiSettings[1][x1-1],
                chiSettings[2][x2-1],
                chiSettings[3][x3-1],
                chiSettings[4][x4-1],
                chiSettings[5][x5-1]
            ];

            thisPsi = [
                psiSettings[1][s1-1],
                psiSettings[2][s2-1],
                psiSettings[3][s3-1],
                psiSettings[4][s4-1],
                psiSettings[5][s5-1]
            ];

            if (typeof ITA2_TABLE[letter] == "undefined") {
                return "";
            }

            // The encipher calculation

            // We calculate Bitwise XOR for each of the 5 bits across our input ( K XOR Psi XOR Chi )
            const xorSum = [];
            for (let i=0;i<=4;i++) {
                xorSum[i] = ITA2_TABLE[letter][i] ^ thisPsi[i] ^ thisChi[i];
            }
            const resultStr = xorSum.join("");

            // Wheel movement

            // Chi wheels always move one back after each letter
            if (--x1 < 1) x1 = 41;
            if (--x2 < 1) x2 = 31;
            if (--x3 < 1) x3 = 29;
            if (--x4 < 1) x4 = 26;
            if (--x5 < 1) x5 = 23;

            // Motor wheel (61 pin) also moves one each letter
            if (--m61 < 1) m61 = 61;

            // If M61 is set, we also move M37
            if (m61lug === 1) {
                if (--m37 < 1) m37 = 37;
            }

            // Psi wheels only move sometimes, dependent on M37 current setting and limitations

            const basicmotor = m37lug;
            let totalmotor;
            let lim = 0;

            p5[2] = p5[1];
            p5[1] = p5[0];
            if (mode==="Send") {
                p5[0] = parseInt(ITA2_TABLE[letter][4], 10);
            } else {
                p5[0] = parseInt(xorSum[4], 10);
            }

            // Limitations here
            if (model==="SZ42a") {
                // Chi 2 one back lim - The active character of Chi 2 (2nd Chi wheel) in the previous position
                lim = parseInt(chiSettings[2][x2bptr-1], 10);
                if (kt) {
                    // p5 back 2
                    if (lim===p5[2]) {
                        lim = 0;
                    } else {
                        lim=1;
                    }
                }

                // If basic motor = 0 and limitation = 1, Total motor = 0 [no move], otherwise, total motor = 1 [move]
                if (basicmotor===0 && lim===1) {
                    totalmotor = 0;
                } else {
                    totalmotor = 1;
                }

            } else if (model==="SZ42b") {
                // Chi 2 one back + Psi 1 one back.
                const x2b1lug = parseInt(chiSettings[2][x2bptr-1], 10);
                const s1b1lug = parseInt(psiSettings[1][s1bptr-1], 10);
                lim = 1;
                if (x2b1lug===s1b1lug) lim=0;
                if (kt) {
                     // p5 back 2
                    if (lim===p5[2]) {
                        lim=0;
                    } else {
                        lim=1;
                    }
                }
                // If basic motor = 0 and limitation = 1, Total motor = 0 [no move], otherwise, total motor = 1 [move]
                if (basicmotor===0 && lim===1) {
                    totalmotor = 0;
                } else {
                    totalmotor = 1;
                }

            } else if (model==="SZ40") {
                // SZ40 - just move based on the M37 motor wheel
                totalmotor = basicmotor;
            } else {
                throw new OperationError("Lorenz model type not recognised");
            }

            // Move the Psi wheels when current totalmotor active
            if (totalmotor === 1) {
                if (--s1 < 1) s1 = 43;
                if (--s2 < 1) s2 = 47;
                if (--s3 < 1) s3 = 51;
                if (--s4 < 1) s4 = 53;
                if (--s5 < 1) s5 = 59;
            }

            m61lug = muSettings[1][m61-1];
            m37lug = muSettings[2][m37-1];

            let rtnstr = self.REVERSE_ITA2_TABLE[resultStr];
            if (format==="5/8/9") {
                if (rtnstr==="+") rtnstr="5"; // + or 5 used to represent figure shift
                if (rtnstr==="-") rtnstr="8"; // - or 8 used to represent letter shift
                if (rtnstr===".") rtnstr="9"; // . or 9 used to represent space
            }
            return rtnstr;
        });

        const ita2output = letters.join("");

        return this.convertFromITA2(ita2output, outtype, mode);

    }

    /**
     * Reverses the ITA2 Code lookup table
     */
    reverseTable() {
        this.REVERSE_ITA2_TABLE = {};
        this.REVERSE_FIGSHIFT_TABLE = {};

        for (const letter in ITA2_TABLE) {
            const code = ITA2_TABLE[letter];
            this.REVERSE_ITA2_TABLE[code] = letter;
        }
        for (const letter in figShiftArr) {
            const ltr = figShiftArr[letter];
            this.REVERSE_FIGSHIFT_TABLE[ltr] = letter;
        }
    }

    /**
     * Read lugs settings - convert to 0|1
     */
    readLugs(lugstr) {
        const arr = Array.prototype.map.call(lugstr, function(lug) {
            if (lug===".") {
                return 0;
            } else {
                return 1;
            }
        });
        return arr;
    }

    /**
     * Convert input plaintext to ITA2
     */
    convertToITA2(input, intype, mode) {
        let result = "";
        let figShifted = false;

        for (const character of input) {
            const letter = character.toUpperCase();

            // Convert input text to ITA2 (including figure/letter shifts)
            if (intype === "ITA2" || mode === "Receive") {
                if (validITA2.indexOf(letter) === -1) {
                    let errltr = letter;
                    if (errltr==="\n") errltr = "Carriage Return";
                    if (errltr===" ") errltr = "Space";
                    throw new OperationError("Invalid ITA2 character : "+errltr);
                }
                result += letter;
            } else {
                if (validChars.indexOf(letter) === -1) throw new OperationError("Invalid Plaintext character : "+letter);

                if (!figShifted && figShiftedChars.indexOf(letter) !== -1) {
                    // in letters mode and next char needs to be figure shifted
                    figShifted = true;
                    result += "55" + figShiftArr[letter];
                } else if (figShifted) {
                    // in figures mode and next char needs to be letter shifted
                    if (letter==="\n") {
                        result += "34";
                    } else if (letter==="\r") {
                        result += "4";
                    } else if (figShiftedChars.indexOf(letter) === -1) {
                        figShifted = false;
                        result += "88" + letter;
                    } else {
                        result += figShiftArr[letter];
                    }

                } else {
                    if (letter==="\n") {
                        result += "34";
                    } else if (letter==="\r") {
                        result += "4";
                    } else {
                        result += letter;
                    }
                }

            }

        }

        return result;
    }

    /**
     * Convert final result ITA2 to plaintext
     */
    convertFromITA2(input, outtype, mode) {
        let result = "";
        let figShifted = false;
        for (const letter of input) {
            if (mode === "Receive") {

                // Convert output ITA2 to plaintext (including figure/letter shifts)
                if (outtype === "Plaintext") {

                    if (letter === "5" || letter === "+") {
                        figShifted = true;
                    } else if (letter === "8" || letter === "-") {
                        figShifted = false;
                    } else if (letter === "9") {
                        result += " ";
                    } else if (letter === "3") {
                        result += "\n";
                    } else if (letter === "4") {
                        result += "";
                    } else if (letter === "/") {
                        result += "/";
                    } else {

                        if (figShifted) {
                            result += this.REVERSE_FIGSHIFT_TABLE[letter];
                        } else {
                            result += letter;
                        }

                    }

                } else {
                    result += letter;
                }

            } else {
                result += letter;
            }
        }

        return result;

    }

}

const ITA2_TABLE = {
    "A": "11000",
    "B": "10011",
    "C": "01110",
    "D": "10010",
    "E": "10000",
    "F": "10110",
    "G": "01011",
    "H": "00101",
    "I": "01100",
    "J": "11010",
    "K": "11110",
    "L": "01001",
    "M": "00111",
    "N": "00110",
    "O": "00011",
    "P": "01101",
    "Q": "11101",
    "R": "01010",
    "S": "10100",
    "T": "00001",
    "U": "11100",
    "V": "01111",
    "W": "11001",
    "X": "10111",
    "Y": "10101",
    "Z": "10001",
    "3": "00010",
    "4": "01000",
    "9": "00100",
    "/": "00000",
    " ": "00100",
    ".": "00100",
    "8": "11111",
    "5": "11011",
    "-": "11111",
    "+": "11011"
};

const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890+-'()/:=?,. \n\r";
const validITA2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ34589+-./";
const figShiftedChars = "1234567890+-'()/:=?,.";

const figShiftArr = {
    "1": "Q",
    "2": "W",
    "3": "E",
    "4": "R",
    "5": "T",
    "6": "Y",
    "7": "U",
    "8": "I",
    "9": "O",
    "0": "P",
    " ": "9",
    "-": "A",
    "?": "B",
    ":": "C",
    "#": "D",
    "%": "F",
    "@": "G",
    "£": "H",
    "": "J",
    "(": "K",
    ")": "L",
    ".": "M",
    ",": "N",
    "'": "S",
    "=": "V",
    "/": "X",
    "+": "Z",
    "\n": "3",
    "\r": "4"
};

const INIT_PATTERNS = {
    "No Pattern": {
        "X": {
            1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "S": {
            1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "M": {
            1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }

    },
    "KH Pattern": {
        "X": {
            1: [0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0],
            2: [1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0],
            3: [0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
            4: [1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0],
            5: [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0]
        },
        "S": {
            1: [0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
            2: [0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
            3: [0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1],
            4: [0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            5: [1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0]
        },
        "M":  {
            1: [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0],
            2: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]
        }
    },
    "ZMUG Pattern":  {
        "X": {
            1: [0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0],
            2: [1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
            3: [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0],
            4: [1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1],
            5: [0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1]
        },
        "S": {
            1: [1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0],
            2: [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1],
            3: [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
            4: [0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1],
            5: [1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0]
        },
        "M": {
            1: [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            2: [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1]
        }
    },
    "BREAM Pattern": {
        "X": {
            1: [0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            2: [0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1],
            3: [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0],
            4: [1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0],
            5: [0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0]
        },
        "S": {
            1: [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
            2: [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0],
            3: [1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            4: [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
            5: [1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
        },
        "M": {
            1: [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1],
            2: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1]
        }
    }
};

export default Lorenz;
