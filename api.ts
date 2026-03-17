const handleOpen = async () => {
    const m = item.metadata || {};

    // If we already have url_with_repo, go straight
    if (m.url_with_repo) {
        const title = (item.title || '').replace(/<[^>]*>/g, '');
        sessionStorage.setItem('dashboard_direct_url', m.url_with_repo);
        window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
        return;
    }

    setLoading(true);
    try {
        const title = (item.title || '').replace(/<[^>]*>/g, '');
        const siteNamespace = (m.site_name || 'CIS').toLowerCase();
        const repoUrl = m.repository_url || '';

        // Try resolve endpoint first
        const res = await resolveTableauUrl({
            m_view_name: m.view_name || title,
            m_workbook_name: m.workbook_name || repoUrl,
        });

        setAttempted(true);
        if (res) {
            setResolvedUrl(res);
            sessionStorage.setItem('dashboard_direct_url', res);
            window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
        } else {
            // Fallback: build URL manually
            const builtUrl = `https://tableau.cib.echonet/#/site/${siteNamespace}/views/${repoUrl}?:iid=1`;
            setResolvedUrl(builtUrl);
            sessionStorage.setItem('dashboard_direct_url', builtUrl);
            window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
        }
    } catch {
        setAttempted(true);
    } finally {
        setLoading(false);
    }
};
