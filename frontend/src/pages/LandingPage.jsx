import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ArticleCard from '../components/ArticleCard';
import './LandingPage.css';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

export default function LandingPage() {
  const [featured, setFeatured] = useState(null);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/articles/featured'),
      api.get('/articles', { params: { limit: 6 } }),
      api.get('/categories'),
    ])
      .then(([f, l, c]) => {
        if (!mounted) return;
        setFeatured(f.data.article);
        setLatest(l.data.articles.filter((a) => a._id !== f.data.article?._id));
        setCategories(c.data.categories);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">A magazine for people who read closely</span>
          <h1 className="hero-title">
            Ideas worth reading.
            <br />
            Conversations worth joining.
          </h1>
          <p className="hero-sub">
            Inkora is a home for essays, reporting, and fiction — and for the readers who
            show up to talk about them.
          </p>
          <div className="hero-actions">
            <Link to="/auth" className="btn btn-primary">
              Explore Articles
            </Link>
            <Link to="/about" className="btn btn-outline">
              About Inkora
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <hr className="hairline" />
      </div>

      {loading ? (
        <div className="state-message">Gathering today's stories…</div>
      ) : (
        <>
          {featured && (
            <section className="featured">
              <div className="container featured-inner">
                <span className="eyebrow">Featured</span>
                <Link to={`/articles/${featured.slug}`} className="featured-grid">
                  <div className="featured-image">
                    {featured.coverImage && <img src={featured.coverImage} alt="" />}
                  </div>
                  <div className="featured-body">
                    {featured.category?.name && (
                      <span className="tag">{featured.category.name}</span>
                    )}
                    <h2 className="featured-title">{featured.title}</h2>
                    <p className="featured-desc">{featured.shortDescription}</p>
                    <div className="featured-meta">
                      <span>{featured.authorName}</span>
                      <span className="dot">·</span>
                      <span>{formatDate(featured.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          <section className="latest">
            <div className="container">
              <div className="section-heading">
                <h2>Latest articles</h2>
                <Link to="/articles" className="btn-text">View all →</Link>
              </div>
              <div className="article-grid">
                {latest.slice(0, 6).map((a) => (
                  <ArticleCard key={a._id} article={a} />
                ))}
              </div>
              {latest.length === 0 && (
                <p className="state-message">More stories are on their way.</p>
              )}
            </div>
          </section>

          <section className="categories-strip">
            <div className="container">
              <div className="section-heading">
                <h2>Categories</h2>
              </div>
              <div className="categories-list">
                {categories.map((c) => (
                  <Link key={c._id} to={`/articles?category=${c._id}`} className="category-pill">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
