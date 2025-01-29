window.ace.define("ace/theme/github-dark", ["require", "exports", "module", "ace/lib/dom"], (acequire, exports, module) => {
    exports.isDark = true;
    exports.cssClass = "ace-github-dark";
    exports.cssText = require("./github_dark-css");

    const dom = acequire("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
