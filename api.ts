const handleExpand = (uri: string, card: InsightCard) => {
    const title = card.customized_name || card.view_name || 'Dashboard';
    const fullUrl = card.url_attempt_2_repo || uri;
    
    sessionStorage.setItem('dashboard_direct_url', fullUrl);
    window.location.href = `/dashboard?title=${encodeURIComponent(title)}&from=/insights`;
};





function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const view = searchParams.get('view');
    const iid = searchParams.get('iid') || '1';
    const backTo = searchParams.get('from') || '/';
    const title = searchParams.get('title') || 'Dashboard View';
    
    // Check for direct URL from insights
    const directUrl = typeof window !== 'undefined' 
        ? sessionStorage.getItem('dashboard_direct_url') 
        : null;

    if (!directUrl && !view) {
        router.push('/');
        return null;
    }

    const tableauUrl = directUrl
        ? (directUrl.includes('?') ? `${directUrl}&:embed=y&:toolbar=no` : `${directUrl}?:embed=y&:toolbar=no`)
        : `https://tableau.cib.echonet/#/site/CIS/${view}?:iid=${iid}&:embed=y&:toolbar=no`;

    return (
        <div className="home-page dashboard-page">
            <Header title={title} />
            <DashboardView
                url={tableauUrl}
                title={title}
                onBack={() => {
                    sessionStorage.removeItem('dashboard_direct_url');
                    router.push(backTo);
                }}
            />
        </div>
    );
}
