import { useEffect, useMemo, useRef } from "react"
import { EditorView, keymap } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentWithTab } from "@codemirror/commands";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import { minimap } from "../extensions/minimap";
import { customTheme } from "../extensions/theme";
import { getLanguageExtension } from "../extensions/language-extension";
import { customSetup } from "../extensions/custom-setup";
import { suggestion } from "../extensions/suggestion";
import { quickEdit } from "../extensions/quick-edit";
import { selectionTooltip } from "../extensions/selection-tooltip";

interface Props {
    fileName: string;
    initialValue?: string;
    onChange: (value: string) => void;
}

export const CodeEditor = ({
    fileName,
    initialValue = "",
    onChange
}: Props) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    const languageExtension = useMemo(() => {
        return getLanguageExtension(fileName)
    }, [fileName])

    useEffect(() => {
        if (!editorRef.current) return;

        const view = new EditorView({
            doc: initialValue,
            parent: editorRef.current,
            extensions: [
                languageExtension,
                oneDark,
                customTheme,
                customSetup,
                // 加载插件还有优先级
                suggestion(fileName),
                quickEdit(fileName),
                selectionTooltip(),
                keymap.of([indentWithTab]),
                minimap(),
                indentationMarkers(),
                // 监听用户输入，调用onChange
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                })
            ],
        });

        viewRef.current = view;

        return () => {
            view.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- initialValue is only used for initial document
    }, [languageExtension]);

    return (
        <div ref={editorRef} className="size-full pl-4 bg-background" />
    );
};