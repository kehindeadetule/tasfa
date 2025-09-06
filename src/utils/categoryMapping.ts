export const categorySlugToName: Record<string, string> = {
  "best-actor": "Best Actor",
  "best-actress": "Best Actress",
  "best-supporting-actor": "Best Supporting Actor",
  "best-supporting-actress": "Best Supporting Actress",
  "revelation-of-the-year-male": "Revelation of the Year (Male)",
  "revelation-of-the-year-female": "Revelation of the Year (Female)",
  "best-director": "Best Director",
  "best-stage-manager": "Best Stage Manager",
  "best-playwright": "Best Playwright",
  "best-set-designer": "Best Set Designer",
  "best-light-designer": "Best Light Designer",
  "best-props-designer": "Best Props Designer",
  "best-costumier": "Best Costumier",
  "best-makeup-artist": "Best Makeup Artist",
  "best-publicity-manager": "Best Publicity Manager",
  "best-dancer-male": "Best Dancer (Male)",
  "best-dancer-female": "Best Dancer (Female)",
  "best-drummer-male": "Best Drummer (Male)",
  "best-drummer-female": "Best Drummer (Female)",
  "best-choreographer": "Best Choreographer",
  "best-music-director": "Best Music Director",
  "best-media-student-male": "Best Media Student (Male)",
  "best-media-student-female": "Best Media Student (Female)",
};

export const categoryNameToSlug: Record<string, string> = Object.fromEntries(
  Object.entries(categorySlugToName).map(([slug, name]) => [name, slug])
);
