import { createElement, useState, useEffect, Fragment } from "react";
import { MxJsonEditor } from "./components/MxJsonEditor";
import "./ui/AqJsonEditor.css";
import "./ui/themes/github";
import "./ui/themes/github_dark";

export function AqJsonEditor({
    jsonAttribute,
    onChange,
    defaultMode,
    allowedModes,
    enableHistory,
    limitDragging,
    showStatusBar,
    showMainMenuBar,
    showNavigationBar,
    optionsOverride,
    height
}) {
    const [editorState, setEditorState] = useState({ isReady: false, data: null });

    useEffect(() => {
        console.debug("jsonAttribute", jsonAttribute);
        if (jsonAttribute.status === "available") {
            if (jsonAttribute.value && jsonAttribute.value !== "") {
                try {
                    const data = JSON.parse(jsonAttribute.value);
                    console.debug("data", data);
                    setEditorState({
                        isReady: true,
                        data: data
                    });
                } catch (e) {
                    // invalid JSON
                    console.error(`Failed to parse JSON with error ${e.message}`, e);
                }
            } else {
                setEditorState({
                    isReady: true,
                    data: null
                });
            }
        } else {
            setEditorState({
                isReady: false,
                data: null
            });
        }
    }, [jsonAttribute]);

    const handleOnChange = json => {
        // set the attribute value
        jsonAttribute.setValue(JSON.stringify(json));

        // fire the onChange event
        if (onChange != undefined) {
            if (onChange.canExecute && !onChange.isExecuting) {
                onChange.execute();
            }
        }
    };

    const getOptions = () => {
        const options = {};
        options.mode = defaultMode;
        if (allowedModes && allowedModes.value !== "") {
            options.modes = allowedModes.value.split(",").map(function (item) {
                return item.trim();
            });
        }
        options.history = enableHistory;
        options.limitDragging = limitDragging;
        options.statusBar = showStatusBar;
        options.mainMenuBar = showMainMenuBar;
        options.navigationBar = showNavigationBar;

        if (optionsOverride && optionsOverride.value !== "") {
            const overriddenOptions = JSON.parse(optionsOverride.value);
            const optionsWithOverride = {
                ...options,
                ...overriddenOptions
            };

            console.debug("options", optionsWithOverride);
            return optionsWithOverride;

        }

        console.debug("options", options);
        return options;
    };

    const heightStyle = height && height !== "" ? { height: height } : {};

    return (
        <Fragment>
            {editorState.isReady ? (
                <MxJsonEditor
                    json={editorState.data}
                    onChange={handleOnChange}
                    options={getOptions()}
                    style={heightStyle}
                />
            ) : (
                <div className="widget-not-ready"></div>
            )}
        </Fragment>
    );
}
