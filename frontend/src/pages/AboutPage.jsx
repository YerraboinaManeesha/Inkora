import { Link } from 'react-router-dom';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="container about-page">
      <span className="eyebrow">About Inkora</span>
      <h1>A quieter place for ideas.</h1>
      <p className="about-lead">
        Inkora is a home for essays, reporting, and fiction — built for readers who want
        more than a headline, and for writers who want more than a like count.
      </p>

      <div className="about-body">
        <p>
          We started Inkora because most of the internet rewards speed over substance.
          Articles are optimized to be skimmed, not read; comment sections are optimized
          to provoke, not converse. We wanted something different: a place where a piece
          of writing is given room to breathe, and where the conversation underneath it
          is treated with the same care as the writing itself.
        </p>
        <p>
          Every article on Inkora is chosen and edited by our team, whether it comes from
          a staff writer or a guest voice. Readers can like the pieces that move them,
          leave a comment, and hear back — because a conversation worth joining should
          also be a conversation worth answering.
        </p>
      </div>

      <Link to="/auth" className="btn btn-primary about-cta">Join Inkora</Link>
    </div>
  );
}
