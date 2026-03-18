const handleOpen = async () => {
    const m = item.metadata || {};
    const title = (item.title || '').replace(/<[^>]*>/g, '');

    // Workbooks: use url_with_repo directly (already working)
    if (item.doc_type === 'workbook' && m.url_with_repo) {
        sessionStorage.setItem('dashboard_direct_url', m.url_with_repo);
        window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
        return;
    }

    // Dashboards: always go through permitted views API
    setLoading(true);
    try {
        const { authApi } = await import('@/lib/api');
        const { getPermittedViews } = await import('@/lib/api/tableauApi');

        const userRes = await authApi.getCurrentUser();
        const oidcSub = (userRes as any)?.data?.oidc_sub || (userRes as any)?.oidc_sub;

        if (!oidcSub) {
            setAttempted(true);
            setLoading(false);
            return;
        }

        const permittedData = await getPermittedViews(oidcSub);

        if (permittedData.success && permittedData.views) {
            const cleanTitle = title.toLowerCase();
            console.log('Looking for:', cleanTitle);
            console.log('Available views:', permittedData.views.slice(0, 5).map((v: any) => ({
                name: v.name,
                customized_name: v.customized_name,
                workbook_name: v.workbook_name
            })));
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
                const v: any = match;
                const repoUrlParts = (v.repository_url || '').split('/');
                const viewName = repoUrlParts[repoUrlParts.length - 1] || v.name;
                const siteNamespace = (v.site_url_namespace || 'CIS').toLowerCase();
                const builtUrl = `https://tableau.cib.echonet/#/site/${siteNamespace}/views/${v.workbook_repo_url}/${viewName}?:iid=${v.index || 1}`;

                setResolvedUrl(builtUrl);
                sessionStorage.setItem('dashboard_direct_url', builtUrl);
                window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/`;
                return;
            }
        }

        setAttempted(true);
    } catch {
        setAttempted(true);
    } finally {
        setLoading(false);
    }
};
