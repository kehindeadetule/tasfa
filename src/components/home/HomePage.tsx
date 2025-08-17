import Hero from "./Hero";
import TValue from "./TValue";
import Activities from "./Activities";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <section>
        <TValue />
      </section>
      <section>
        <Activities />
      </section>
    </div>
  );
}
