class ResolveView(APIView):

    def get(self, request):
        view_name = request.query_params.get('view_name', '')
        workbook_name = request.query_params.get('workbook_name', '')

        if not view_name and not workbook_name:
            return Response({'url': None, 'error': 'Missing parameters'}, status=status.HTTP_400_BAD_REQUEST)

        from django.db import connections

        query = """
            SELECT
                cv.url_id,
                v.name AS view_name,
                v.repository_url AS view_repo,
                w.name AS workbook_name,
                w.repository_url AS workbook_repo,
                s.url_namespace AS site_namespace
            FROM customized_views cv
            JOIN views v ON cv.view_id = v.id
            JOIN workbooks w ON v.workbook_id = w.id
            JOIN sites s ON cv.site_id = s.id
            WHERE cv.hidden = FALSE
              AND (LOWER(v.name) = LOWER(%s) OR LOWER(cv.name) = LOWER(%s))
            ORDER BY cv.accessed_at DESC NULLS LAST
            LIMIT 1
        """

        try:
            with connections['tableau'].cursor() as cursor:
                search_term = view_name or workbook_name
                cursor.execute(query, [search_term, search_term])
                row = cursor.fetchone()

            if not row:
                return Response({'url': None})

            columns = [col[0] for col in cursor.description]
            rd = dict(zip(columns, row))

            site_ns = (rd.get('site_namespace') or 'CIS').lower()
            wb_repo = rd.get('workbook_repo') or ''
            view_repo = rd.get('view_repo') or ''

            # Extract view name from the last segment of repository_url
            view_name_part = view_repo.split('/')[-1] if '/' in view_repo else view_repo

            url = ''
            if site_ns and wb_repo and view_name_part:
                url = f"https://tableau.cib.echonet/#/site/{site_ns}/views/{wb_repo}/{view_name_part}?:iid=1"

            return Response({'url': url})

        except Exception as exc:
            return Response({'url': None, 'error': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
