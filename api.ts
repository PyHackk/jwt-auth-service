debounceRef.current = setTimeout(async () => {
    try {
        const response = await searchPortal(value);
        const esResults = response.results || [];

        // Also search permitted views
        let permittedGroup: SearchResultGroup | null = null;
        try {
            const { authApi } = await import('@/lib/api');
            const { getPermittedViews } = await import('@/lib/api/tableauApi');
            const userRes = await authApi.getCurrentUser();
            const oidcSub = (userRes as any)?.data?.oidc_sub || (userRes as any)?.oidc_sub;

            if (oidcSub) {
                const permittedData = await getPermittedViews(oidcSub);
                if (permittedData.success && permittedData.views) {
                    const q = value.toLowerCase();
                    const matched = permittedData.views.filter((v: any) => {
                        const name = (v.name || '').toLowerCase();
                        const customName = (v.customized_name || '').toLowerCase();
                        const wbName = (v.workbook_name || '').toLowerCase();
                        return name.includes(q) || customName.includes(q) || wbName.includes(q);
                    });

                    if (matched.length > 0) {
                        permittedGroup = {
                            category: 'Dashboards',
                            items: matched.slice(0, 10).map((v: any) => ({
                                id: v.id?.toString() || Math.random().toString(),
                                score: 200,
                                doc_type: 'dashboard',
                                title: v.name || v.customized_name || '',
                                subtitle: `${v.workbook_name || ''} — ${v.site_url_namespace || 'CIS'}`,
                                category: 'Dashboards',
                                route: '',
                                url: '',
                                metadata: {
                                    view_name: v.name,
                                    workbook_name: v.workbook_name,
                                    site_name: v.site_url_namespace,
                                    repository_url: v.repository_url,
                                    workbook_repo_url: v.workbook_repo_url,
                                    site_url_namespace: v.site_url_namespace,
                                    index: v.index,
                                }
                            }))
                        };
                    }
                }
            }
        } catch (e) {}

        // Merge and deduplicate
        let merged = [...esResults];

        if (permittedGroup) {
            const existingDashIdx = merged.findIndex(g => g.category === 'Dashboards');
            if (existingDashIdx >= 0) {
                const existingItems = merged[existingDashIdx].items;
                const newItems = permittedGroup.items.filter(newItem => {
                    const newTitle = (newItem.title || '').replace(/<[^>]*>/g, '').toLowerCase();
                    return !existingItems.some(existing => {
                        const existTitle = (existing.title || '').replace(/<[^>]*>/g, '').toLowerCase();
                        return existTitle === newTitle;
                    });
                });
                merged[existingDashIdx] = {
                    ...merged[existingDashIdx],
                    items: [...permittedGroup.items, ...existingItems.filter(existing => {
                        const existTitle = (existing.title || '').replace(/<[^>]*>/g, '').toLowerCase();
                        return !permittedGroup!.items.some(newItem => {
                            const newTitle = (newItem.title || '').replace(/<[^>]*>/g, '').toLowerCase();
                            return newTitle === existTitle;
                        });
                    })]
                };
            } else {
                merged.push(permittedGroup);
            }
        }

        // Deduplicate within each group
        merged = merged.map(group => ({
            ...group,
            items: group.items.filter((item, index, self) => {
                const cleanTitle = (item.title || '').replace(/<[^>]*>/g, '').toLowerCase();
                return index === self.findIndex(other => {
                    const otherTitle = (other.title || '').replace(/<[^>]*>/g, '').toLowerCase();
                    return cleanTitle === otherTitle;
                });
            })
        })).filter(group => group.items.length > 0);

        setSearchResults(merged);
    } catch (err: any) {
