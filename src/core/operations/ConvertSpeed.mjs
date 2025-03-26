/**
 * @author n1474335 [n1474335@gmail.com]
 * @translator KUMAKAIHA [kumakaiha@foxmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Convert speed operation
 */
class ConvertSpeed extends Operation {

    /**
     * ConvertSpeed constructor
     */
    constructor() {
        super();

        this.name = "转换速度单位";
        this.module = "Default";
        this.description = "将速度单位转换为另一种格式。";
        this.infoURL = "https://wikipedia.org/wiki/Orders_of_magnitude_(speed)";
        this.inputType = "BigNumber";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "输入单位",
                "type": "option",
                "value": SPEED_UNITS
            },
            {
                "name": "输出单位",
                "type": "option",
                "value": SPEED_UNITS
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

        input = input.times(SPEED_FACTOR[inputUnits]);
        return input.div(SPEED_FACTOR[outputUnits]);
    }

}

const SPEED_UNITS = [
    "[公制]", "米每秒 (m/s)", "千米每小时 (km/h)", "[/公制]",
    "[英制]", "英里每小时 (mph)", "节 (kn)", "[/英制]",
    "[比较]", "人类头发的生长速度", "竹子生长速度", "世界上最快的蜗牛", "尤塞恩·博尔特的最高速度", "喷气式客机巡航速度", "协和飞机", "SR-71 黑鸟", "航天飞机", "国际空间站", "[/比较]",
    "[科学]", "标准大气中的声速", "水中的声速", "月球逃逸速度", "地球逃逸速度", "地球的太阳轨道速度", "太阳系绕银河系轨道速度", "银河系相对于宇宙微波背景的速度", "太阳逃逸速度", "中子星逃逸速度 (0.3c)", "钻石中的光速 (0.4136c)", "光纤中的信号速度 (0.667c)", "光速 (c)", "[/科学]",
];

const SPEED_FACTOR = { // Multiples of m/s
    // Metric
    "Metres per second (m/s)":           1,
    "Kilometres per hour (km/h)":        0.2778,

    // Imperial
    "Miles per hour (mph)":              0.44704,
    "Knots (kn)":                        0.5144,

    // Comparisons
    "Human hair growth rate":            4.8e-9,
    "Bamboo growth rate":                1.4e-5,
    "World's fastest snail":             0.00275,
    "Usain Bolt's top speed":            12.42,
    "Jet airliner cruising speed":       250,
    "Concorde":                          603,
    "SR-71 Blackbird":                   981,
    "Space Shuttle":                     1400,
    "International Space Station":       7700,

    // Scientific
    "Sound in standard atmosphere":      340.3,
    "Sound in water":                    1500,
    "Lunar escape velocity":             2375,
    "Earth escape velocity":             11200,
    "Earth's solar orbit":               29800,
    "Solar system's Milky Way orbit":    200000,
    "Milky Way relative to the cosmic microwave background": 552000,
    "Solar escape velocity":             617700,
    "Neutron star escape velocity (0.3c)": 100000000,
    "Light in a diamond (0.4136c)":      124000000,
    "Signal in an optical fibre (0.667c)": 200000000,
    "Light (c)":                         299792458,
};


export default ConvertSpeed;
