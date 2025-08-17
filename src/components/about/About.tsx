import AboutHero from "./Hero";
import AboutInfo from "./AboutInfo";
import MissionVision from "./MissionVision";
import Objectives from "./Objectives ";

export default function About() {
  return (
    <div className="min-h-screen ">
      <AboutHero />
      <AboutInfo />
      <MissionVision />
      <Objectives />
    </div>
  );
}
