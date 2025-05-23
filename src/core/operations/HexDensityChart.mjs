/**
 * @author tlwr [toby@toby.codes]
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import * as d3temp from "d3";
import * as d3hexbintemp from "d3-hexbin";
import * as nodomtemp from "nodom";
import { getScatterValues, RECORD_DELIMITER_OPTIONS, COLOURS, FIELD_DELIMITER_OPTIONS } from "../lib/Charts.mjs";

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

const d3 = d3temp.default ? d3temp.default : d3temp;
const d3hexbin = d3hexbintemp.default ? d3hexbintemp.default : d3hexbintemp;
const nodom = nodomtemp.default ? nodomtemp.default: nodomtemp;


/**
 * Hex Density chart operation
 */
class HexDensityChart extends Operation {

    /**
     * HexDensityChart constructor
     */
    constructor() {
        super();

        this.name = "十六进制 密度图";
        this.module = "Charts";
        this.description = "十六进制 密度图的用途类似于散点图，但它不是渲染数万个点，而是将这些点分组到数百个六边形中以显示分布。";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                name: "记录分隔符",
                type: "option",
                value: RECORD_DELIMITER_OPTIONS,
            },
            {
                name: "字段分隔符",
                type: "option",
                value: FIELD_DELIMITER_OPTIONS,
            },
            {
                name: "聚拢半径",
                type: "number",
                value: 25,
            },
            {
                name: "绘制半径",
                type: "number",
                value: 15,
            },
            {
                name: "使用列标题作为标签",
                type: "boolean",
                value: true,
            },
            {
                name: "X 轴标签",
                type: "string",
                value: "",
            },
            {
                name: "Y 轴标签",
                type: "string",
                value: "",
            },
            {
                name: "绘制六边形边框",
                type: "boolean",
                value: false,
            },
            {
                name: "最小颜色值",
                type: "string",
                value: COLOURS.min,
            },
            {
                name: "最大颜色值",
                type: "string",
                value: COLOURS.max,
            },
            {
                name: "在数据边界内绘制空六边形",
                type: "boolean",
                value: false,
            }
        ];
    }


    /**
     * Hex Bin chart operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const recordDelimiter = Utils.charRep(args[0]),
            fieldDelimiter = Utils.charRep(args[1]),
            packRadius = args[2],
            drawRadius = args[3],
            columnHeadingsAreIncluded = args[4],
            drawEdges = args[7],
            minColour = args[8],
            maxColour = args[9],
            drawEmptyHexagons = args[10],
            dimension = 500;

        let xLabel = args[5],
            yLabel = args[6];
        const { headings, values } = getScatterValues(
            input,
            recordDelimiter,
            fieldDelimiter,
            columnHeadingsAreIncluded
        );

        if (headings) {
            xLabel = headings.x;
            yLabel = headings.y;
        }

        const document = new nodom.Document();
        let svg = document.createElement("svg");
        svg = d3.select(svg)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${dimension} ${dimension}`);

        const margin = {
                top: 10,
                right: 0,
                bottom: 40,
                left: 30,
            },
            width = dimension - margin.left - margin.right,
            height = dimension - margin.top - margin.bottom,
            marginedSpace = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const hexbin = d3hexbin.hexbin()
            .radius(packRadius)
            .extent([0, 0], [width, height]);

        const hexPoints = hexbin(values),
            maxCount = Math.max(...hexPoints.map(b => b.length));

        const xExtent = d3.extent(hexPoints, d => d.x),
            yExtent = d3.extent(hexPoints, d => d.y);
        xExtent[0] -= 2 * packRadius;
        xExtent[1] += 3 * packRadius;
        yExtent[0] -= 2 * packRadius;
        yExtent[1] += 2 * packRadius;

        const xAxis = d3.scaleLinear()
            .domain(xExtent)
            .range([0, width]);
        const yAxis = d3.scaleLinear()
            .domain(yExtent)
            .range([height, 0]);

        const colour = d3.scaleSequential(d3.interpolateLab(minColour, maxColour))
            .domain([0, maxCount]);

        marginedSpace.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        if (drawEmptyHexagons) {
            marginedSpace.append("g")
                .attr("class", "empty-hexagon")
                .selectAll("path")
                .data(this.getEmptyHexagons(hexPoints, packRadius))
                .enter()
                .append("path")
                .attr("d", d => {
                    return `M${xAxis(d.x)},${yAxis(d.y)} ${hexbin.hexagon(drawRadius)}`;
                })
                .attr("fill", (d) => colour(0))
                .attr("stroke", drawEdges ? "black" : "none")
                .attr("stroke-width", drawEdges ? "0.5" : "none")
                .append("title")
                .text(d => {
                    const count = 0,
                        perc = 0,
                        tooltip = `计数: ${count}\n
                                百分比: ${perc.toFixed(2)}%\n
                                中心: ${d.x.toFixed(2)}, ${d.y.toFixed(2)}\n
                        `.replace(/\s{2,}/g, "\n");
                    return tooltip;
                });
        }

        marginedSpace.append("g")
            .attr("class", "hexagon")
            .attr("clip-path", "url(#clip)")
            .selectAll("path")
            .data(hexPoints)
            .enter()
            .append("path")
            .attr("d", d => {
                return `M${xAxis(d.x)},${yAxis(d.y)} ${hexbin.hexagon(drawRadius)}`;
            })
            .attr("fill", (d) => colour(d.length))
            .attr("stroke", drawEdges ? "black" : "none")
            .attr("stroke-width", drawEdges ? "0.5" : "none")
            .append("title")
            .text(d => {
                const count = d.length,
                    perc = 100.0 * d.length / values.length,
                    CX = d.x,
                    CY = d.y,
                    xMin = Math.min(...d.map(d => d[0])),
                    xMax = Math.max(...d.map(d => d[0])),
                    yMin = Math.min(...d.map(d => d[1])),
                    yMax = Math.max(...d.map(d => d[1])),
                    tooltip = `计数: ${count}\n
                               百分比: ${perc.toFixed(2)}%\n
                               中心: ${CX.toFixed(2)}, ${CY.toFixed(2)}\n
                               最小 X 值: ${xMin.toFixed(2)}\n
                               最大 X 值: ${xMax.toFixed(2)}\n
                               最小 Y 值: ${yMin.toFixed(2)}\n
                               最大 Y 值: ${yMax.toFixed(2)}
                    `.replace(/\s{2,}/g, "\n");
                return tooltip;
            });

        marginedSpace.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(yAxis).tickSizeOuter(-width));

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("x", -(height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yLabel);

        marginedSpace.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxis).tickSizeOuter(-height));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", dimension)
            .style("text-anchor", "middle")
            .text(xLabel);

        return svg._groups[0][0].outerHTML;
    }


    /**
     * Hex Bin chart operation.
     *
     * @param {Object[]} - centres
     * @param {number} - radius
     * @returns {Object[]}
     */
    getEmptyHexagons(centres, radius) {
        const emptyCentres = [],
            boundingRect = [d3.extent(centres, d => d.x), d3.extent(centres, d => d.y)],
            hexagonCenterToEdge = Math.cos(2 * Math.PI / 12) * radius,
            hexagonEdgeLength = Math.sin(2 * Math.PI / 12) * radius;
        let indent = false;

        for (let y = boundingRect[1][0]; y <= boundingRect[1][1] + radius; y += hexagonEdgeLength + radius) {
            for (let x = boundingRect[0][0]; x <= boundingRect[0][1] + radius; x += 2 * hexagonCenterToEdge) {
                let cx = x;
                const cy = y;

                if (indent && x >= boundingRect[0][1]) break;
                if (indent) cx += hexagonCenterToEdge;

                emptyCentres.push({x: cx, y: cy});
            }
            indent = !indent;
        }

        return emptyCentres;
    }

}

export default HexDensityChart;
