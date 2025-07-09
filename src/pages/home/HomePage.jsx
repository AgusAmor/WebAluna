import { Hero } from "../../components/Hero/Hero";
import "./home.css";

export function HomePage() {
  return (
    <>
      <div className="home-container">
        <Hero title="Bienvenido" subtitle={"Somos Aluna"} />
      </div>
    </>
  );
}
