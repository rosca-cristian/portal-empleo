import React from 'react';
import { GitBranch, Check, Bell, AlertTriangle } from 'lucide-react';

const StatusBar: React.FC = () => {
    return (
        <div style={{
            height: '22px',
            backgroundColor: 'var(--status-bar-bg)',
            color: 'var(--status-bar-fg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 10px',
            fontSize: '12px',
            fontFamily: 'var(--font-sans)',
            userSelect: 'none'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <GitBranch size={12} />
                    <span>main*</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '8px' }}>0</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <AlertTriangle size={12} />
                        <span>0</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <span style={{ marginRight: '5px' }}>Ln 115, Col 1</span>
                    <span>UTF-8</span>
                    <span>TypeScript JSX</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <Check size={12} />
                    <span>Prettier</span>
                </div>
                <div style={{ cursor: 'pointer' }}>
                    <Bell size={12} />
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
