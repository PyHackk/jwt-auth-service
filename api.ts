if (cached) {
    const data = JSON.parse(cached);
    const shuffledRecommended = [...data.recommended].sort(() => Math.random() - 0.5);
    const shuffledPermissioned = [...data.permissioned].sort(() => Math.random() - 0.5);
    setAllRecommendedCards(shuffledRecommended.slice(0, 50));
    setAllPermissionedCards(shuffledPermissioned.slice(0, 50));
    setRecommendedPreview(shuffledRecommended.slice(0, 10));
    setPermissionedPreview(shuffledPermissioned.slice(0, 10));
    setIsPageLoading(false);
    // ... rest of pinned cards fetch stays the same





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
