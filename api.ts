const handleExpand = (uri: string, card: InsightCard) => {
    const title = card.customized_name || card.view_name || 'Dashboard';
    const fullUrl = card.url_attempt_2_repo || uri;
    
    window.location.href = `/dashboard?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&from=/insights`;
};







function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const directUrl = searchParams.get('url');
    const view = searchParams.get('view');
    const iid = searchParams.get('iid') || '1';
    const backTo = searchParams.get('from') || '/';
    const title = searchParams.get('title') || 'Dashboard View';

    if (!directUrl && !view) {
        router.push('/');
        return null;
    }

    const tableauUrl = directUrl 
        ? `${directUrl}&:embed=y&:toolbar=no`
        : `https://tableau.cib.echonet/#/site/CIS/${view}?:iid=${iid}&:embed=y&:toolbar=no`;

    return (
        <div className="home-page dashboard-page">
            <Header title={title} />
            <DashboardView
                url={tableauUrl}
                title={title}
                onBack={() => router.push(backTo)}
            />
        </div>
    );
}




