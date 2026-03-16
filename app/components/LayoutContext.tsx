"use client";

import React, { createContext, useContext, useState } from "react";

interface LayoutContextType {
    isSidebarOpen: boolean;
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    toggleSidebarCollapsed: () => void;
    closeSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const toggleSidebarCollapsed = () => setIsSidebarCollapsed((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <LayoutContext.Provider value={{
            isSidebarOpen,
            isSidebarCollapsed,
            toggleSidebar,
            toggleSidebarCollapsed,
            closeSidebar
        }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
}
