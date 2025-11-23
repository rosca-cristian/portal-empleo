import React from 'react';
import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface EditorTabProps {
    label: string;
    path: string;
    isActive: boolean;
    icon?: React.ReactNode;
}

const EditorTab: React.FC<EditorTabProps> = ({ label, path, isActive, icon }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(path)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: isActive ? 'var(--tab-active-bg)' : 'var(--tab-inactive-bg)',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                borderRight: '1px solid var(--color-border)',
                borderTop: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '13px',
                minWidth: '120px',
                maxWidth: '200px',
                userSelect: 'none'
            }}
        >
            {icon && <span style={{ display: 'flex' }}>{icon}</span>}
            <span style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1
            }}>
                {label}
            </span>
            <span
                className="tab-close"
                style={{
                    opacity: isActive ? 1 : 0,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                    padding: '2px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <X size={14} />
            </span>
        </div>
    );
};

export default EditorTab;
