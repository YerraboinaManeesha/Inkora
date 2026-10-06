import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './CategoriesPage.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container categories-page">
      <span className="eyebrow">Browse by subject</span>
      <h1>Categories</h1>
      <p className="categories-intro">
        Every piece on Inkora belongs to a category — pick one to see what's there, or
        search across all of them from the archive.
      </p>

      {loading ? (
        <div className="state-message">Loading categories…</div>
      ) : (
        <div className="categories-grid">
          {categories.map((c) => (
            <Link key={c._id} to={`/articles?category=${c._id}`} className="category-card">
              <h3>{c.name}</h3>
              {c.description && <p>{c.description}</p>}
              <span className="btn-text">Read articles →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
