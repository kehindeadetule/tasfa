import aIcon from "@/assets/icons/a-icon.png";
import Image from "next/image";

export default function About() {
  return (
    <section className="py-8 md:py-12 relative bg-white px-1 md:px-0">
      <div className="container mx-auto px-4.5 md:px-0">
        <div className="flex flex-col items-center md:mb-12 mb-6 mt-6">
          <div className="inline-block bg-[#E7FBFE] text-[#1B1464] px-4 py-2 text-sm rounded-2xl mb-4 font-semibold shadow-sm">
            OUR VALUE
          </div>
          <h2 className="text-3xl md:text-4xl md:tracking-normal md:leading-14 md:font-bold font-medium text-center md:mb-6 mb-3">
            <span className="text-[#1B1464] sm:text-center">
              TASFA VALUE PROPOSITION
            </span>
          </h2>
        </div>

        <div className="w-[98%] mx-auto md:w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Value Proposition 1 */}
            <div className=" bg-[#1B1464] md:p-6 px-5 py-7 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-white mb-4">
                Skills Development for Students
              </h3>
              <p className="text-white text-lg leading-relaxed">
                TASFA 2025 will empower over 3,000 students from universities
                and colleges nationwide with practical training in key creative
                fields. Through masterclasses, workshops, and performance-based
                learning, students will gain hands-on experience in acting,
                stage management, technical production, and media arts—preparing
                them for success in Nigeria&apos;s evolving creative industry.
              </p>
            </div>

            {/* Value Proposition 2 */}
            <div className="bg-[#F37021] md:p-6 px-5 py-7 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-white mb-4">
                Promoting Cultural Integration
              </h3>
              <p className="text-white text-lg leading-relaxed">
                TASFA brings together students from all six geopolitical zones,
                creating a melting pot of languages, traditions, and ideas.
                Through collaboration and shared artistic experiences, the
                festival fosters national unity, cross-cultural understanding,
                and social harmony—an essential goal in today&apos;s Nigeria.
              </p>
            </div>
          </div>

          {/* Value Proposition middle */}
          <div className="flex justify-center my-8">
            <div className="bg-[#C6007E] md:p-6 px-5 py-7 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 w-full md:w-1/2">
              <h3 className="text-xl font-bold text-white mb-4">
                Promoting Nigeria&apos;s Culture & Art
              </h3>
              <p className="text-white text-lg pt-4 leading-relaxed">
                The festival is a vibrant celebration of Nigeria&apos;s diverse
                cultural heritage, using exhibitions, costume parades, academic
                presentations, and performances to educate and inspire. TASFA
                promotes cultural pride and artistic excellence, helping
                preserve traditional practices while exploring new artistic
                expressions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Value Proposition 4 */}
            <div className="bg-[#005B96] md:p-8 px-5 py-7 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-white mb-4">
                Empowering Female Creative Arts Students
              </h3>
              <p className="text-white text-lg leading-relaxed">
                TASFA is committed to bridging the gender gap in the creative
                industry by supporting over 400 female participants with small
                grants, leadership training, and mentorship in fields such as
                marketing and communications, production management, costume
                design, and directing. This initiative builds confidence,
                skills, and visibility for young women creatives.
              </p>
            </div>

            {/* Value Proposition 5 */}
            <div className="bg-[#ED1C24] md:p-8 px-5 py-7 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 md:col-span">
              <h3 className="text-xl font-bold text-white mb-4">
                Developing Leaders in the Creative Economy
              </h3>
              <p className="text-white text-lg leading-relaxed">
                Through strategic mentorship, internship opportunities, and
                leadership development, TASFA will nurture 50 promising student
                leaders in Film, Theatre, Television, New Media, and Radio.
                These future industry changemakers will gain the tools,
                networks, and confidence needed to drive innovation in
                Nigeria&apos;s creative economy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
