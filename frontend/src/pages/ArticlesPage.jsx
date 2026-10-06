import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ArticleCard from '../components/ArticleCard';
import './ArticlesPage.css';

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [pages, setPages] = useState(1);

  const activeCategory = searchParams.get('category') || '';
  const activeSearch = searchParams.get('search') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/articles', {
        params: {
          category: activeCategory || undefined,
          search: activeSearch || undefined,
          page,
          limit: 9,
        },
      })
      .then(({ data }) => {
        setArticles(data.articles);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [activeCategory, activeSearch, page]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    next.delete('page');
    setSearchParams(next);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  return (
    <div className="container articles-page">
      <div className="articles-header">
        <div>
          <span className="eyebrow">The Archive</span>
          <h1>Every article</h1>
        </div>
        <form onSubmit={submitSearch} className="articles-search">
          <input
            type="search"
            placeholder="Search articles…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="btn btn-outline btn-sm">Search</button>
        </form>
      </div>

      <div className="articles-filters">
        <label htmlFor="category-filter" className="category-filter-label">
          Category
        </label>
        <select
          id="category-filter"
          className="category-filter-select"
          value={activeCategory}
          onChange={(e) => updateParams({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="state-message">Loading articles…</div>
      ) : articles.length === 0 ? (
        <div className="state-message">No articles match your search yet.</div>
      ) : (
        <>
          <div className="article-grid">
            {articles.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>

          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={p === page ? 'is-active' : ''}
                  onClick={() => setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set('page', p);
                    return next;
                  })}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
