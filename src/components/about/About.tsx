import AboutHero from "./Hero";
import AboutInfo from "./AboutInfo";
import MissionVision from "./MissionVision";
import Objectives from "./Objectives ";
import Partners from "../home/Partners";

export default function About() {
  return (
    <div className="min-h-screen ">
      <AboutHero />
      <AboutInfo />
      <MissionVision />
      <Objectives /> <Partners />
    </div>
  );
}
