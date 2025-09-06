import { categorySlugToName } from "@/utils/categoryMapping";

// Generate static params for all category routes
export async function generateStaticParams() {
  const categories = Object.keys(categorySlugToName);
  return categories.map((category) => ({
    category: category,
  }));
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
