import { createElement } from "react";
import { MxJsonEditor } from "./components/MxJsonEditor";

export function preview() {
    return <MxJsonEditor json={{"auraq":"rocks"}} />
}

export function getPreviewCss() {
    return require("./ui/AqJsonEditor.css");
}
