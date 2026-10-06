import { Link } from 'react-router-dom';
import './ArticleCard.css';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

export default function ArticleCard({ article }) {
  return (
    <Link to={`/articles/${article.slug}`} className="article-card">
      <div className="article-card-image">
        {article.coverImage ? (
          <img src={article.coverImage} alt="" loading="lazy" />
        ) : (
          <div className="article-card-placeholder" />
        )}
      </div>
      <div className="article-card-body">
        {article.category?.name && <span className="eyebrow">{article.category.name}</span>}
        <h3 className="article-card-title">{article.title}</h3>
        <p className="article-card-desc">{article.shortDescription}</p>
        <div className="article-card-meta">
          <span>{article.authorName}</span>
          <span className="dot">·</span>
          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
