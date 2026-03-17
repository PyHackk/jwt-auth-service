try {
    const [pinnedCardsData, currentUser] = await Promise.all([
        getPinnedCards().catch(err => {
            console.error('Error loading pinned cards:', err);
            return { success: false, data: [] };
        }),
        authApi.getCurrentUser().catch(err => {
            console.error('Error getting current user:', err);
            return null;
        }),
    ]);

    // Use only permitted-views for both sections
    let allCards: InsightCard[] = [];
    
    if (currentUser && currentUser.oidc_sub) {
        const permittedData = await getPermittedViews(currentUser.oidc_sub).catch(err => {
            console.error('Error fetching permitted views:', err);
            return { success: false, views: [] };
        });

        if (permittedData.success && permittedData.views) {
            allCards = permittedData.views.slice(0, 100).map((view: any) => {
                // Build the correct URL from permitted-views fields
                const repoUrlParts = (view.repository_url || '').split('/');
                const viewName = repoUrlParts[repoUrlParts.length - 1] || view.name;
                const siteNamespace = (view.site_url_namespace || 'CIS').toLowerCase();
                const builtUrl = `https://tableau.cib.echonet/#/site/${siteNamespace}/views/${view.workbook_repo_url}/${viewName}?:iid=${view.index || 1}`;

                return {
                    id: view.id,
                    customized_name: view.name || view.title || 'Untitled',
                    site_name: view.site_url_namespace,
                    url_attempt_1_url_id: view.url_id || '',
                    url_attempt_2_repo: builtUrl,
                    url_attempt_2_simple: view.workbook_repo_url || '',
                    site_id: view.site_id,
                    url_id: view.repository_url || '',
                    view_index: view.index || 0,
                    view_name: view.name || '',
                    view_repository_url: view.repository_url || '',
                    workbook_name: view.workbook_name || '',
                    workbook_repo_url: view.workbook_repo_url || '',
                    last_accessed: new Date().toISOString(),
                    is_public: true,
                    view_count: 0,
                    owner: view.owner_id ? `User ${view.owner_id}` : 'Unknown',
                };
            });
        }
    }

    const sortedByViews = [...allCards].sort(() => Math.random() - 0.5);
    setAllRecommendedCards(sortedByViews.slice(0, 50));
    setAllPermissionedCards(sortedByViews.slice(0, 50));
    cachedRecommended = sortedByViews;
    cachedPermissioned = sortedByViews;
    setRecommendedPreview(sortedByViews.slice(0, 10));
    setPermissionedPreview(sortedByViews.slice(0, 10));

    if (pinnedCardsData.success && pinnedCardsData.data) {
        const cards: InsightCard[] = pinnedCardsData.data.map((pinnedCard: any) => ({
            id: pinnedCard.card_id,
            customized_name: pinnedCard.customized_name || '',
            url_id: pinnedCard.url_id || '',
            view_name: pinnedCard.view_name,
            view_repository_url: pinnedCard.view_repository_url || '',
            view_index: pinnedCard.view_index || 0,
            workbook_name: pinnedCard.workbook_name,
            workbook_repo_url: pinnedCard.workbook_repo_url || '',
            site_name: pinnedCard.site_name || '',
            last_accessed: pinnedCard.last_accessed || '',
            is_public: pinnedCard.is_public || false,
            url_attempt_1_url_id: pinnedCard.url_attempt_1_url_id || '',
            url_attempt_2_repo: pinnedCard.url_attempt_2_repo,
            url_attempt_2_simple: pinnedCard.url_attempt_2_repo || '',
            view_count: 0,
            owner: '',
        }));
        setPinnedCards(cards);
        cachedPinned = cards;
    }

    try {
        sessionStorage.setItem(INSIGHTS_CACHE_KEY, JSON.stringify({
            recommended: cachedRecommended,
            permissioned: cachedPermissioned,
            recommendedPreview: cachedRecommended.slice(0, 10),
            permissionedPreview: cachedPermissioned.slice(0, 10),
        }));
        sessionStorage.setItem(INSIGHTS_CACHE_EXPIRY, String(Date.now() + INSIGHTS_CACHE_DURATION));
    } catch (e) {}











async function prefetchInsightsData(oidcSub: string) {
    try {
        const expiry = sessionStorage.getItem(INSIGHTS_CACHE_EXPIRY);
        if (expiry && Date.now() < parseInt(expiry)) return;

        const permittedData = await getPermittedViews(oidcSub).catch(() => ({ success: false, views: [] }));

        const cards = permittedData.success && permittedData.views
            ? permittedData.views.slice(0, 100).map((v: any) => {
                const repoUrlParts = (v.repository_url || '').split('/');
                const viewName = repoUrlParts[repoUrlParts.length - 1] || v.name;
                const siteNamespace = (v.site_url_namespace || 'CIS').toLowerCase();
                const builtUrl = `https://tableau.cib.echonet/#/site/${siteNamespace}/views/${v.workbook_repo_url}/${viewName}?:iid=${v.index || 1}`;

                return {
                    id: v.id,
                    customized_name: v.name || v.title || 'Untitled',
                    site_name: v.site_url_namespace,
                    url_attempt_1_url_id: v.url_id || '',
                    url_attempt_2_repo: builtUrl,
                    url_attempt_2_simple: v.workbook_repo_url || '',
                    site_id: v.site_id,
                    url_id: v.repository_url || '',
                    view_index: v.index || 0,
                    view_name: v.name || '',
                    view_repository_url: v.repository_url || '',
                    workbook_name: v.workbook_name || '',
                    workbook_repo_url: v.workbook_repo_url || '',
                    last_accessed: new Date().toISOString(),
                    is_public: true,
                    view_count: 0,
                    owner: v.owner_id ? `User ${v.owner_id}` : 'Unknown',
                };
            })
            : [];

        sessionStorage.setItem(INSIGHTS_CACHE_KEY, JSON.stringify({
            recommended: cards,
            permissioned: cards,
            recommendedPreview: cards.slice(0, 10),
            permissionedPreview: cards.slice(0, 10),
        }));
        sessionStorage.setItem(INSIGHTS_CACHE_EXPIRY, String(Date.now() + INSIGHTS_CACHE_DURATION));
    } catch (e) {}
}


