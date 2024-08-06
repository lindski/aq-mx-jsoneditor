import { createElement, useState, useEffect, useRef } from "react";
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

export function MxJsonEditor({ json, onChange, options, style }) {
    const editorRef = useRef(null);
    
    useEffect(() => {
        if (!editorRef.current) {
            return;
        }

        // Create the editor
        const editor = new JSONEditor(editorRef.current, options);
        editorRef.current.jsonEditor = editor; // Store the editor instance

        // Set the JSON data
        editor.set(json);

        // Listen for changes to the JSON data in the editor
        editorRef.current.jsonEditor.options.onChange = () => {
            try{
                console.debug("editorRef.current.jsonEditor",editorRef.current.jsonEditor);
                // we only want to fire our onchange when we have an editable mode
                if(editorRef.current.jsonEditor.mode !== "view " && 
                    editorRef.current.jsonEditor.mode !== "preview"){
                        const updatedJsonData = editorRef.current.jsonEditor.getText();
                        // on trigger on change if json is valid
                        try{
                            const updatedJson = JSON.parse(updatedJsonData);
                            onChange(updatedJson);
                        }
                        catch(e){}
                }                
            }
            catch(e){
                console.debug("onChange, error",e);
            }
        };

        // Cleanup
        return () => {
            editor.destroy();
        };
    }, []);

    return <div className="aq-jsoneditor" ref={editorRef} style={style}></div>
}
