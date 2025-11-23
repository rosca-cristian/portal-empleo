import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    isOpen?: boolean;
}

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Mock file structure based on routes
    const [files, setFiles] = useState<FileNode[]>([
        {
            name: 'src',
            path: '/src',
            type: 'folder',
            isOpen: true,
            children: [
                {
                    name: 'pages',
                    path: '/src/pages',
                    type: 'folder',
                    isOpen: true,
                    children: [
                        { name: 'Landing.tsx', path: '/', type: 'file' },
                        { name: 'Login.tsx', path: '/login', type: 'file' },
                        { name: 'Browse.tsx', path: '/browse', type: 'file' },
                        { name: 'Dashboard.tsx', path: '/dashboard', type: 'file' },
                        { name: 'Profile.tsx', path: '/profile', type: 'file' },
                    ]
                },
                {
                    name: 'components',
                    path: '/src/components',
                    type: 'folder',
                    isOpen: false,
                    children: [
                        { name: 'Button.tsx', path: '/components/button', type: 'file' },
                        { name: 'Input.tsx', path: '/components/input', type: 'file' },
                    ]
                },
                { name: 'App.tsx', path: '/app', type: 'file' },
                { name: 'main.tsx', path: '/main', type: 'file' },
            ]
        },
        { name: 'package.json', path: '/package', type: 'file' },
        { name: 'README.md', path: '/readme', type: 'file' },
    ]);

    const toggleFolder = (node: FileNode, path: string) => {
        if (node.path === path) {
            node.isOpen = !node.isOpen;
            return true;
        }
        if (node.children) {
            for (const child of node.children) {
                if (toggleFolder(child, path)) return true;
            }
        }
        return false;
    };

    const handleFolderClick = (path: string) => {
        const newFiles = [...files];
        for (const file of newFiles) {
            toggleFolder(file, path);
        }
        setFiles(newFiles);
    };

    const renderTree = (nodes: FileNode[], depth = 0) => {
        return nodes.map((node) => (
            <div key={node.path}>
                <div
                    onClick={() => {
                        if (node.type === 'folder') {
                            handleFolderClick(node.path);
                        } else {
                            navigate(node.path);
                        }
                    }}
                    style={{
                        paddingLeft: `${depth * 12 + 10}px`,
                        paddingRight: '10px',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: location.pathname === node.path ? 'var(--selection-bg)' : 'transparent',
                        color: location.pathname === node.path ? '#ffffff' : 'var(--color-text-secondary)',
                    }}
                    className="sidebar-item"
                >
                    {node.type === 'folder' && (
                        <span style={{ opacity: 0.7 }}>
                            {node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                    )}
                    {node.type === 'folder' ? (
                        node.isOpen ? <FolderOpen size={14} color="#dcb67a" /> : <Folder size={14} color="#dcb67a" />
                    ) : (
                        <FileCode size={14} color={node.name.endsWith('.tsx') ? '#4d9375' : '#d4d4d4'} />
                    )}
                    <span style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {node.name}
                    </span>
                </div>
                {node.type === 'folder' && node.isOpen && node.children && (
                    <div>{renderTree(node.children, depth + 1)}</div>
                )}
            </div>
        ));
    };

    return (
        <div style={{
            width: '250px',
            backgroundColor: 'var(--sidebar-bg)',
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto'
        }}>
            <div style={{
                padding: '10px 20px',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span>Explorer</span>
                <span>...</span>
            </div>
            <div style={{
                padding: '0',
                flex: 1
            }}>
                <div style={{
                    padding: '4px 10px',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <ChevronDown size={14} />
                    PORTAL-EMPLEO
                </div>
                {renderTree(files)}
            </div>
        </div>
    );
};

export default Sidebar;
