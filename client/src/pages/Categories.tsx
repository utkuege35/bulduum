import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category, Subcategory } from "@shared/schema";

export default function Categories() {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const fetchAllSubcategories = async () => {
    const allSubs: Subcategory[] = [];
    for (const cat of categories) {
      const res = await fetch(`/api/categories/${cat.id}/subcategories`, {
        credentials: "include",
      });
      if (res.ok) {
        const subs = await res.json();
        allSubs.push(...subs);
      }
    }
    return allSubs;
  };

  const { data: allSubcategories = [] } = useQuery<Subcategory[]>({
    queryKey: ["/api/subcategories", categories.map(c => c.id)],
    queryFn: fetchAllSubcategories,
    enabled: categories.length > 0,
  });

  const getSubcategoriesForCategory = (categoryId: string) => {
    return allSubcategories.filter(sub => sub.categoryId === categoryId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Hizmet Kategorileri</h1>
            <p className="text-lg text-muted-foreground">
              İhtiyacınıza uygun kategoriyi seçin ve hizmet sağlayıcıları keşfedin
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const subcategories = getSubcategoriesForCategory(category.id);
                return (
                  <Card key={category.id} className="hover-elevate" data-testid={`card-category-${category.id}`}>
                    <CardHeader>
                      <CardTitle className="text-2xl">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Alt Kategoriler:</span>
                          <Badge variant="secondary">{subcategories.length}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {subcategories.slice(0, 4).map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/hizmet-saglayicilar?subcategoryId=${sub.id}`}
                            >
                              <Badge variant="outline" className="cursor-pointer hover-elevate" data-testid={`badge-subcategory-${sub.id}`}>
                                {sub.name}
                              </Badge>
                            </Link>
                          ))}
                          {subcategories.length > 4 && (
                            <Badge variant="outline">+{subcategories.length - 4} daha</Badge>
                          )}
                        </div>
                        <Link href={`/hizmet-saglayicilar?categoryId=${category.id}`}>
                          <div className="mt-4 text-primary hover:underline text-sm font-medium cursor-pointer" data-testid={`link-view-providers-${category.id}`}>
                            Hizmet Sağlayıcıları Gör →
                          </div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
