/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import * as d3temp from "d3";
import * as nodomtemp from "nodom";

import Operation from "../Operation.mjs";

const d3 = d3temp.default ? d3temp.default : d3temp;
const nodom = nodomtemp.default ? nodomtemp.default: nodomtemp;

/**
 * Entropy operation
 */
class Entropy extends Operation {

    /**
     * Entropy constructor
     */
    constructor() {
        super();

        this.name = "熵";
        this.module = "Charts";
        this.description = "香农熵在信息论中，是衡量数据源产生信息速率的指标。广义上，它可以用来检测数据是否可能为结构化或非结构化。8 是最大值，代表高度非结构化的“随机”数据。英文文本通常介于 3.5 和 5 之间。经过适当加密或压缩的数据，熵值应超过 7.5。";
        this.infoURL = "https://wikipedia.org/wiki/Entropy_(information_theory)";
        this.inputType = "ArrayBuffer";
        this.outputType = "json";
        this.presentType = "html";
        this.args = [
            {
                "name": "可视化",
                "type": "option",
                "value": ["香农尺度", "柱状图 (柱形)", "柱状图 (折线)", "曲线", "图像"]
            }
        ];
    }

    /**
     * Calculates the frequency of bytes in the input.
     *
     * @param {Uint8Array} input
     * @returns {number}
     */
    calculateShannonEntropy(input) {
        const prob = [],
            occurrences = new Array(256).fill(0);

        // Count occurrences of each byte in the input
        let i;
        for (i = 0; i < input.length; i++) {
            occurrences[input[i]]++;
        }

        // Store probability list
        for (i = 0; i < occurrences.length; i++) {
            if (occurrences[i] > 0) {
                prob.push(occurrences[i] / input.length);
            }
        }

        // Calculate Shannon entropy
        let entropy = 0,
            p;

        for (i = 0; i < prob.length; i++) {
            p = prob[i];
            entropy += p * Math.log(p) / Math.log(2);
        }

        return -entropy;
    }

    /**
     * Calculates the scanning entropy of the input
     *
     * @param {Uint8Array} inputBytes
     * @returns {Object}
     */
    calculateScanningEntropy(inputBytes) {
        const entropyData = [];
        const binWidth = inputBytes.length < 256 ? 8 : 256;

        for (let bytePos = 0; bytePos < inputBytes.length; bytePos += binWidth) {
            const block = inputBytes.slice(bytePos, bytePos+binWidth);
            entropyData.push(this.calculateShannonEntropy(block));
        }

        return { entropyData, binWidth };
    }

    /**
     * Calculates the frequency of bytes in the input.
     *
     * @param {object} svg
     * @param {function} xScale
     * @param {function} yScale
     * @param {integer} svgHeight
     * @param {integer} svgWidth
     * @param {object} margins
     * @param {string} xTitle
     * @param {string} yTitle
     */
    createAxes(svg, xScale, yScale, svgHeight, svgWidth, margins, title, xTitle, yTitle) {
        // Axes
        const yAxis = d3.axisLeft()
            .scale(yScale);

        const xAxis = d3.axisBottom()
            .scale(xScale);

        svg.append("g")
            .attr("transform", `translate(0, ${svgHeight - margins.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${margins.left},0)`)
            .call(yAxis);

        // Axes labels
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margins.left)
            .attr("x", 0 - (svgHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yTitle);

        svg.append("text")
            .attr("transform", `translate(${svgWidth / 2}, ${svgHeight - margins.bottom + 40})`)
            .style("text-anchor", "middle")
            .text(xTitle);

        // Add title
        svg.append("text")
            .attr("transform", `translate(${svgWidth / 2}, ${margins.top - 10})`)
            .style("text-anchor", "middle")
            .text(title);
    }

    /**
     * Calculates the frequency of bytes in the input.
     *
     * @param {Uint8Array} inputBytes
     * @returns {number[]}
     */
    calculateByteFrequency(inputBytes) {
        const freq = new Array(256).fill(0);
        if (inputBytes.length === 0) return freq;

        // Count occurrences of each byte in the input
        let i;
        for (i = 0; i < inputBytes.length; i++) {
            freq[inputBytes[i]]++;
        }

        for (i = 0; i < freq.length; i++) {
            freq[i] = freq[i] / inputBytes.length;
        }

        return freq;
    }

    /**
     * Calculates the frequency of bytes in the input.
     *
     * @param {number[]} byteFrequency
     * @returns {HTML}
     */
    createByteFrequencyLineHistogram(byteFrequency) {
        const margins = { top: 30, right: 20, bottom: 50, left: 30 };

        const svgWidth = 500,
            svgHeight = 500;

        const document = new nodom.Document();
        let svg = document.createElement("svg");

        svg = d3.select(svg)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(byteFrequency, d => d)])
            .range([svgHeight - margins.bottom, margins.top]);

        const xScale = d3.scaleLinear()
            .domain([0, byteFrequency.length - 1])
            .range([margins.left, svgWidth - margins.right]);

        const line = d3.line()
            .x((_, i) => xScale(i))
            .y(d => yScale(d))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(byteFrequency)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("d", line);

        this.createAxes(svg, xScale, yScale, svgHeight, svgWidth, margins, "", "字节", "字节频率");

        return svg._groups[0][0].outerHTML;
    }

    /**
     * Creates a byte frequency histogram
     *
     * @param {number[]} byteFrequency
     * @returns {HTML}
     */
    createByteFrequencyBarHistogram(byteFrequency) {
        const margins = { top: 30, right: 20, bottom: 50, left: 30 };

        const svgWidth = 500,
            svgHeight = 500,
            binWidth = 1;

        const document = new nodom.Document();
        let svg = document.createElement("svg");
        svg = d3.select(svg)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

        const yExtent = d3.extent(byteFrequency, d => d);
        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([svgHeight - margins.bottom, margins.top]);

        const xScale = d3.scaleLinear()
            .domain([0, byteFrequency.length - 1])
            .range([margins.left - binWidth, svgWidth - margins.right]);

        svg.selectAll("rect")
            .data(byteFrequency)
            .enter().append("rect")
            .attr("x", (_, i) => xScale(i) + binWidth)
            .attr("y", dataPoint => yScale(dataPoint))
            .attr("width", binWidth)
            .attr("height", dataPoint => yScale(yExtent[0]) - yScale(dataPoint))
            .attr("fill", "blue");

        this.createAxes(svg, xScale, yScale, svgHeight, svgWidth, margins, "", "字节", "字节频率");

        return svg._groups[0][0].outerHTML;
    }

    /**
     * Creates a byte frequency histogram
     *
     * @param {number[]} entropyData
     * @returns {HTML}
     */
    createEntropyCurve(entropyData) {
        const margins = { top: 30, right: 20, bottom: 50, left: 30 };

        const svgWidth = 500,
            svgHeight = 500;

        const document = new nodom.Document();
        let svg = document.createElement("svg");
        svg = d3.select(svg)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(entropyData, d => d)])
            .range([svgHeight - margins.bottom, margins.top]);

        const xScale = d3.scaleLinear()
            .domain([0, entropyData.length])
            .range([margins.left, svgWidth - margins.right]);

        const line = d3.line()
            .x((_, i) => xScale(i))
            .y(d => yScale(d))
            .curve(d3.curveMonotoneX);

        if (entropyData.length > 0) {
            svg.append("path")
                .datum(entropyData)
                .attr("d", line);

            svg.selectAll("path").attr("fill", "none").attr("stroke", "steelblue");
        }

        this.createAxes(svg, xScale, yScale, svgHeight, svgWidth, margins, "扫描熵", "块", "熵");

        return svg._groups[0][0].outerHTML;
    }

    /**
     * Creates an image representation of the entropy
     *
     * @param {number[]} entropyData
     * @returns {HTML}
     */
    createEntropyImage(entropyData) {
        const svgHeight = 100,
            svgWidth = 100,
            cellSize = 1,
            nodes = [];

        for (let i = 0; i < entropyData.length; i++) {
            nodes.push({
                x: i % svgWidth,
                y: Math.floor(i / svgWidth),
                entropy: entropyData[i]
            });
        }

        const document = new nodom.Document();
        let svg = document.createElement("svg");
        svg = d3.select(svg)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

        const greyScale = d3.scaleLinear()
            .domain([0, d3.max(entropyData, d => d)])
            .range(["#000000", "#FFFFFF"])
            .interpolate(d3.interpolateRgb);

        svg
            .selectAll("rect")
            .data(nodes)
            .enter().append("rect")
            .attr("x", d => d.x * cellSize)
            .attr("y", d => d.y * cellSize)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .style("fill", d => greyScale(d.entropy));

        return svg._groups[0][0].outerHTML;
    }

    /**
     * Displays the entropy as a scale bar for web apps.
     *
     * @param {number} entropy
     * @returns {HTML}
     */
    createShannonEntropyVisualization(entropy) {
        return `香农熵: ${entropy}
        <br><canvas id='chart-area'></canvas><br>
        - 0 代表无随机性（即数据中的所有字节都具有相同的值），而最大值 8 代表完全随机的字符串。
        - 标准英文文本通常介于 3.5 和 5 之间。
        - 长度合理的经过适当加密或压缩的数据，其熵值应超过 7.5。

        以下结果显示输入数据块的熵。熵值特别高的块可能表明是加密或压缩的部分。

        <br><script>
            var canvas = document.getElementById("chart-area"),
                parentRect = canvas.closest(".cm-scroller").getBoundingClientRect(),
                entropy = ${entropy},
                height = parentRect.height * 0.25;

            canvas.width = parentRect.width * 0.95;
            canvas.height = height > 150 ? 150 : height;

            CanvasComponents.drawScaleBar(canvas, entropy, 8, [
                {
                    label: "英文文本",
                    min: 3.5,
                    max: 5
                },{
                    label: "加密/压缩",
                    min: 7.5,
                    max: 8
                }
            ]);
        </script>`;
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {json}
     */
    run(input, args) {
        const visualizationType = args[0];
        input = new Uint8Array(input);

        switch (visualizationType) {
            case "柱状图 (柱形)":
            case "柱状图 (折线)":
                return this.calculateByteFrequency(input);
            case "曲线":
            case "图像":
                return this.calculateScanningEntropy(input).entropyData;
            case "香农尺度":
            default:
                return this.calculateShannonEntropy(input);
        }
    }

    /**
     * Displays the entropy in a visualisation for web apps.
     *
     * @param {json} entropyData
     * @param {Object[]} args
     * @returns {html}
     */
    present(entropyData, args) {
        const visualizationType = args[0];

        switch (visualizationType) {
            case "柱状图 (柱形)":
                return this.createByteFrequencyBarHistogram(entropyData);
            case "柱状图 (折线)":
                return this.createByteFrequencyLineHistogram(entropyData);
            case "曲线":
                return this.createEntropyCurve(entropyData);
            case "图像":
                return this.createEntropyImage(entropyData);
            case "香农尺度":
            default:
                return this.createShannonEntropyVisualization(entropyData);
        }
    }
}

export default Entropy;
