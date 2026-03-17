const handleExpand = (uri: string, card: InsightCard) => {
    const baseUrl = 'https://tableau.cib.echonet';
    const siteNamespace = card.site_name || 'ci5';
    const workbookRepo = card.workbook_repo_url;
    let viewNameClean = card.view_name;
    if (card.view_repository_url) {
        const parts = card.view_repository_url.split('/');
        viewNameClean = parts[parts.length - 1] || card.view_name;
    }
    const viewIndex = card.view_index || 0;

    let viewPath = `views`;
    if (workbookRepo && viewNameClean) {
        viewPath = `views/${workbookRepo}/${viewNameClean}`;
    }

    const title = card.customized_name || card.view_name || 'Dashboard';
    
    window.location.href = `/dashboard?view=${encodeURIComponent(viewPath)}&title=${encodeURIComponent(title)}&from=/insights&iid=${viewIndex}`;
};
