
export default function GlobalFloatingBooks() {
  return (
    <div className="floating-library" aria-hidden="true">

      {/* Floating 3D Hardcover Books */}
      <div className="library-book book-one">
        <div className="book-pages" />
        <div className="book-cover">
          <span className="book-decoration">✦</span>
          <span className="book-line" />
          <span className="book-title">STORIES</span>
        </div>
      </div>

      <div className="library-book book-two">
        <div className="book-pages" />
        <div className="book-cover">
          <span className="book-decoration">✧</span>
          <span className="book-line" />
          <span className="book-title">WISDOM</span>
        </div>
      </div>

      <div className="library-book book-three">
        <div className="book-pages" />
        <div className="book-cover">
          <span className="book-decoration">✦</span>
          <span className="book-line" />
          <span className="book-title">DREAMS</span>
        </div>
      </div>

      <div className="library-book book-four">
        <div className="book-pages" />
        <div className="book-cover">
          <span className="book-decoration">✧</span>
          <span className="book-line" />
          <span className="book-title">CLASSICS</span>
        </div>
      </div>

      <div className="library-book book-five">
        <div className="book-pages" />
        <div className="book-cover">
          <span className="book-decoration">✦</span>
          <span className="book-line" />
          <span className="book-title">EXPLORE</span>
        </div>
      </div>

      {/* Open Book */}
      <div className="floating-open-book">
        <div className="open-book-left" />
        <div className="open-book-right" />
        <div className="open-book-spine" />
      </div>

      {/* Soft Floating Particles */}
      {Array.from({ length: 12 }).map((_, index) => (
        <span
          key={index}
          className={`library-particle particle-${index + 1}`}
        />
      ))}
    </div>
  );
}
