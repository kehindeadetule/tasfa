import Partners from "../home/Partners";
import AppMigration from "./AppMigration";
import ServicesHero from "./Hero";
import TMSProjects from "./TMSProjects";
import WebDev from "./WebDev";

export default function Services() {
  return (
    <div className="min-h-screen">
      <ServicesHero />
      <TMSProjects />
      <AppMigration />
      <WebDev />
      <Partners />
    </div>
  );
}
