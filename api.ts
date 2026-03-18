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
        const { authApi } = await import('@/lib/api');
        const { getPermittedViews } = await import('@/lib/api/tableauApi');

        // Get current user for oidc_sub
        const userRes = await authApi.getCurrentUser();
        const oidcSub = userRes?.data?.oidc_sub || userRes?.oidc_sub;

        if (!oidcSub) {
            setAttempted(true);
            setLoading(false);
            return;
        }

        // Fetch permitted views (same API as insights page)
        const permittedData = await getPermittedViews(oidcSub);

        if (permittedData.success && permittedData.views) {
            // Find matching view by name
            const cleanTitle = title.toLowerCase();
            const match = permittedData.views.find((v: any) => {
                const vName = (v.name || '').toLowerCase();
                const cvName = (v.customized_name || '').toLowerCase();
                const wName = (v.workbook_name || '').toLowerCase();
                return vName === cleanTitle 
                    || cvName === cleanTitle 
                    || wName === cleanTitle
                    || cleanTitle.includes(vName)
                    || vName.includes(cleanTitle);
            });

            if (match) {
                // Build URL exactly like insights page does
                const repoUrlParts = (match.repository_url || '').split('/');
                const viewName = repoUrlParts[repoUrlParts.length - 1] || match.name;
                const siteNamespace = (match.site_url_namespace || 'CIS').toLowerCase();
                const builtUrl = `https://tableau.cib.echonet/#/site/${siteNamespace}/views/${match.workbook_repo_url}/${viewName}?:iid=${match.index || 1}`;

                setResolvedUrl(builtUrl);
                sessionStorage.setItem('dashboard_direct_url', builtUrl);
                window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
                return;
            }
        }

        // No match found
        setAttempted(true);
    } catch {
        setAttempted(true);
    } finally {
        setLoading(false);
    }
};




import { SearchResultItem } from '@/lib/api/searchApi';