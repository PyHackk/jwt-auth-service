{!loading && [...groups].sort((a, b) => {
    const order: Record<string, number> = { 'Dashboards': 1, 'Workbooks': 2 };
    const aOrder = order[a.category] || 99;
    const bOrder = order[b.category] || 99;
    return aOrder - bOrder;
}).map((group) => (





const handleOpen = async () => {
    const url = m.url_with_repo || item.url || '';
    if (url) {
        const title = (item.title || '').replace(/<[^>]*>/g, '');
        sessionStorage.setItem('dashboard_direct_url', url);
        window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
        return;
    }

    // Fallback: try to resolve URL
    setLoading(true);
    try {
        const uri = await resolveTableauUrl(
            m.view_name || item.title.replace(/<[^>]*>/g, ''),
            m.workbook_name || ''
        );
        setAttempted(true);
        if (uri) {
            sessionStorage.setItem('dashboard_direct_url', uri);
            window.location.href = `/dashboard?title=${encodeURIComponent((item.title || '').replace(/<[^>]*>/g, ''))}&from=/`;
        }
    } finally {
        setLoading(false);
    }
};




{loading ? 'Resolving...' : attempted && !resolvedUrl ? 'Link unavailable' : 'Open Dashboard'}
