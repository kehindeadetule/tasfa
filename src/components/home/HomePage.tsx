import Hero from "./Hero";
import TValue from "./TValue";
// import FestivalVenue from "./FestivalVenue";
import Activities from "./Activities";
import Partners from "./Partners";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <section>
        <TValue />
      </section>
      <section>{/* <FestivalVenue /> */}</section>
      <section>
        <Activities />
      </section>
      <section>
        <Partners />
      </section>
      <section></section>
    </div>
  );
}
