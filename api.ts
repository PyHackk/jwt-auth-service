const handleExpand = (uri: string, card: InsightCard) => {
    const title = card.customized_name || card.view_name || 'Dashboard';
    
    let fullUrl = card.url_attempt_2_repo;
    
    // If no pre-built URL, construct it (permissioned cards)
    if (!fullUrl) {
        const baseUrl = 'https://tableau.cib.echonet';
        const siteNamespace = card.site_name || 'ci5';
        const workbookRepo = card.workbook_repo_url;
        let viewNameClean = card.view_name;
        if (card.view_repository_url) {
            const parts = card.view_repository_url.split('/');
            viewNameClean = parts[parts.length - 1] || card.view_name;
        }
        const viewIndex = card.view_index || 0;
        fullUrl = `${baseUrl}/#/site/${siteNamespace}/views/${workbookRepo}/${viewNameClean}?:iid=${viewIndex}`;
    }
    
    window.location.href = `/dashboard?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&from=/insights`;
};
