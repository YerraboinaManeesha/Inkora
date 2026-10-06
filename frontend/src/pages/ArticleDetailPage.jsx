import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import './ArticleDetailPage.css';

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/articles/slug/${slug}`)
      .then(({ data }) => {
        setArticle(data.article);
        setLiked(data.likedByMe);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const toggleLike = async () => {
    if (!user) return navigate('/auth');
    setLikeBusy(true);
    try {
      const { data } = await api.post(`/likes/${article._id}`);
      setLiked(data.liked);
      setArticle((prev) => ({ ...prev, likeCount: data.likeCount }));
    } finally {
      setLikeBusy(false);
    }
  };

  if (loading) return <div className="state-message">Loading article…</div>;
  if (notFound || !article) {
    return (
      <div className="state-message">
        This article couldn't be found. <Link to="/articles" className="btn-text">Browse articles</Link>
      </div>
    );
  }

  return (
    <article className="container article-detail">
      <div className="article-detail-head">
        {article.category?.name && <span className="eyebrow">{article.category.name}</span>}
        <h1>{article.title}</h1>
        <p className="article-detail-desc">{article.shortDescription}</p>
        <div className="article-detail-meta">
          <span>By {article.authorName}</span>
          <span className="dot">·</span>
          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          <span className="dot">·</span>
          <span>{article.views} views</span>
        </div>
      </div>

      {article.coverImage && (
        <div className="article-detail-cover">
          <img src={article.coverImage} alt="" />
        </div>
      )}

      <div className="article-detail-body">
        {article.content.split('\n').map((para, i) => (
          para.trim() ? <p key={i}>{para}</p> : null
        ))}
      </div>

      {article.tags?.length > 0 && (
        <div className="article-detail-tags">
          {article.tags.map((t) => (
            <span key={t} className="tag">#{t}</span>
          ))}
        </div>
      )}

      <div className="article-detail-actions">
        <button
          className={`like-btn ${liked ? 'is-liked' : ''}`}
          onClick={toggleLike}
          disabled={likeBusy}
        >
          <span className="like-icon">{liked ? '♥' : '♡'}</span>
          {liked ? 'Liked' : 'Like'} · {article.likeCount}
        </button>
        <span className="comment-count-hint">{article.commentCount} comments</span>
      </div>

      <hr className="hairline" />

      <CommentSection articleId={article._id} />
    </article>
  );
}
