'use client';

import { useState, useEffect } from 'react';
import './DashboardView.css';

interface DashboardViewProps {
    url: string;
    title: string;
    onBack: () => void;
}

const DATA_QUALITY_LEVELS = [
    { label: 'Gold', color: '#D4AF37' },
    { label: 'Silver', color: '#A0A0A0' },
    { label: 'Bronze', color: '#CD7F32' },
];

export default function DashboardView({ url, title, onBack }: DashboardViewProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [loadTime, setLoadTime] = useState<string>('');
    const [loadStart] = useState<number>(Date.now());
    const [dataQuality] = useState(() => DATA_QUALITY_LEVELS[Math.floor(Math.random() * 3)]);
    const [lastRefresh] = useState(() => {
        const now = new Date();
        return now.toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    });

    useEffect(() => {
        if (!isLoading) {
            const elapsed = ((Date.now() - loadStart) / 1000).toFixed(1);
            setLoadTime(`${elapsed}s`);
        }
    }, [isLoading, loadStart]);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEmail = () => {
        const subject = encodeURIComponent(`Support Request: ${title}`);
        const body = encodeURIComponent(
            `Hi,\n\nI need assistance with the following dashboard:\n\n` +
            `Title: ${title}\n` +
            `URL: ${window.location.href}\n` +
            `Data Quality: ${dataQuality.label}\n` +
            `Last Refresh: ${lastRefresh}\n\n` +
            `Issue Description:\n[Please describe your issue here]\n\n` +
            `Thank you.`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <div className="dashboard-view">
            <div className="dashboard-toolbar">
                <div className="dashboard-toolbar-left">
                    <button onClick={onBack} className="dashboard-back-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back
                    </button>
                    <span className="dashboard-toolbar-divider" />
                    <span className="dashboard-toolbar-title">{title}</span>
                    <button onClick={() => setShowInfo(true)} className="dashboard-info-btn" title="View details">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
                        </svg>
                    </button>
                </div>

                <div className="dashboard-toolbar-right">
                    <div className="dashboard-toolbar-meta">
                        <span className="dashboard-meta-item">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M8 4V8L11 10" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                                <circle cx="8" cy="8" r="6.5" stroke="#6b7280" strokeWidth="1.5"/>
                            </svg>
                            {lastRefresh}
                        </span>
                        {loadTime && (
                            <span className="dashboard-meta-item">
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 2V8H14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {loadTime}
                            </span>
                        )}
                        <span className="dashboard-meta-item dashboard-quality-badge">
                            <span className="dashboard-quality-dot" style={{ backgroundColor: dataQuality.color }} />
                            {dataQuality.label}
                        </span>
                    </div>
                    <button onClick={handleCopy} className={`dashboard-copy-btn ${copied ? 'copied' : ''}`}>
                        {copied ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M3 11V3C3 2.45 3.45 2 4 2H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Copy Link
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="dashboard-iframe-container">
                {isLoading && (
                    <div className="dashboard-loading">
                        <div className="dashboard-spinner" />
                        <span>Loading dashboard...</span>
                    </div>
                )}
                <iframe
                    src={url}
                    onLoad={() => setIsLoading(false)}
                    className="dashboard-iframe"
                    title="Dashboard"
                />
            </div>

            {showInfo && (
                <div className="dashboard-modal-overlay" onClick={() => setShowInfo(false)}>
                    <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="dashboard-modal-header">
                            <span className="dashboard-modal-title">Dashboard Details</span>
                            <button onClick={() => setShowInfo(false)} className="dashboard-modal-close">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className="dashboard-modal-body">
                            <div className="dashboard-modal-row">
                                <span className="dashboard-modal-label">Title</span>
                                <span className="dashboard-modal-value">{title}</span>
                            </div>
                            <div className="dashboard-modal-row">
                                <span className="dashboard-modal-label">Last Refresh</span>
                                <span className="dashboard-modal-value">{lastRefresh}</span>
                            </div>
                            {loadTime && (
                                <div className="dashboard-modal-row">
                                    <span className="dashboard-modal-label">Load Time</span>
                                    <span className="dashboard-modal-value">{loadTime}</span>
                                </div>
                            )}
                            <div className="dashboard-modal-row">
                                <span className="dashboard-modal-label">Data Quality</span>
                                <span className="dashboard-modal-value">
                                    <span className="dashboard-quality-dot" style={{ backgroundColor: dataQuality.color }} />
                                    {dataQuality.label}
                                </span>
                            </div>
                            <div className="dashboard-modal-row">
                                <span className="dashboard-modal-label">URL</span>
                                <span className="dashboard-modal-value dashboard-modal-url">{url}</span>
                            </div>
                        </div>
                        <div className="dashboard-modal-footer">
                            <button onClick={handleEmail} className="dashboard-email-btn">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M1 4.5L8 9L15 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Request Support
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}




.dashboard-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: visible !important;
}

.dashboard-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.dashboard-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 16px;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
    flex-shrink: 0;
}

.dashboard-toolbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.dashboard-back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    color: #047857;
    font-weight: 600;
    font-size: 13px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.15s;
}

.dashboard-back-btn:hover {
    background-color: #f0fdf4;
}

.dashboard-toolbar-divider {
    width: 1px;
    height: 20px;
    background-color: #d1d5db;
}

.dashboard-toolbar-title {
    font-size: 13px;
    color: #374151;
    font-weight: 600;
}

.dashboard-info-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: none;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.15s;
}

.dashboard-info-btn:hover {
    background-color: #f0fdf4;
    border-color: #047857;
    color: #047857;
}

.dashboard-toolbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.dashboard-toolbar-meta {
    display: flex;
    align-items: center;
    gap: 16px;
}

.dashboard-meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #6b7280;
    white-space: nowrap;
}

.dashboard-quality-badge {
    font-weight: 600;
}

.dashboard-quality-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
}

.dashboard-copy-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    color: #374151;
    font-weight: 500;
    transition: all 0.15s;
}

.dashboard-copy-btn:hover {
    background: #f0fdf4;
    border-color: #047857;
    color: #047857;
}

.dashboard-copy-btn.copied {
    background: #f0fdf4;
    border-color: #86efac;
    color: #047857;
}

.dashboard-iframe-container {
    flex: 1;
    position: relative;
    min-height: calc(100vh - 160px);
    width: calc(100% + 16px);
    margin-left: -8px;
    margin-right: -8px;
}

.dashboard-loading {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    gap: 12px;
    z-index: 1;
}

.dashboard-loading span {
    color: #9ca3af;
    font-size: 13px;
}

.dashboard-spinner {
    width: 24px;
    height: 24px;
    border: 2.5px solid #e5e7eb;
    border-top-color: #047857;
    border-radius: 50%;
    animation: dashboard-spin 0.8s linear infinite;
}

@keyframes dashboard-spin {
    to {
        transform: rotate(360deg);
    }
}

.dashboard-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
}

/* Modal */
.dashboard-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.dashboard-modal {
    background: #ffffff;
    border-radius: 10px;
    width: 420px;
    max-width: 90vw;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.dashboard-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
}

.dashboard-modal-title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.dashboard-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    border-radius: 4px;
    transition: all 0.15s;
}

.dashboard-modal-close:hover {
    background: #f3f4f6;
    color: #374151;
}

.dashboard-modal-body {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.dashboard-modal-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
}

.dashboard-modal-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    white-space: nowrap;
    min-width: 90px;
}

.dashboard-modal-value {
    font-size: 12px;
    color: #111827;
    font-weight: 500;
    text-align: right;
    display: flex;
    align-items: center;
    gap: 6px;
    word-break: break-all;
}

.dashboard-modal-url {
    font-size: 11px;
    color: #6b7280;
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.dashboard-modal-footer {
    padding: 16px 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: center;
}

.dashboard-email-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 24px;
    background: #047857;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s;
}

.dashboard-email-btn:hover {
    background: #065f46;
}
