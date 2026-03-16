"use client";

import Sidebar from "./Sidebar";
import { LayoutProvider, useLayout } from "./LayoutContext";

interface AppLayoutClientProps {
    children: React.ReactNode;
    userProfile?: any;
}

function AppLayoutContent({ children, userProfile }: AppLayoutClientProps) {
    const { isSidebarOpen, isSidebarCollapsed, closeSidebar } = useLayout();

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={closeSidebar}
                user={userProfile}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto w-full relative">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AppLayoutClient({ children, userProfile }: AppLayoutClientProps) {
    return (
        <LayoutProvider>
            <AppLayoutContent userProfile={userProfile}>{children}</AppLayoutContent>
        </LayoutProvider>
    );
}
