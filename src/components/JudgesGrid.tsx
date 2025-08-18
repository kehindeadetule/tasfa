"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Judge {
  id: string;
  name: string;
  title: string;
  image: string;
  fullBio: string;
}

const judges: Judge[] = [
  {
    id: "oluwatoyin",
    name: "Oluwatoyin Olokodana-James",
    title: "Ph.D. Lecturer & Theatre Arts Researcher",
    image: "/assets/judges/toyin.jpg",
    fullBio: `Oluwatoyin Olokodana-James, Ph.D., is a Lecturer at the Faculty of Creative Arts, University of Lagos. She is an alumna of the Harvard Mellon School of Theater and Performance Research, USA, and a Fellow of the Ife Institute of Advanced Studies, Obafemi Awolowo University, Ile-Ife, Nigeria. She is also a Fellow of Theatre Arts, National Association of Theatre and Applied Arts Practitioners (NANTAP), and Principal Investigator of the UNILAG/Bayreuth Multiple Cluster, Germany. 

Dr. Olokodana-James holds a Bachelor of Arts from Lagos State University, as well as a Master of Arts and a Ph.D. in Theatre Arts from the University of Lagos. As an academic, researcher, and practitioner, she is committed to exploring the pragmatics of the arts for human development, with a focus on women and children. She is the brain behind the following initiatives:
1.Slum through Art to School Project
2.Theatrical Intervention towards Birth Preparedness and Complication Readiness 
3. Art Intervention, Activism, and Social Reformation in Lagos Project
4. Art Intervention and Activism towards Psycho-Artistic Reformation and Social Change

Dr. Olokodana-James has authored and published over thirty articles in national and international journals and books and has presented conference papers and workshops in various parts of the world. Her research interests lie in Performance and Gender Studies (Theatre, Film, and Gender), with a focus on interrogating ethnocentric identities and the trans-sociological hybridization of concepts and forms in African studies. In addition to developing and integrating theories into performance arts, she also engages with the perspectives of Nigeria's creative industries and cultural policymakers.`,
  },
  {
    id: "kenneth",
    name: "Kenneth Uphopho",
    title: "Festival Director & Artistic Director",
    image: "/assets/judges/kenneth.webp",
    fullBio: `Kenneth Uphopho is an Artistic Director, Acting Coach, Writer, Arts Manager, Culture Advocate, and Talent Manager with more than 25 years of experience in artistic direction and festival management. He is the founder of the Lagos Fringe and Abuja Fringe festivals, modeled after the Edinburgh Fringe, through which he has produced and directed over 300 productions. These platforms continue to nurture and promote new talent, particularly young creatives between the ages of 16 and 35, by offering training, workshops, and networking opportunities with local and international facilitators.
Through his festivals, Kenneth provides artists with free venues and technical support to showcase a wide variety of works including theatre, dance, film, music, literature, spoken word, and visual arts. His vision is to position Nigeria as the cultural hub of Sub-Saharan Africa by 2030, making Lagos and Abuja thriving spaces for artistic innovation and exchange.
Kenneth's work has earned international recognition, including being named a Salzburg Global Seminar Fellow (Austria, 2020) and a Fellow of the International Society for the Performing Arts (ISPA), New York. He also serves as Secretary and founding board member of the Guild of Theatre Directors Nigeria, underscoring his role in strengthening the creative industry locally and globally.
From 2014 to 2018, Kenneth was the Festival Director of the British Council's Lagos Theatre Festival, where he expanded its scope from 16 performances to 109 events in just two years. Under his leadership, the festival showcased over 500 productions and 25 international collaborations, cementing its reputation as one of Africa's largest performing arts festivals.
As a theatre maker, Kenneth has collaborated with numerous producers and companies, directing acclaimed works such as August Meeting, Ada the Country, Saro the Musical, Anatomy of a Woman, Death and the King's Horseman, London Life Lagos Living, and Band Aid. As Director of Pawstudios Africa, he continues to provide a platform for innovative collaborations, experimental performances, and the development of unconventional performance spaces that expand access for artists and audiences alike.
`,
  },
  {
    id: "tuoyo",
    name: "Tuoyo Edward",
    title: "Theatre Administrator & Safety Specialist",
    image: "/assets/judges/tuoyo.jpg",
    fullBio: `Tuoyo Edward Arueyingho is an accomplished theatre administrator with a passion for creating safe, functional, and inspiring performance spaces. He holds a Bachelor of Arts from the University of Benin and a Master of Arts from Delta State University, bringing a strong academic foundation to his work in the performing arts sector.

With a keen interest in theatre safety design and compliance, Tuoyo combines creative vision with health and safety best practices to ensure that performance environments are both artistically vibrant and operationally secure. He is an active member of several professional bodies in Nigeria and abroad, reflecting his commitment to professional growth and industry standards.

Tuoyo currently serves as the Ogun State Chairman of the National Association of Nigerian Theatre Arts Practitioners (NANTAP), where he champions initiatives to advance theatre practice, improve working conditions, and promote safe, inclusive performance spaces.
`,
  },
  {
    id: "bunmi",
    name: "Bunmi Adewale",
    title: "Creative Theatre Director & Stage Manager",
    image: "/assets/judges/bunmi.jpg",
    fullBio: `Bunmi Adewale is a seasoned Creative Theatre Director, Stage Manager, Production Manager, Actor, and Acting Teacher with over two decades of experience spanning theatre, film, television, and commercials. Since 2003, Bunmi has directed, managed, and performed in several notable stage productions including A Husband's Wife, A Pound of Flesh, The Vagina Monologues, A Past Came Calling, Kurunmi (Yoruba Version), Alante Tatakumi, Who Is Afraid of Solarin, Little Drops, Heartbeat the Musical, Awo the Musical, Baba Kekere, Shadows of the Ancestors, and Jagagba.
In film and television, Bunmi has served as First Assistant Director and Production Manager on numerous projects between 2003 and 2021. Credits include commercials for Cussons Baby Range and ROBB Range, as well as film and TV productions such as Changing Faces, Next Door to Happiness, Lovers and Liars, The Audition, The Baker's Daughter, Spin, Fleece, The Cheating Experience, The Diary, Daylight News, Past Tense, The Target, Moving On, Protégé, Stalked, Small Moving Parts, Evasion, Life Begins, Sequence, U-Turn, Hello Fear, Kamsi and over 20 film credits for Africa Magic Original Films, in addition to Abuse, a television magazine program.
Beyond performance and production, Bunmi is an experienced resource person and consultant, having facilitated workshops, curriculum design, arts/academic projects, and Theatre for Development (TFD) programs focused on public enlightenment and social advocacy.
Bunmi holds a B.A. and M.A. in Dramatic Arts from Obafemi Awolowo University, Ile-Ife, and is currently pursuing a Ph.D. in Dramatic Arts at the same institution.
Over the years, Bunmi has worked with a wide range of reputable organizations including Baneo Productions, La Campaigne Resort, Blue Seal Advertising, Ark Resources Entertainment, Taijo Wonujabe, National Troupe of Nigeria, Art of Life Foundation, Africa Magic Original Films (MNET), Lufodo Productions, Beeta Arts Foundation, A.C.E Productions, Makinde Adeniran Productions, Ascension Productions, Duke of Shomolu Productions, and TRAIL Productions.`,
  },
];

const JudgesGrid: React.FC = () => {
  const [expandedJudge, setExpandedJudge] = useState<string | null>(null);

  const toggleExpanded = (judgeId: string) => {
    setExpandedJudge(expandedJudge === judgeId ? null : judgeId);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-14 md:mt-28 mb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-[#E7FBFE] font-semibold text-[#1B1464] px-4 py-2 text-sm rounded-full mb-4">
            MEET THE JUDGES
          </span>
          <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Get Acquainted with Our Judges
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
            Our esteemed panel of judges brings decades of experience in
            theatre, performance arts, and festival management to evaluate TASFA
            participants.
          </p>
        </motion.div>

        {/* Desktop View - Flex Layout */}
        <div className="hidden md:flex flex-col lg:space-y-20">
          {judges.map((judge, index) => (
            <React.Fragment key={judge.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-fit"
              >
                <div className="flex">
                  {/* Image Section - Fixed Height */}
                  <div className="w-1/3 relative h-96 flex-shrink-0 p-4">
                    <img
                      src={judge.image}
                      alt={judge.name}
                      className="w-full h-full object-cover object-top rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = target.nextSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = "flex";
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#005B96] to-[#005B96] flex items-center justify-center hidden">
                      <span className="text-white text-2xl font-bold">
                        {judge.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>

                  {/* Content Section - Flexible Height */}
                  <div className="w-3/4 p-8 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {judge.name}
                    </h3>
                    <p className="text-[#005B96] text-lg font-medium mb-4">
                      {judge.title}
                    </p>

                    {/* Bio Section with Height-based Expand/Collapse */}
                    <div className="relative">
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedJudge === judge.id ? "h-auto" : "h-40"
                        }`}
                      >
                        <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                          {judge.fullBio}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleExpanded(judge.id)}
                        className="text-[#005B96]  hover:underline text-base font-medium transition-colors mt-3 flex items-center gap-1"
                      >
                        {expandedJudge === judge.id ? (
                          <>
                            <span>Read Less</span>
                            <svg
                              className="w-4 h-4 transform rotate-180 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span>Read More</span>
                            <svg
                              className="w-4 h-4 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative divider between cards (except after the last card) */}
              {index < judges.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  className="flex items-center justify-center py-8"
                >
                  <div className="flex items-center space-x-4 w-full max-w-2xl">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#005B96]/30 to-transparent"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#005B96] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#005B96]/60 rounded-full"></div>
                      <div className="w-2 h-2 bg-[#005B96] rounded-full"></div>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#005B96]/30 to-transparent"></div>
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile View - Block Layout */}
        <div className="lg:hidden space-y-6">
          {judges.map((judge, index) => (
            <React.Fragment key={judge.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Image Section */}
                <div className="w-full h-[25rem] relative rounded-lg p-4">
                  <img
                    src={judge.image}
                    alt={judge.name}
                    className="w-full h-full object-cover object-top rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#005B96] to-[#005B96] items-center justify-center hidden md:flex">
                    <span className="text-white text-4xl font-bold">
                      {judge.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {judge.name}
                  </h3>
                  <p className="text-[#005B96] text-sm font-medium mb-3">
                    {judge.title}
                  </p>

                  {/* Bio Section with Height-based Expand/Collapse */}
                  <div className="relative">
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedJudge === judge.id ? "h-auto" : "h-40"
                      }`}
                    >
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {judge.fullBio}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleExpanded(judge.id)}
                      className="text-[#005B96] hover:underline text-sm font-medium transition-colors mt-3 flex items-center gap-1"
                    >
                      {expandedJudge === judge.id ? (
                        <>
                          <span>Read Less</span>
                          <svg
                            className="w-3 h-3 transform rotate-180 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Read More</span>
                          <svg
                            className="w-3 h-3 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Decorative divider between cards (except after the last card) */}
              {index < judges.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  className="flex items-center justify-center py-4"
                >
                  <div className="flex items-center space-x-3 w-full max-w-xs">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#005B96]/30 to-transparent"></div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-[#005B96] rounded-full"></div>
                      <div className="w-1 h-1 bg-[#005B96]/60 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-[#005B96] rounded-full"></div>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#005B96]/30 to-transparent"></div>
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JudgesGrid;
