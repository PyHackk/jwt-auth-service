if (cached) {
    const data = JSON.parse(cached);
    setAllRecommendedCards(data.recommended);
    setAllPermissionedCards(data.permissioned);
    setRecommendedPreview(data.recommendedPreview);
    setPermissionedPreview(data.permissionedPreview);
    setIsPageLoading(false);

    // Fetch pinned cards in background (no await)
    getPinnedCards().then(pinnedResponse => {
        if (pinnedResponse.success && pinnedResponse.data) {
            const cards = pinnedResponse.data.map((pinnedCard: any) => ({
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
                url_attempt_2_simple: pinnedCard.url_attempt_2_repo,
                view_count: 0,
                owner: '',
            }));
            setPinnedCards(cards);
            setAllPinnedCards(cards);
        }
    }).catch(() => {}).finally(() => setPinnedCardsLoading(false));

    return;
}
