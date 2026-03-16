import { TableauAPI, getPermittedViews } from '@/lib/api';





const INSIGHTS_CACHE_KEY = 'insights_page_cache';
const INSIGHTS_CACHE_EXPIRY = 'insights_cache_expiry';
const INSIGHTS_CACHE_DURATION = 10 * 60 * 1000;





async function prefetchInsightsData(oidcSub: string) {
    try {
        // Skip if cache is still valid
        const expiry = sessionStorage.getItem(INSIGHTS_CACHE_EXPIRY);
        if (expiry && Date.now() < parseInt(expiry)) return;

        const [exploreData, permittedData] = await Promise.all([
            TableauAPI.explore('', 100).catch(() => ({ results: [] })),
            getPermittedViews(oidcSub).catch(() => ({ success: false, views: [] })),
        ]);

        const recommended = (exploreData.results || []).map((d: any) => ({
            id: d.id,
            customized_name: d.customized_name,
            site_name: d.site_name,
            url_attempt_1_url_id: d.url_attempt_1_url_id,
            url_attempt_2_repo: d.url_attempt_2_repo || '',
            url_attempt_2_simple: d.url_attempt_2_simple,
            url_id: d.url_id,
            view_index: d.view_index,
            view_name: d.view_name,
            view_repository_url: d.view_repository_url,
            workbook_name: d.workbook_name,
            workbook_repo_url: d.workbook_repo_url,
            last_accessed: d.last_accessed,
            is_public: d.is_public,
            view_count: d.view_count || 0,
            owner: d.owner || 'Unknown',
        }));

        const permissioned = permittedData.success && permittedData.views
            ? permittedData.views.map((v: any) => ({
                id: v.id,
                customized_name: v.name || v.title || 'Untitled',
                site_name: v.site_url_namespace,
                url_attempt_1_url_id: v.url_id || '',
                url_attempt_2_repo: v.workbook_repo_url,
                url_attempt_2_simple: v.workbook_repo_url || '',
                site_id: v.site_id,
                url_id: v.repository_url || '',
                view_index: v.view_index || 0,
                view_name: v.name || '',
                view_repository_url: v.repository_url || '',
                workbook_name: v.workbook_name || '',
                workbook_repo_url: v.workbook_repo_url || '',
                last_accessed: new Date().toISOString(),
                is_public: true,
                view_count: 0,
                owner: v.owner_id ? `User ${v.owner_id}` : 'Unknown',
            }))
            : [];

        sessionStorage.setItem(INSIGHTS_CACHE_KEY, JSON.stringify({
            recommended,
            permissioned,
            recommendedPreview: recommended.slice(0, 10),
            permissionedPreview: permissioned.slice(0, 10),
            pinned: [],
            allPinned: [],
        }));
        sessionStorage.setItem(INSIGHTS_CACHE_EXPIRY, String(Date.now() + INSIGHTS_CACHE_DURATION));
    } catch (e) {
        // Prefetch failed silently, insights will fetch on its own
    }
}




prefetchInsightsData(currentUser.oidc_sub);




if (cachedUser.oidc_sub) {
    prefetchInsightsData(cachedUser.oidc_sub);
}
