import PageTransition from '../components/PageTransition';
import './PagePlaceholder.css';

const PagePlaceholder = ({ title, note }) => (
  <PageTransition>
    <section className="placeholder">
      <p className="placeholder__eyebrow">Coming soon</p>
      <h1 className="placeholder__title">{title}</h1>
      <p className="placeholder__note">{note}</p>
    </section>
  </PageTransition>
);

export default PagePlaceholder;
