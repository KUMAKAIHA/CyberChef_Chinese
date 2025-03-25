/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

// Styles
import "./stylesheets/index.js";

// Libs
import "arrive";
import "snackbarjs";
import "bootstrap-material-design/js/index";
import "bootstrap-colorpicker";
import moment from "moment-timezone";
import * as CanvasComponents from "../core/lib/CanvasComponents.mjs";

// CyberChef
import App from "./App.mjs";
import Categories from "../core/config/Categories.json" assert {type: "json"};
import OperationConfig from "../core/config/OperationConfig.json" assert {type: "json"};


/**
 * Main function used to build the CyberChef web app.
 */
function main() {
    const defaultFavourites = [
        "转换为 Base64",
        "从 Base64 转换",
        "转换为 Hex",
        "从 Hex 转换",
        "转换为 Hexdump",
        "从 Hexdump 转换",
        "URL 解码",
        "正则表达式",
        "熵",
        "分支",
        "魔法"
    ];

    const defaultOptions = {
        updateUrl:           true,
        showHighlighter:     true,
        wordWrap:            true,
        showErrors:          true,
        errorTimeout:        4000,
        attemptHighlight:    true,
        theme:               "classic",
        useMetaKey:          false,
        logLevel:            "info",
        autoMagic:           true,
        imagePreview:        true,
        syncTabs:            true,
        showCatCount:        false,
    };

    document.removeEventListener("DOMContentLoaded", main, false);
    window.app = new App(Categories, OperationConfig, defaultFavourites, defaultOptions);
    window.app.setup();
}

window.compileTime = moment.tz(COMPILE_TIME, "DD/MM/YYYY HH:mm:ss z", "UTC").valueOf();
window.compileMessage = COMPILE_MSG;

// Make libs available to operation outputs
window.CanvasComponents = CanvasComponents;

document.addEventListener("DOMContentLoaded", main, false);
