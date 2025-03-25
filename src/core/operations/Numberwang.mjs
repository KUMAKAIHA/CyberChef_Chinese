/**
 * @author Unknown Male 282
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Numberwang operation. Remain indoors.
 */
class Numberwang extends Operation {

    /**
     * Numberwang constructor
     */
    constructor() {
        super();

        this.name = "Numberwang";
        this.module = "Default";
        this.description = "基于 Mitchell 和 Webb 的热门游戏节目。";
        this.infoURL = "https://wikipedia.org/wiki/That_Mitchell_and_Webb_Look#Recurring_sketches";
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
        let output;
        if (!input) {
            output = "我们来玩 Wangernumb 吧！";
        } else {
            const match = input.match(/(f0rty-s1x|shinty-six|filth-hundred and neeb|-?√?\d+(\.\d+)?i?([a-z]?)%?)/i);
            if (match) {
                if (match[3]) output = match[0] + "! 这是 AlphaNumericWang！";
                else output = match[0] + "! 这是 Numberwang！";
            } else {
                // That's a bad miss!
                output = "抱歉，这不是 Numberwang。我们来转动一下面板！";
            }
        }

        const rand = Math.floor(Math.random() * didYouKnow.length);
        return output + "\n\n你知道吗： " + didYouKnow[rand];
    }

}

/**
 * Taken from http://numberwang.wikia.com/wiki/Numberwang_Wikia
 *
 * @constant
 */
const didYouKnow = [
    "Numberwang，与普遍看法相反，是一种水果，而不是蔬菜。",
    "Robert Webb 在主持一集 Numberwang 节目时，曾经得到了 WordWang。",
    "圆周率的第 6705 位数字是 Numberwang。",
    "Numberwang 是在一个 Sevenday 被发明的。",
    "与普遍看法相反，阿尔伯特·爱因斯坦在学校的 Numberwang 考试中总是取得好成绩。他曾经在一个测试中得了 ^4$ 分。",
    "680 颗小行星以 Numberwang 命名。",
    "阿基米德最出名的是在他洗澡时顿悟了关于排水量的原理，并高呼“那是 Numberwang！”。",
    "在日本，除了 6 月 6 日之外，每一年中的每一天都庆祝 Numberwang 日。",
    "生物学家最近在人类 DNA 链中发现了 Numberwang。",
    "Numbernot 是一种特殊的非 Numberwang 数字。它可以被 3 和字母“y”整除。",
    "Julie 曾经在《Emmerdale》的一集中得到了 612.04 个 Numberwang。",
    "在印度，在国际象棋比赛中，传统上会喊出“Numberwang！”而不是“将军”。",
    "《倒计时》中有一条规则规定，如果你在数字回合中得到 Numberwang，你将自动获胜。这种情况只发生过两次。",
    "“Numberwang”在 1722 年的短暂时期内是第三大常见的婴儿名字。",
    "《狮子王》大致基于 Numberwang。",
    "“一天一个 Numberwang，医生远离我”是世界上最长寿的人 Donny Cosy 解释他如何在 136 岁时仍然如此健康的方式。",
    "键盘上的“数字锁定”按钮是基于“Numberwang”中同名的流行回合。",
    "剑桥大学在 1567 年成为第一所提供 Numberwang 课程的大学。",
    "薛定谔的 Numberwang 是一个几个世纪以来一直困扰牙医的数字。",
    "《哈利·波特与 Numberwang 的 Numberwang》在成为畅销书之前被出版商拒绝了 -41 次。",
    "“Numberwang”是英国历史上播出时间最长的游戏节目；它已经播出了 226 季，每季包含 19 集，总共 132 集。",
    "三重 Numberwang 奖金是由考古学家托马斯·杰斐逊在萨默塞特发现的。",
    "Numberwang 在捷克斯洛伐克部分地区是非法的。",
    "Numberwang 在 12 世纪在印度被发现。",
    "Numberwang 的化学式为 Zn4SO2(HgEs)3。",
    "有史以来创建的第一副扑克牌以两张“Numberwang”牌代替了小丑牌。",
    "尤利乌斯·凯撒死于 Numberwang 过量。",
    "最 Numberwang 的音符是 G#。",
    "在 1934 年，第四十三个 Google Doodle 推广了即将播出的电视节目“冰上 Numberwang”。",
    "最近的一项心理学研究发现，幼儿识别 Numberwang 数字的速度快了 17%。",
    "在电视节目“Numberwang”中有 700 种犯规的方式。所有这 700 种犯规都是由 Julie 在 1473 年的单集节目中犯下的。",
    "天文学家怀疑上帝是 Numberwang。",
    "Numberwang 是加拿大的官方饮料。",
    "在“The Price is Right”的试播集中，如果参赛者完全猜对了物品的价值，他们会被告知“那是 Numberwang！”并立即赢得 5.7032 卢比。",
    "第一个连续获得三个 Numberwang 的人是麦当娜。",
    "“Numberwang”在 Unicode 中的代码是 U+46402。",
    "音符“Numberwang”介于 D# 和 E♮ 之间。",
    "Numberwang 于 1834 年首次在月球上玩。",
];

export default Numberwang;
