import FoldText from '../components/reactbits/FoldText';
import RippleDistortion from '../components/reactbits/RippleDistortion';
import PageTransition from '../components/PageTransition';
import './Home.css';

const Home = () => {
  return (
    <PageTransition>
    <section className="home">
      <div className="home__photo">
        <RippleDistortion
          src="assets/images/mosaic.jpg"
          brushSize={110}
          strength={0.22}
          swirl={1}
          rings={4}
          spread={3.2}
          fade={2.5}
          spacing={14}
          dispersion={0}
          glint={0.15}
          tint="#7fa8d9"
          tintAmount={0.08}
          grayscale={false}
          highlightColor="#eef2f7"
          trigger="hover"
          quality="medium"
          scrollSpeed={0.01}
        />
      </div>

      <div className="home__scrim" aria-hidden="true" />

      <div className="home__content">
        <h1 className="home__title">
          <FoldText text="嗨，我叫潘一鸣" splitBy="char" hinge="top" fontSize={92} fontWeight={600} color="#eef2f7" trigger="mount" duration={1.3} stagger={0.07} />
        </h1>

        <div className="home__meta">
          <span>2002.12 · 四川成都人 · 剑桥大学硕士</span>
        </div>
      </div>
    </section>
    </PageTransition>
  );
};

export default Home;
