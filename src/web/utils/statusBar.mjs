/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import {showPanel} from "@codemirror/view";
import {CHR_ENC_SIMPLE_LOOKUP, CHR_ENC_SIMPLE_REVERSE_LOOKUP} from "../../core/lib/ChrEnc.mjs";
import { eolCodeToName, eolSeqToCode } from "./editorUtils.mjs";

/**
 * A Status bar extension for CodeMirror
 */
class StatusBarPanel {

    /**
     * StatusBarPanel constructor
     * @param {Object} opts
     */
    constructor(opts) {
        this.label = opts.label;
        this.timing = opts.timing;
        this.tabNumGetter = opts.tabNumGetter;
        this.eolHandler = opts.eolHandler;
        this.chrEncHandler = opts.chrEncHandler;
        this.chrEncGetter = opts.chrEncGetter;
        this.getEncodingState = opts.getEncodingState;
        this.getEOLState = opts.getEOLState;
        this.htmlOutput = opts.htmlOutput;

        this.eolVal = null;
        this.chrEncVal = null;

        this.dom = this.buildDOM();
    }

    /**
     * Builds the status bar DOM tree
     * @returns {DOMNode}
     */
    buildDOM() {
        const dom = document.createElement("div");
        const lhs = document.createElement("div");
        const rhs = document.createElement("div");

        dom.className = "cm-status-bar";
        dom.setAttribute("data-help-title", `${this.label} 状态栏`);
        dom.setAttribute("data-help", `该状态栏提供关于 ${this.label} 数据的信息。悬停各组件时可查看帮助说明。`);
        lhs.innerHTML = this.constructLHS();
        rhs.innerHTML = this.constructRHS();

        dom.appendChild(lhs);
        dom.appendChild(rhs);

        // Event listeners
        dom.querySelectorAll(".cm-status-bar-select-btn").forEach(
            el => el.addEventListener("click", this.showDropUp.bind(this), false)
        );
        dom.querySelector(".eol-select").addEventListener("click", this.eolSelectClick.bind(this), false);
        dom.querySelector(".chr-enc-select").addEventListener("click", this.chrEncSelectClick.bind(this), false);
        dom.querySelector(".cm-status-bar-filter-input").addEventListener("keyup", this.chrEncFilter.bind(this), false);

        return dom;
    }

    /**
     * Handler for dropup clicks
     * Shows/Hides the dropup
     * @param {Event} e
     */
    showDropUp(e) {
        const el = e.target
            .closest(".cm-status-bar-select")
            .querySelector(".cm-status-bar-select-content");
        const btn = e.target.closest(".cm-status-bar-select-btn");

        if (btn.classList.contains("disabled")) return;

        el.classList.add("show");

        // Focus the filter input if present
        const filter = el.querySelector(".cm-status-bar-filter-input");
        if (filter) filter.focus();

        // Set up a listener to close the menu if the user clicks outside of it
        hideOnClickOutside(el, e);
    }

    /**
     * Handler for EOL Select clicks
     * Sets the line separator
     * @param {Event} e
     */
    eolSelectClick(e) {
        // preventDefault is required to stop the URL being modified and popState being triggered
        e.preventDefault();

        const eolCode = e.target.getAttribute("data-val");
        if (!eolCode) return;

        // Call relevant EOL change handler
        this.eolHandler(e.target.getAttribute("data-val"), true);

        hideElement(e.target.closest(".cm-status-bar-select-content"));
    }

    /**
     * Handler for Chr Enc Select clicks
     * Sets the character encoding
     * @param {Event} e
     */
    chrEncSelectClick(e) {
        // preventDefault is required to stop the URL being modified and popState being triggered
        e.preventDefault();

        const chrEncVal = parseInt(e.target.getAttribute("data-val"), 10);

        if (isNaN(chrEncVal)) return;

        this.chrEncHandler(chrEncVal, true);
        this.updateCharEnc(chrEncVal);
        hideElement(e.target.closest(".cm-status-bar-select-content"));
    }

    /**
     * Handler for Chr Enc keyup events
     * Filters the list of selectable character encodings
     * @param {Event} e
     */
    chrEncFilter(e) {
        const input = e.target;
        const filter = input.value.toLowerCase();
        const div = input.closest(".cm-status-bar-select-content");
        const a = div.getElementsByTagName("a");
        for (let i = 0; i < a.length; i++) {
            const txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toLowerCase().includes(filter)) {
                a[i].style.display = "block";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    /**
     * Counts the stats of a document
     * @param {EditorState} state
     */
    updateStats(state) {
        const length = this.dom.querySelector(".stats-length-value"),
            lines = this.dom.querySelector(".stats-lines-value");

        let docLength = state.doc.length;
        // CodeMirror always counts line breaks as one character.
        // We want to show an accurate reading of how many bytes there are.
        if (state.lineBreak.length !== 1) {
            docLength += (state.lineBreak.length * state.doc.lines) - state.doc.lines - 1;
        }
        length.textContent = docLength;
        lines.textContent = state.doc.lines;
    }

    /**
     * Gets the current selection info
     * @param {EditorState} state
     * @param {boolean} selectionSet
     */
    updateSelection(state, selectionSet) {
        const selLen = state?.selection?.main ?
            state.selection.main.to - state.selection.main.from :
            0;

        const selInfo = this.dom.querySelector(".sel-info"),
            curOffsetInfo = this.dom.querySelector(".cur-offset-info");

        if (!selectionSet) {
            selInfo.style.display = "none";
            curOffsetInfo.style.display = "none";
            return;
        }

        // CodeMirror always counts line breaks as one character.
        // We want to show an accurate reading of how many bytes there are.
        let from = state.selection.main.from,
            to = state.selection.main.to;
        if (state.lineBreak.length !== 1) {
            const fromLine = state.doc.lineAt(from).number;
            const toLine = state.doc.lineAt(to).number;
            from += (state.lineBreak.length * fromLine) - fromLine - 1;
            to += (state.lineBreak.length * toLine) - toLine - 1;
        }

        if (selLen > 0) { // Range
            const start = this.dom.querySelector(".sel-start-value"),
                end = this.dom.querySelector(".sel-end-value"),
                length = this.dom.querySelector(".sel-length-value");

            selInfo.style.display = "inline-block";
            curOffsetInfo.style.display = "none";
            start.textContent = from;
            end.textContent = to;
            length.textContent = to - from;
        } else { // Position
            const offset = this.dom.querySelector(".cur-offset-value");

            selInfo.style.display = "none";
            curOffsetInfo.style.display = "inline-block";
            offset.textContent = from;
        }
    }

    /**
     * Sets the current EOL separator in the status bar
     * @param {EditorState} state
     */
    updateEOL(state) {
        if (this.getEOLState() < 2 && state.lineBreak === this.eolVal) return;

        const val = this.dom.querySelector(".eol-value");
        const button = val.closest(".cm-status-bar-select-btn");
        let eolCode = eolSeqToCode[state.lineBreak];
        let eolName = eolCodeToName[eolCode];

        switch (this.getEOLState()) {
            case 1: // Detected
                val.classList.add("font-italic");
                eolCode += "（检测到）";
                eolName += "（检测到）";
                // Pulse
                val.classList.add("pulse");
                setTimeout(() => {
                    val.classList.remove("pulse");
                }, 2000);
                break;
            case 0: // Unset
            case 2: // Manually set
            default:
                val.classList.remove("font-italic");
                break;
        }

        val.textContent = eolCode;
        button.setAttribute("title", `行结束符：<br>${eolName}`);
        button.setAttribute("data-original-title", `行结束符：<br>${eolName}`);
        this.eolVal = state.lineBreak;
    }


    /**
     * Sets the current character encoding of the document
     */
    updateCharEnc() {
        const chrEncVal = this.chrEncGetter();
        if (this.getEncodingState() < 2 && chrEncVal === this.chrEncVal) return;

        let name = CHR_ENC_SIMPLE_REVERSE_LOOKUP[chrEncVal] ? CHR_ENC_SIMPLE_REVERSE_LOOKUP[chrEncVal] : "Raw Bytes";

        const val = this.dom.querySelector(".chr-enc-value");
        const button = val.closest(".cm-status-bar-select-btn");

        switch (this.getEncodingState()) {
            case 1: // Detected
                val.classList.add("font-italic");
                name += "（检测到）";
                // Pulse
                val.classList.add("pulse");
                setTimeout(() => {
                    val.classList.remove("pulse");
                }, 2000);
                break;
            case 0: // Unset
            case 2: // Manually set
            default:
                val.classList.remove("font-italic");
                break;
        }

        val.textContent = name;
        button.setAttribute("title", `${this.label} 字符编码：<br>${name}`);
        button.setAttribute("data-original-title", `${this.label} 字符编码：<br>${name}`);
        this.chrEncVal = chrEncVal;
    }

    /**
     * Sets the latest timing info
     */
    updateTiming() {
        if (!this.timing) return;

        const bakingTime = this.dom.querySelector(".baking-time-value");
        const bakingTimeInfo = this.dom.querySelector(".baking-time-info");

        if (this.label === "Output" && this.timing) {
            bakingTimeInfo.style.display = "inline-block";
            bakingTime.textContent = this.timing.duration(this.tabNumGetter());

            const info = this.timing.printStages(this.tabNumGetter()).replace(/\n/g, "<br>");
            bakingTimeInfo.setAttribute("data-original-title", info);
        } else {
            bakingTimeInfo.style.display = "none";
        }
    }

    /**
     * Updates the sizing of elements that need to fit correctly
     * @param {EditorView} view
     */
    updateSizing(view) {
        const viewHeight = view.contentDOM.parentNode.clientHeight;
        this.dom.querySelectorAll(".cm-status-bar-select-scroll").forEach(
            el => {
                el.style.maxHeight = (viewHeight - 50) + "px";
            }
        );
    }

    /**
     * Checks whether there is HTML output requiring some widgets to be disabled
     */
    monitorHTMLOutput() {
        if (!this.htmlOutput?.changed) return;

        if (this.htmlOutput?.html === "") {
            // Enable all controls
            this.dom.querySelectorAll(".disabled").forEach(el => {
                el.classList.remove("disabled");
            });
        } else {
            // Disable chrenc, length, selection etc.
            this.dom.querySelectorAll(".cm-status-bar-select-btn").forEach(el => {
                el.classList.add("disabled");
            });

            this.dom.querySelector(".stats-length-value").parentNode.classList.add("disabled");
            this.dom.querySelector(".stats-lines-value").parentNode.classList.add("disabled");
            this.dom.querySelector(".sel-info").classList.add("disabled");
            this.dom.querySelector(".cur-offset-info").classList.add("disabled");
        }
    }

    /**
     * Builds the Left-hand-side widgets
     * @returns {string}
     */
    constructLHS() {
        return `
            <span data-toggle="tooltip" title="${this.label} 长度" data-help-title="${this.label} 长度" data-help="该数字表示 ${this.label} 中的字符数。CRLF 行结束符被计为两个字符，这会影响此数值。">
                <i class="material-icons">abc</i>
                <span class="stats-length-value"></span>
            </span>
            <span data-toggle="tooltip" title="行数"  data-help-title="行数" data-help="该数字表示 ${this.label} 中的行数。行由行结束符分隔，可通过最右侧的 EOL 选择器更改。">
                <i class="material-icons">sort</i>
                <span class="stats-lines-value"></span>
            </span>

            <span class="sel-info" data-toggle="tooltip" title="主要选择" data-help-title="主要选择" data-help="这些数字显示当前选区的起始、结束偏移以及所选字符数。如果存在多个选区，则显示最新的选区。">
                <i class="material-icons">highlight_alt</i>
                <span class="sel-start-value"></span>\u279E<span class="sel-end-value"></span>
                (<span class="sel-length-value"></span> 已选)
            </span>
            <span class="cur-offset-info" data-toggle="tooltip" title="光标偏移" data-help-title="光标偏移" data-help="该数字指示光标自 ${this.label} 开始处的当前偏移量。<br><br>CRLF 行结束符被计为两个字符，这会影响此数值。">
                <i class="material-icons">location_on</i>
                <span class="cur-offset-value"></span>
            </span>`;
    }

    /**
     * Builds the Right-hand-side widgets
     * Event listener set up in Manager
     *
     * @returns {string}
     */
    constructRHS() {
        const chrEncOptions = Object.keys(CHR_ENC_SIMPLE_LOOKUP).map(name =>
            `<a href="#" draggable="false" data-val="${CHR_ENC_SIMPLE_LOOKUP[name]}">${name}</a>`
        ).join("");

        let chrEncHelpText = "",
            eolHelpText = "";
        if (this.label === "Input") {
            chrEncHelpText = "输入字符编码定义了输入文本如何转换为字节供 Recipe 处理。<br><br>‘Raw Bytes’选项尝试将输入视为在 0-255 范围内的单个字节。如果检测到 Unicode 值大于 255 的字符，则会将整个输入视作 UTF-8。当输入二进制数据（例如文件）时，‘Raw Bytes’通常是最佳选择。";
            eolHelpText = "行结束符定义了哪些字节被视为行终止符。按回车键将在输入中插入该值并创建新行。<br><br>更改行结束符不会修改已有数据，但可能改变之前换行的显示方式。在设置不同行终止符时添加的行可能不会换行，而是显示为控制字符。";
        } else {
            chrEncHelpText = "输出字符编码定义了输出字节如何解码为可显示的文本。<br><br>‘Raw Bytes’选项将输出数据视为在 0-255 范围内的独立字节。";
            eolHelpText = "行结束符定义了哪些字节被视为行终止符。<br><br>更改该值不会修改输出内容，但可能改变某些字节的显示方式以及是否创建新行。";
        }

        return `
            <span class="baking-time-info" style="display: none" data-toggle="tooltip" data-html="true" title="处理时间" data-help-title="处理时间" data-help="处理时间指的是从数据从输入中读取、经过处理到最终显示在输出中的总耗时。<br><br>‘Threading overhead’ 表示处理线程间的数据传输及垃圾回收耗时，此项不计入状态栏显示的总时间，因其受后台操作系统和浏览器活动影响较大。">
                <i class="material-icons">schedule</i>
                <span class="baking-time-value"></span>毫秒
            </span>

            <div class="cm-status-bar-select chr-enc-select" data-help-title="${this.label} 字符编码" data-help="${chrEncHelpText}">
                <span class="cm-status-bar-select-btn" data-toggle="tooltip" data-html="true" data-placement="left" title="${this.label} 字符编码">
                    <i class="material-icons">text_fields</i> <span class="chr-enc-value">Raw Bytes</span>
                </span>
                <div class="cm-status-bar-select-content">
                    <div class="cm-status-bar-select-scroll no-select">
                        <a href="#" draggable="false" data-val="0">Raw Bytes</a>
                        ${chrEncOptions}
                    </div>
                    <div class="input-group cm-status-bar-filter-search">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <i class="material-icons">search</i>
                            </span>
                        </div>
                        <input type="text" class="form-control cm-status-bar-filter-input" placeholder="过滤…">
                    </div>
                </div>
            </div>

            <div class="cm-status-bar-select eol-select" data-help-title="${this.label} 行结束符" data-help="${eolHelpText}">
                <span class="cm-status-bar-select-btn" data-toggle="tooltip" data-html="true" data-placement="left" title="行结束符">
                    <i class="material-icons">keyboard_return</i> <span class="eol-value"></span>
                </span>
                <div class="cm-status-bar-select-content no-select">
                    <a href="#" draggable="false" data-val="LF">换行符, U+000A</a>
                    <a href="#" draggable="false" data-val="VT">垂直制表符, U+000B</a>
                    <a href="#" draggable="false" data-val="FF">换页符, U+000C</a>
                    <a href="#" draggable="false" data-val="CR">回车符, U+000D</a>
                    <a href="#" draggable="false" data-val="CRLF">回车+换行, U+000D U+000A</a>
                    <!-- <a href="#" draggable="false" data-val="NL">Next Line, U+0085</a> This causes problems. -->
                    <a href="#" draggable="false" data-val="LS">行分隔符, U+2028</a>
                    <a href="#" draggable="false" data-val="PS">段落分隔符, U+2029</a>
                </div>
            </div>`;
    }

}

const elementsWithListeners = {};

/**
 * Hides the provided element when a click is made outside of it
 * @param {Element} element
 * @param {Event} instantiatingEvent
 */
function hideOnClickOutside(element, instantiatingEvent) {
    /**
     * Handler for document click events
     * Closes element if click is outside it.
     * @param {Event} event
     */
    const outsideClickListener = event => {
        // Don't trigger if we're clicking inside the element, or if the element
        // is not visible, or if this is the same click event that opened it.
        if (!element.contains(event.target) &&
            event.timeStamp !== instantiatingEvent.timeStamp) {
            hideElement(element);
        }
    };

    if (!Object.prototype.hasOwnProperty.call(elementsWithListeners, element)) {
        elementsWithListeners[element] = outsideClickListener;
        document.addEventListener("click", elementsWithListeners[element], false);
    }
}

/**
 * Hides the specified element and removes the click listener for it
 * @param {Element} element
 */
function hideElement(element) {
    element.classList.remove("show");
    document.removeEventListener("click", elementsWithListeners[element], false);
    delete elementsWithListeners[element];
}


/**
 * A panel constructor factory building a panel that re-counts the stats every time the document changes.
 * @param {Object} opts
 * @returns {Function<PanelConstructor>}
 */
function makePanel(opts) {
    const sbPanel = new StatusBarPanel(opts);

    return (view) => {
        sbPanel.updateEOL(view.state);
        sbPanel.updateCharEnc();
        sbPanel.updateTiming();
        sbPanel.updateStats(view.state);
        sbPanel.updateSelection(view.state, false);
        sbPanel.monitorHTMLOutput();

        return {
            "dom": sbPanel.dom,
            update(update) {
                sbPanel.updateEOL(update.state);
                sbPanel.updateCharEnc();
                sbPanel.updateSelection(update.state, update.selectionSet);
                sbPanel.updateTiming();
                sbPanel.monitorHTMLOutput();
                if (update.geometryChanged) {
                    sbPanel.updateSizing(update.view);
                }
                if (update.docChanged) {
                    sbPanel.updateStats(update.state);
                }
            }
        };
    };
}

/**
 * A function that build the extension that enables the panel in an editor.
 * @param {Object} opts
 * @returns {Extension}
 */
export function statusBar(opts) {
    const panelMaker = makePanel(opts);
    return showPanel.of(panelMaker);
}
