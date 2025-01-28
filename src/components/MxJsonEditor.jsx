import { createElement, useState, useEffect, useRef } from "react";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

export function MxJsonEditor({ json, onChange, options, style }) {
    const editorRef = useRef(null);
    const [jsonEditor, setJsonEditor] = useState(null);
    const [lastJson, setLastJson] = useState(null);

    // initial mount
    useEffect(() => {
        // Create the editor
        const editor = new JSONEditor(editorRef.current, options);

        // Set the JSON data
        if (json != null) {
            editor.set(json);
        }

        // Listen for changes to the JSON data in the editor
        editor.options.onChange = () => {
            try {
                // we only want to fire our onchange when we have an editable mode
                if (editor.mode !== "view " && editor.mode !== "preview") {
                    const updatedJsonData = editor.getText();
                    // on trigger on change if json is valid
                    try {
                        const updatedJson = JSON.parse(updatedJsonData);
                        console.debug("calling onChange for jsonEditor", editor);
                        setLastJson(updatedJson);
                        onChange(updatedJson);
                    } catch (e) {}
                }
            } catch (e) {
                console.debug("onChange, error", e);
            }
        };

        setJsonEditor(editor);

        // Cleanup
        return () => {
            if (jsonEditor) {
                jsonEditor.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (!jsonEditor || JSON.stringify(lastJson) === JSON.stringify(json)) {
            return;
        }

        console.debug("updating jsonEditor with json", jsonEditor, json);
        jsonEditor.update(json);
    }, [json]);

    return <div className="aq-jsoneditor" ref={editorRef} style={style}></div>;
}
