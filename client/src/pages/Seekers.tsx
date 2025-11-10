import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, MessageSquare } from "lucide-react";
import type { Listing, Category, Subcategory, User } from "@shared/schema";

type ListingWithDetails = Listing & {
  user: User;
  category: Category;
  subcategory?: Subcategory;
};

export default function Seekers() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const queryKey = (() => {
    const params = new URLSearchParams({
      listingType: "seeker",
    });
    if (selectedCategory !== "all") {
      params.append("categoryId", selectedCategory);
    }
    return `/api/listings?${params.toString()}`;
  })();

  const { data: listings = [], isLoading } = useQuery<ListingWithDetails[]>({
    queryKey: [queryKey],
  });

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Hizmet / Ürün Arayanlar</h1>
            <p className="text-lg text-muted-foreground">
              Hizmet veya ürün arayan kişilerin ilanlarını keşfedin
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger data-testid="select-category-filter">
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
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {selectedCategory !== "all"
                    ? "Bu kategoride henüz ilan bulunmuyor."
                    : "Henüz ilan bulunmuyor."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="hover-elevate" data-testid={`card-listing-${listing.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {listing.category.name}
                      </Badge>
                    </div>
                    {listing.subcategory && (
                      <CardDescription>{listing.subcategory.name}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {listing.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {listing.city}, {listing.district}
                          {listing.neighborhood && ` - ${listing.neighborhood}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(listing.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {listing.user.firstName?.[0] || "?"}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {listing.user.firstName || "Kullanıcı"}
                        </span>
                      </div>
                      <Link href={`/mesajlar/${listing.userId}`}>
                        <Button size="sm" variant="outline" data-testid={`button-message-${listing.id}`}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Mesaj Gönder
                        </Button>
                      </Link>
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
