import "./hero.css";

export function Hero({ title, subtitle }) {
  return (
    <div className="hero-container">
      <h1>{title}</h1>
      <small>{subtitle}</small>
    </div>
  );
}
