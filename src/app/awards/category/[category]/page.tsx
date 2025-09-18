import CategoryPageUI from "@/components/awards/CategoryPageUI";
import { categorySlugToName } from "@/utils/categoryMapping";

// Generate static params for all category routes
export async function generateStaticParams() {
  const categories = Object.keys(categorySlugToName);
  return categories.map((category) => ({
    category: category,
  }));
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return <CategoryPageUI category={params.category} />;
}
