import { createElement, useState, useEffect, Fragment } from "react";
import { MxJsonEditor } from "./components/MxJsonEditor";
import "./ui/AqJsonEditor.css";

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
    const [jsonData, setJsonData] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (jsonAttribute.status === "available") {
            if (jsonAttribute.value && jsonAttribute.value !== "") {
                try{
                    const data = JSON.parse(jsonAttribute.value);
                    setJsonData(data);
                }
                catch(e){} // invalid JSON
            }

            setIsReady(true);
        } else {
            setIsReady(false);
            setJsonData(null);
        }
    });

    const handleOnChange = json => {
        // set the attribute value
        jsonAttribute.setValue(json);

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

        if (optionsOverride && optionsOverride !== "") {
            const overriddenOptions = JSON.parse(optionsOverride);
            return {
                ...options,
                ...overriddenOptions
            };
        } else {
            return options;
        }
    };

    const heightStyle = height && height!=="" ? {"height": height} : {}

    return (
        <Fragment>
            {isReady ? (
                <MxJsonEditor json={jsonData} onChange={handleOnChange} options={getOptions()} style={heightStyle} />
            ) : (
                <div className="widget-not-ready"></div>
            )}
        </Fragment>
    );
}
