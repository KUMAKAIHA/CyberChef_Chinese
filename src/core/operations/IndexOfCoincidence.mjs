/**
 * @author George O [georgeomnet+cyberchef@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Index of Coincidence operation
 */
class IndexOfCoincidence extends Operation {

    /**
     * IndexOfCoincidence constructor
     */
    constructor() {
        super();

        this.name = "重合指数";
        this.module = "Default";
        this.description = "重合指数 (IC) 是指两个随机选择的字符相同的概率。它可以用来判断文本是可读的还是随机的，英文文本的 IC 值约为 0.066。因此，IC 可以作为自动化频率分析的一种可靠方法。";
        this.infoURL = "https://wikipedia.org/wiki/Index_of_coincidence";
        this.inputType = "string";
        this.outputType = "number";
        this.presentType = "html";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {number}
     */
    run(input, args) {
        const text = input.toLowerCase().replace(/[^a-z]/g, ""),
            frequencies = new Array(26).fill(0),
            alphabet = Utils.expandAlphRange("a-z");
        let coincidence = 0.00,
            density = 0.00,
            result = 0.00,
            i;

        for (i=0; i < alphabet.length; i++) {
            frequencies[i] = text.count(alphabet[i]);
        }

        for (i=0; i < frequencies.length; i++) {
            coincidence += frequencies[i] * (frequencies[i] - 1);
        }

        density = frequencies.sum();

        // Ensure that we don't divide by 0
        if (density < 2) density = 2;

        result = coincidence / (density * (density - 1));

        return result;
    }

    /**
     * Displays the IC as a scale bar for web apps.
     *
     * @param {number} ic
     * @returns {html}
     */
    present(ic) {
        return `重合指数: ${ic}
已归一化: ${ic * 26}
<br><canvas id='chart-area'></canvas><br>
- 0 代表完全随机性（所有字符都是唯一的），而 1 代表没有随机性（所有字符都相同）。
- 英文文本的 IC 值通常在 0.67 到 0.78 之间。
- “随机”文本由每个字母与另一个字母出现次数相同的概率决定。

该图表显示输入数据的 IC 值。较低的 IC 值通常意味着文本是随机的、压缩的或加密的。

<script type='application/javascript'>
  var canvas = document.getElementById("chart-area"),
      parentRect = canvas.closest(".cm-scroller").getBoundingClientRect(),
      ic = ${ic};

  canvas.width = parentRect.width * 0.95;
  canvas.height = parentRect.height * 0.25;

  ic = ic > 0.25 ? 0.25 : ic;

  CanvasComponents.drawScaleBar(canvas, ic, 0.25, [
    {
      label: "英文文本",
      min: 0.05,
      max: 0.08
    },
    {
      label: "> 0.25",
      min: 0.24,
      max: 0.25
    }
  ]);
</script>
     `;
    }

}

export default IndexOfCoincidence;
