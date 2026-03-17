const handleOpen = async () => {
    const m = item.metadata || {};
    
    // Dashboards: use url_with_repo directly
    if (m.url_with_repo) {
        const title = (item.title || '').replace(/<[^>]*>/g, '');
        sessionStorage.setItem('dashboard_direct_url', m.url_with_repo);
        window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
        return;
    }
    
    // Workbooks: try to resolve URL
    setLoading(true);
    try {
        const title = (item.title || '').replace(/<[^>]*>/g, '');
        const siteNamespace = (m.site_name || 'CIS').toLowerCase();
        const repoUrl = m.repository_url || '';
        
        // Try resolveTableauUrl first
        const uri = await resolveTableauUrl(
            m.view_name || title,
            m.workbook_name || repoUrl
        );
        
        setAttempted(true);
        if (uri) {
            sessionStorage.setItem('dashboard_direct_url', uri);
            window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
        } else {
            // Fallback: build URL from workbook repo
            const builtUrl = `https://tableau.cib.echonet/#/site/${siteNamespace}/views/${repoUrl}`;
            sessionStorage.setItem('dashboard_direct_url', builtUrl);
            window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
        }
    } catch {
        setAttempted(true);
    } finally {
        setLoading(false);
    }
};
