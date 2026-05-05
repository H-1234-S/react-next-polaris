import { create } from "zustand";

import { Id } from "../../../../convex/_generated/dataModel";

interface TabState {
    openTabs: Id<"files">[];       // 当前项目中所有已打开的文件 ID 列表
    activeTabId: Id<"files"> | null;   // 当前激活（显示在前台）的标签页
    previewTabId: Id<"files"> | null;  // 预览模式的标签页（临时标签页）
};

const defaultTabState: TabState = {
    openTabs: [],
    activeTabId: null,
    previewTabId: null,
};

interface EditorStore {
    tabs: Map<Id<"projects">, TabState>;

    getTabState: (projectId: Id<"projects">) => TabState;
    openFile: (
        projectId: Id<"projects">,
        fileId: Id<"files">,
        options: { pinned: boolean }
    ) => void;
    closeTab: (projectId: Id<"projects">, fileId: Id<"files">) => void;
    closeAllTabs: (projectId: Id<"projects">) => void;
    setActiveTab: (projectId: Id<"projects">, fileId: Id<"files">) => void;
};

export const useEditorStore = create<EditorStore>()((set, get) => ({
    tabs: new Map(),

    getTabState: (projectId) => {
        return get().tabs.get(projectId) ?? defaultTabState;
    },

    /**
     * 打开文件三种方式：作为预览打开、作为固定打开、已打开只需要激活
     * @param projectId 
     * @param fileId 
     * @param param2 
     * @returns 
     */
    openFile: (projectId, fileId, { pinned }) => {
        // 创建浅拷贝
        const tabs = new Map(get().tabs);
        const state = tabs.get(projectId) ?? defaultTabState;
        const { openTabs, previewTabId } = state;
        const isOpen = openTabs.includes(fileId);

        // 案例 1：以预览方式打开 - 替换现有预览或添加新的
        if (!isOpen && !pinned) {
            const newTabs = previewTabId
                ? openTabs.map((id) => (id === previewTabId) ? fileId : id)
                : [...openTabs, fileId]

            tabs.set(projectId, {
                openTabs: newTabs,
                activeTabId: fileId,
                previewTabId: fileId,
            });
            set({ tabs });
            return;
        }

        // 案例 2：作为固定打开 - 添加新标签
        if (!isOpen && pinned) {
            tabs.set(projectId, {
                ...state,
                openTabs: [...openTabs, fileId],
                activeTabId: fileId,
            });
            set({ tabs });
            return;
        }

        // 情况 3：文件已打开 - 只需激活（如果双击则固定）
        const shouldPin = pinned && previewTabId === fileId;
        tabs.set(projectId, {
            ...state,
            activeTabId: fileId,
            previewTabId: shouldPin ? null : previewTabId,
        });
        set({ tabs });
    },

    closeTab: (projectId, fileId) => {
        const tabs = new Map(get().tabs);
        const state = tabs.get(projectId) ?? defaultTabState;
        const { openTabs, activeTabId, previewTabId } = state;
        const tabIndex = openTabs.indexOf(fileId);

        if (tabIndex === -1) return;

        // 删除后展示的新标签页面
        const newTabs = openTabs.filter((id) => id !== fileId);

        let newActiveTabId = activeTabId;

        /**
         *  关闭旧标签打开新标签逻辑：
         * 
         *  - 如果关闭标签是当前激活标签才进行操作
         * 
         *  - 如果标签全关闭，那么newActiveTabId = null
         * 
         *  - 如果关闭最后一个标签，那么激活关闭后的array tab的倒数第一个
         * 
         *  - 否则激活下一个标签
         */
        if (activeTabId === fileId) {
            if (newTabs.length === 0) {
                newActiveTabId = null;
            } else if (tabIndex >= newTabs.length) {
                newActiveTabId = newTabs[newTabs.length - 1];
            } else {
                newActiveTabId = newTabs[tabIndex];
            }
        }

        tabs.set(projectId, {
            openTabs: newTabs,
            activeTabId: newActiveTabId,
            previewTabId: previewTabId === fileId ? null : previewTabId,
        });
        set({ tabs });
    },

    closeAllTabs: (projectId) => {
        const tabs = new Map(get().tabs);
        tabs.set(projectId, defaultTabState);
        set({ tabs });
    },

    setActiveTab: (projectId, fileId) => {
        const tabs = new Map(get().tabs);
        const state = tabs.get(projectId) ?? defaultTabState;
        tabs.set(projectId, { ...state, activeTabId: fileId });
        set({ tabs });
    },
}));