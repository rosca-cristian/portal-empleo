import React, { useState } from 'react';
import ActivityBar from './ActivityBar';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';
import EditorTab from './EditorTab';
import { FileCode } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface IDELayoutProps {
    children: React.ReactNode;
}

const IDELayout: React.FC<IDELayoutProps> = ({ children }) => {
    const location = useLocation();
    const [sidebarVisible] = useState(true);

    // Determine current tab based on route
    const getTabInfo = () => {
        const path = location.pathname;
        if (path === '/') return { label: 'Landing.tsx', icon: <FileCode size={14} color="#4d9375" /> };
        if (path === '/login') return { label: 'Login.tsx', icon: <FileCode size={14} color="#4d9375" /> };
        if (path === '/signup') return { label: 'Signup.tsx', icon: <FileCode size={14} color="#4d9375" /> };
        if (path === '/browse') return { label: 'Browse.tsx', icon: <FileCode size={14} color="#4d9375" /> };
        if (path === '/dashboard') return { label: 'Dashboard.tsx', icon: <FileCode size={14} color="#4d9375" /> };
        if (path.startsWith('/jobs')) return { label: 'JobDetail.tsx', icon: <FileCode size={14} color="#4d9375" /> };
        if (path.startsWith('/profile')) return { label: 'Profile.tsx', icon: <FileCode size={14} color="#4d9375" /> };
        return { label: 'Unknown.tsx', icon: <FileCode size={14} color="#d4d4d4" /> };
    };

    const currentTab = getTabInfo();

    // Mock open tabs
    const tabs = [
        { label: 'Landing.tsx', path: '/', icon: <FileCode size={14} color="#4d9375" /> },
        { label: 'Login.tsx', path: '/login', icon: <FileCode size={14} color="#4d9375" /> },
        { label: 'Browse.tsx', path: '/browse', icon: <FileCode size={14} color="#4d9375" /> },
    ];

    // Ensure current tab is in the list
    if (!tabs.find(t => t.path === location.pathname)) {
        tabs.push({ ...currentTab, path: location.pathname });
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            backgroundColor: 'var(--editor-bg)',
            color: 'var(--color-text-primary)',
            overflow: 'hidden'
        }}>
            {/* Main Content Area */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Activity Bar */}
                <ActivityBar />

                {/* Sidebar */}
                {sidebarVisible && <Sidebar />}

                {/* Editor Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Tabs */}
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'var(--tab-inactive-bg)',
                        overflowX: 'auto',
                        scrollbarWidth: 'none'
                    }}>
                        {tabs.map(tab => (
                            <EditorTab
                                key={tab.path}
                                label={tab.label}
                                path={tab.path}
                                isActive={location.pathname === tab.path}
                                icon={tab.icon}
                            />
                        ))}
                    </div>

                    {/* Breadcrumbs / Navigation Path */}
                    <div style={{
                        padding: '4px 16px',
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                        borderBottom: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span>src</span>
                        <span>&gt;</span>
                        <span>pages</span>
                        <span>&gt;</span>
                        <span style={{ color: 'var(--color-text-primary)' }}>{currentTab.label}</span>
                    </div>

                    {/* Page Content */}
                    <div style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: '0',
                        position: 'relative'
                    }}>
                        {/* Line Numbers Gutter (Visual only for now) */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '50px',
                            backgroundColor: 'var(--editor-bg)',
                            borderRight: '1px solid var(--color-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            paddingRight: '10px',
                            paddingTop: '20px',
                            color: 'var(--line-number-fg)',
                            fontSize: '13px',
                            fontFamily: 'var(--font-mono)',
                            userSelect: 'none',
                            zIndex: 10
                        }}>
                            {Array.from({ length: 50 }).map((_, i) => (
                                <div key={i} style={{ lineHeight: '1.5' }}>{i + 1}</div>
                            ))}
                        </div>

                        {/* Actual Content Wrapper */}
                        <div style={{
                            paddingLeft: '60px', /* Space for gutter */
                            paddingTop: '20px',
                            paddingRight: '20px',
                            paddingBottom: '20px',
                            minHeight: '100%',
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <StatusBar />
        </div>
    );
};

export default IDELayout;
