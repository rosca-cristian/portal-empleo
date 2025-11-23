import React from 'react';
import { Files, Search, GitGraph, Box, Settings, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ActivityBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { icon: Files, path: '/', label: 'Explorer' },
        { icon: Search, path: '/browse', label: 'Search' },
        { icon: GitGraph, path: '/applications', label: 'Source Control' },
        { icon: Box, path: '/dashboard', label: 'Extensions' },
    ];

    const bottomItems = [
        { icon: User, path: '/profile', label: 'Account' },
        { icon: Settings, path: '/settings', label: 'Settings' },
    ];

    return (
        <div style={{
            width: '48px',
            backgroundColor: 'var(--activity-bar-bg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderRight: '1px solid var(--color-border)'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                {navItems.map((item) => (
                    <div
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        title={item.label}
                        style={{
                            cursor: 'pointer',
                            opacity: isActive(item.path) ? 1 : 0.5,
                            borderLeft: isActive(item.path) ? '2px solid var(--color-accent)' : '2px solid transparent',
                            paddingLeft: '10px',
                            paddingRight: '12px',
                            color: isActive(item.path) ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <item.icon size={24} strokeWidth={1.5} />
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                {bottomItems.map((item) => (
                    <div
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        title={item.label}
                        style={{
                            cursor: 'pointer',
                            opacity: isActive(item.path) ? 1 : 0.5,
                            color: 'var(--color-text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <item.icon size={24} strokeWidth={1.5} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityBar;
