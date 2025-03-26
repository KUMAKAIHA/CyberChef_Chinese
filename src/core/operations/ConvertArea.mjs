/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Convert area operation
 */
class ConvertArea extends Operation {

    /**
     * ConvertArea constructor
     */
    constructor() {
        super();

        this.name = "转换面积单位";
        this.module = "Default";
        this.description = "将面积单位转换为另一种格式。";
        this.infoURL = "https://wikipedia.org/wiki/Orders_of_magnitude_(area)";
        this.inputType = "BigNumber";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "输入单位",
                "type": "option",
                "value": AREA_UNITS
            },
            {
                "name": "输出单位",
                "type": "option",
                "value": AREA_UNITS
            }
        ];
    }

    /**
     * @param {BigNumber} input
     * @param {Object[]} args
     * @returns {BigNumber}
     */
    run(input, args) {
        const [inputUnits, outputUnits] = args;

        input = input.times(AREA_FACTOR[inputUnits]);
        return input.div(AREA_FACTOR[outputUnits]);
    }

}


const AREA_UNITS = [
    "[公制]", "平方米 (sq m)", "平方千米 (sq km)", "厘公亩 (ca)", "十分公亩 (da)", "公亩 (a)", "十公亩 (daa)", "公顷 (ha)", "[/公制]",
    "[英制]", "平方英寸 (sq in)", "平方英尺 (sq ft)", "平方码 (sq yd)", "平方英里 (sq mi)", "杆 (sq per)", "洛德 (ro)", "国际英亩 (ac)", "[/英制]",
    "[美制常用单位]", "美制测量英亩 (ac)", "美制测量平方英里 (sq mi)", "美制测量镇区", "[/美制常用单位]",
    "[核物理学]", "尧库靶恩 (yb)", "泽普托靶恩 (zb)", "阿托靶恩 (ab)", "飞姆托靶恩 (fb)", "皮可靶恩 (pb)", "纳诺靶恩 (nb)", "微靶恩 (μb)", "毫靶恩 (mb)", "靶恩 (b)", "千靶恩 (kb)", "兆靶恩 (Mb)", "外屋", "棚", "普朗克面积", "[/核物理学]",
    "[比较]", "华盛顿特区", "怀特岛", "威尔士", "德克萨斯州", "[/比较]",
];

const AREA_FACTOR = { // Multiples of a square metre
    // Metric
    "平方米 (sq m)":      1,
    "平方千米 (sq km)": 1e6,

    "厘公亩 (ca)":            1,
    "十分公亩 (da)":             10,
    "公亩 (a)":                  100,
    "十公亩 (daa)":             1e3,
    "公顷 (ha)":             1e4,

    // Imperial
    "平方英寸 (sq in)":      0.00064516,
    "平方英尺 (sq ft)":      0.09290304,
    "平方码 (sq yd)":      0.83612736,
    "平方英里 (sq mi)":      2589988.110336,
    "杆 (sq per)":           42.21,
    "洛德 (ro)":                1011,
    "国际英亩 (ac)":  4046.8564224,

    // US customary units
    "美制测量英亩 (ac)":      4046.87261,
    "美制测量平方英里 (sq mi)": 2589998.470305239,
    "美制测量镇区":       93239944.9309886,

    // Nuclear physics
    "尧库靶恩 (yb)":           1e-52,
    "泽普托靶恩 (zb)":           1e-49,
    "阿托靶恩 (ab)":            1e-46,
    "飞姆托靶恩 (fb)":           1e-43,
    "皮可靶恩 (pb)":            1e-40,
    "纳诺靶恩 (nb)":            1e-37,
    "微靶恩 (μb)":           1e-34,
    "毫靶恩 (mb)":           1e-31,
    "靶恩 (b)":                 1e-28,
    "千靶恩 (kb)":            1e-25,
    "兆靶恩 (Mb)":            1e-22,

    "普朗克面积":              2.6e-70,
    "棚":                     1e-52,
    "外屋":                 1e-34,

    // Comparisons
    "华盛顿特区":          176119191.502848,
    "怀特岛":            380000000,
    "威尔士":                    20779000000,
    "德克萨斯州":                    696241000000,
};


export default ConvertArea;
