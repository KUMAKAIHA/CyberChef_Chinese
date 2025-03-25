/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

/**
 * 用于处理处理过程计时的等待器。
 */
class TimingWaiter {

    /**
     * TimingWaiter 构造函数。
     *
     * @param {App} app - CyberChef 的主视图对象。
     * @param {Manager} manager - CyberChef 事件管理器。
     */
    constructor(app, manager) {
        this.app = app;
        this.manager = manager;

        this.inputs = {};
        /*
            输入示例：
            "1": {
                "inputEncodingStart": 0,
                "inputEncodingEnd": 0,
                "trigger": 0
                "chefWorkerTasked": 0,
                "bakeComplete": 0,
                "bakeDuration": 0,
                "settingOutput": 0,
                "outputDecodingStart": 0,
                "outputDecodingEnd": 0,
                "complete": 0
            }
        */
    }


    /**
     * 记录输入的耗时
     *
     * @param {string} event
     * @param {number} inputNum
     * @param {number} value
     */
    recordTime(event, inputNum, value=Date.now()) {
        inputNum = inputNum.toString();
        if (!Object.keys(this.inputs).includes(inputNum)) {
            this.inputs[inputNum] = {};
        }
        log.debug(`Recording ${event} for input ${inputNum}`);
        this.inputs[inputNum][event] = value;
    }

    /**
     * 处理主要阶段的耗时
     *
     * @param {number} inputNum
     * @returns {number}
     */
    duration(inputNum) {
        const input = this.inputs[inputNum.toString()];

        // 如果此输入尚未编码，则无法计算时间
        if (!input ||
            !input.trigger ||
            !input.inputEncodingEnd ||
            !input.inputEncodingStart)
            return 0;

        // 输入编码可能在处理触发之前发生，因此单独计算
        const inputEncodingTotal = input.inputEncodingEnd - input.inputEncodingStart;

        let total = 0, outputDecodingTotal = 0;

        if (input.bakeComplete && input.bakeComplete > input.trigger)
            total = input.bakeComplete - input.trigger;

        if (input.settingOutput && input.settingOutput > input.trigger)
            total = input.settingOutput - input.trigger;

        if (input.outputDecodingStart && (input.outputDecodingStart > input.trigger) &&
            input.outputDecodingEnd && (input.outputDecodingEnd > input.trigger)) {
            total = input.outputDecodingEnd - input.trigger;
            outputDecodingTotal = input.outputDecodingEnd - input.outputDecodingStart;
        }

        if (input.complete && input.complete > input.trigger)
            total = inputEncodingTotal + input.bakeDuration + outputDecodingTotal;

        return total;
    }

    /**
     * 已完成处理的总耗时
     *
     * @param {number} inputNum
     * @returns {number}
     */
    overallDuration(inputNum) {
        const input = this.inputs[inputNum.toString()];

        // 如果此输入尚未编码，则无法计算时间
        if (!input ||
            !input.trigger ||
            !input.inputEncodingEnd ||
            !input.inputEncodingStart)
            return 0;

        // 输入编码可能在处理触发之前发生，因此单独计算
        const inputEncodingTotal = input.inputEncodingEnd - input.inputEncodingStart;

        let total = 0;
        if (input.bakeComplete && input.bakeComplete > input.trigger)
            total = input.bakeComplete - input.trigger;

        if (input.settingOutput && input.settingOutput > input.trigger)
            total = input.settingOutput - input.trigger;

        if (input.outputDecodingStart && input.outputDecodingStart > input.trigger)
            total = input.outputDecodingStart - input.trigger;

        if (input.outputDecodingEnd && input.outputDecodingEnd > input.trigger)
            total = input.outputDecodingEnd - input.trigger;

        if (input.complete && input.complete > input.trigger)
            total = input.complete - input.trigger;

        return total + inputEncodingTotal;
    }

    /**
     * 打印阶段之间的时间
     *
     * @param {number} inputNum
     * @returns {string}
     */
    printStages(inputNum) {
        const input = this.inputs[inputNum.toString()];
        if (!input || !input.trigger) return "";

        const total = this.overallDuration(inputNum),
            inputEncoding = input.inputEncodingEnd - input.inputEncodingStart,
            outputDecoding = input.outputDecodingEnd - input.outputDecodingStart,
            overhead = total - inputEncoding - outputDecoding - input.bakeDuration;

        return `输入编码：${inputEncoding}ms
配方时长：${input.bakeDuration}ms
输出解码：${outputDecoding}ms
<span class="small">线程开销：${overhead}ms</span>`;
    }

    /**
     * 记录每个时间间隔
     *
     * @param {number} inputNum
     */
    logAllTimes(inputNum) {
        const input = this.inputs[inputNum.toString()];
        if (!input || !input.trigger) return;

        try {
            log.debug(`Trigger:             ${input.trigger}
inputEncodingStart:  ${input.inputEncodingStart} | ${input.inputEncodingStart - input.trigger}ms since trigger
inputEncodingEnd:    ${input.inputEncodingEnd} | ${input.inputEncodingEnd - input.inputEncodingStart}ms input encoding time
chefWorkerTasked:    ${input.chefWorkerTasked} | ${input.chefWorkerTasked - input.trigger}ms since trigger
bakeDuration:                      | ${input.bakeDuration}ms duration in worker
bakeComplete:        ${input.bakeComplete} | ${input.bakeComplete - input.chefWorkerTasked}ms since worker tasked
settingOutput:       ${input.settingOutput} | ${input.settingOutput - input.bakeComplete}ms since worker finished
outputDecodingStart: ${input.outputDecodingStart} | ${input.outputDecodingStart - input.settingOutput}ms since output set
outputDecodingEnd:   ${input.outputDecodingEnd} | ${input.outputDecodingEnd - input.outputDecodingStart}ms output encoding time
complete:            ${input.complete} | ${input.complete - input.outputDecodingEnd}ms since output decoded
Total:                             | ${input.complete - input.trigger}ms since trigger`);
        } catch (err) {}

    }

}

export default TimingWaiter;
