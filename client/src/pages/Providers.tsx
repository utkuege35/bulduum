import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, MessageSquare } from "lucide-react";
import type { Profile, User, Category, Subcategory } from "@shared/schema";

type ProviderWithDetails = Profile & {
  user: User;
  category?: Category;
  subcategory?: Subcategory;
};

export default function Providers() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const categoryIdParam = searchParams.get("categoryId");
  const subcategoryIdParam = searchParams.get("subcategoryId");

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categoryIdParam || "all");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(subcategoryIdParam || "all");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: subcategories = [] } = useQuery<Subcategory[]>({
    queryKey: ["/api/categories", selectedCategoryId, "subcategories"],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${selectedCategoryId}/subcategories`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      return res.json();
    },
    enabled: !!selectedCategoryId && selectedCategoryId !== "all",
  });

  const { data: providers = [], isLoading } = useQuery<ProviderWithDetails[]>({
    queryKey: ["/api/providers", { categoryId: selectedCategoryId, subcategoryId: selectedSubcategoryId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategoryId && selectedCategoryId !== "all") {
        params.append("categoryId", selectedCategoryId);
      }
      if (selectedSubcategoryId && selectedSubcategoryId !== "all") {
        params.append("subcategoryId", selectedSubcategoryId);
      }
      
      const res = await fetch(`/api/providers?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to fetch providers");
      return res.json();
    },
  });

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "HS";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Hizmet Sağlayıcılar</h1>
            <p className="text-lg text-muted-foreground mb-6">
              İhtiyacınıza uygun hizmet sağlayıcıları bulun ve iletişime geçin
            </p>

            <div className="flex flex-wrap gap-4">
              <Select
                value={selectedCategoryId}
                onValueChange={(value) => {
                  setSelectedCategoryId(value);
                  setSelectedSubcategoryId("all");
                }}
              >
                <SelectTrigger className="w-[200px]" data-testid="select-filter-category">
                  <SelectValue placeholder="Kategori Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCategoryId && selectedCategoryId !== "all" && (
                <Select
                  value={selectedSubcategoryId}
                  onValueChange={setSelectedSubcategoryId}
                >
                  <SelectTrigger className="w-[200px]" data-testid="select-filter-subcategory">
                    <SelectValue placeholder="Alt Kategori Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Alt Kategoriler</SelectItem>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {(selectedCategoryId && selectedCategoryId !== "all") || (selectedSubcategoryId && selectedSubcategoryId !== "all")
                  ? "Bu kategoride henüz hizmet sağlayıcı bulunmuyor."
                  : "Henüz kayıtlı hizmet sağlayıcı bulunmuyor."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <Card key={provider.userId} className="hover-elevate" data-testid={`card-provider-${provider.userId}`}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={provider.user.profileImageUrl ?? undefined} />
                        <AvatarFallback>{getInitials(provider.user.firstName, provider.user.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {provider.user.firstName} {provider.user.lastName}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>5.0</span>
                          <span className="text-xs">(0 değerlendirme)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {provider.subcategory && (
                        <Badge variant="secondary" data-testid={`badge-provider-subcategory-${provider.userId}`}>
                          {provider.subcategory.name}
                        </Badge>
                      )}
                      {provider.hourlyRate && (
                        <Badge variant="outline">{provider.hourlyRate} TL/saat</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {provider.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{provider.location}</span>
                        </div>
                      )}
                      {provider.bio && (
                        <p className="text-sm line-clamp-3">{provider.bio}</p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Link href={`/profil/${provider.userId}`} className="flex-1">
                          <Button variant="outline" className="w-full" data-testid={`button-view-profile-${provider.userId}`}>
                            Profili Gör
                          </Button>
                        </Link>
                        <Link href={`/mesajlar/${provider.userId}`} className="flex-1">
                          <Button className="w-full" data-testid={`button-message-${provider.userId}`}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Mesaj
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
