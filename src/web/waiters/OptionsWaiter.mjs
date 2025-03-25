/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

/**
 * 用于处理与 CyberChef 选项相关的事件的等待器。
 */
class OptionsWaiter {

    /**
     * OptionsWaiter 构造函数。
     *
     * @param {App} app - CyberChef 的主视图对象。
     * @param {Manager} manager - CyberChef 事件管理器。
     */
    constructor(app, manager) {
        this.app = app;
        this.manager = manager;
    }

    /**
     * 加载选项并设置开关和输入的值以匹配它们。
     *
     * @param {Object} options
     */
    load(options) {
        Object.assign(this.app.options, options);

        // 设置选项以匹配对象
        document.querySelectorAll("#options-body input[type=checkbox]").forEach(cbox => {
            cbox.checked = this.app.options[cbox.getAttribute("option")];
        });

        document.querySelectorAll("#options-body input[type=number]").forEach(nbox => {
            nbox.value = this.app.options[nbox.getAttribute("option")];
            nbox.dispatchEvent(new CustomEvent("change", {bubbles: true}));
        });

        document.querySelectorAll("#options-body select").forEach(select => {
            const val = this.app.options[select.getAttribute("option")];
            if (val) {
                select.value = val;
                select.dispatchEvent(new CustomEvent("change", {bubbles: true}));
            } else {
                select.selectedIndex = 0;
            }
        });

        // 初始化选项
        this.setWordWrap();
        this.manager.ops.setCatCount();
    }


    /**
     * 选项点击事件的处理程序。
     * 显示选项面板。
     *
     * @param {event} e
     */
    optionsClick(e) {
        e.preventDefault();
        $("#options-modal").modal();
    }


    /**
     * 重置选项点击事件的处理程序。
     * 将选项重置为默认值。
     */
    resetOptionsClick() {
        this.load(this.app.doptions);
    }


    /**
     * 开关更改事件的处理程序。
     *
     * @param {event} e
     */
    switchChange(e) {
        const el = e.target;
        const option = el.getAttribute("option");
        const state = el.checked;

        this.updateOption(option, state);
    }


    /**
     * 数字更改事件的处理程序。
     *
     * @param {event} e
     */
    numberChange(e) {
        const el = e.target;
        const option = el.getAttribute("option");
        const val = parseInt(el.value, 10);

        this.updateOption(option, val);
    }


    /**
     * 选择更改事件的处理程序。
     *
     * @param {event} e
     */
    selectChange(e) {
        const el = e.target;
        const option = el.getAttribute("option");

        this.updateOption(option, el.value);
    }

    /**
     * 修改选项值并将其保存到本地存储。
     *
     * @param {string} option - 要更新的选项
     * @param {string|number|boolean} value - 选项的新值
     */
    updateOption(option, value) {
        log.debug(`Setting ${option} to ${value}`);
        this.app.options[option] = value;

        if (this.app.isLocalStorageAvailable())
            localStorage.setItem("options", JSON.stringify(this.app.options));
    }


    /**
     * 根据 wordWrap 选项值设置或取消设置输入和输出的自动换行。
     */
    setWordWrap() {
        this.manager.input.setWordWrap(this.app.options.wordWrap);
        this.manager.output.setWordWrap(this.app.options.wordWrap);
    }


    /**
     * 主题更改事件监听器
     *
     * @param {Event} e
     */
    themeChange(e) {
        const themeClass = e.target.value;
        this.changeTheme(themeClass);
    }


    /**
     * 通过设置 <html> 元素的 class 来更改主题。
     *
     * @param (string} theme
     */
    changeTheme(theme) {
        document.querySelector(":root").className = theme;

        // 更新主题选择
        const themeSelect = document.getElementById("theme");
        themeSelect.selectedIndex = themeSelect.querySelector(`option[value="${theme}"`).index;
    }

    /**
     * 使用 `prefers-color-scheme` 媒体查询应用用户首选的颜色方案。
     */
    applyPreferredColorScheme() {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = prefersDarkScheme ? "dark" : "classic";
        this.changeTheme(theme);
    }

    /**
     * 更改控制台日志记录级别。
     *
     * @param {Event} e
     */
    logLevelChange(e) {
        const level = e.target.value;
        log.setLevel(level, false);
        this.manager.worker.setLogLevel();
        this.manager.input.setLogLevel();
        this.manager.output.setLogLevel();
        this.manager.background.setLogLevel();
    }
}

export default OptionsWaiter;
