import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin, MessageSquare, Phone, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { User, Profile, Category, Subcategory, Review } from "@shared/schema";

type ProviderDetails = Profile & {
  user: User;
  category?: Category;
  subcategory?: Subcategory;
  rating: { average: number; count: number };
  reviews: (Review & { customer: User })[];
};

export default function ProviderProfile() {
  const params = useParams();
  const providerId = params.userId;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const { data: provider, isLoading } = useQuery<ProviderDetails>({
    queryKey: ["/api/providers", providerId],
    queryFn: async () => {
      const res = await fetch(`/api/providers/${providerId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch provider");
      return res.json();
    },
    enabled: !!providerId,
  });

  const createReview = useMutation({
    mutationFn: async (data: { providerId: string; rating: number; comment: string }) => {
      const res = await apiRequest("POST", "/api/reviews", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId] });
      setReviewDialogOpen(false);
      setComment("");
      setRating(5);
      toast({
        title: "Değerlendirme Gönderildi",
        description: "Değerlendirmeniz başarıyla kaydedildi!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (!providerId) return;
    createReview.mutate({ providerId, rating, comment });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "HS";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const renderStars = (count: number, filled: number, onClick?: (index: number) => void) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: count }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < filled ? 'fill-primary text-primary' : 'text-muted-foreground'
            } ${onClick ? 'cursor-pointer' : ''}`}
            onClick={() => onClick?.(i + 1)}
            data-testid={`star-${i + 1}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background py-12">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="flex items-start gap-6">
                  <div className="h-32 w-32 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background py-12">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <p className="text-lg text-muted-foreground">Hizmet sağlayıcı bulunamadı</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canReview = isAuthenticated && user?.id !== providerId && user?.profile?.userType === "customer";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={provider.user.profileImageUrl ?? undefined} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(provider.user.firstName, provider.user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {provider.user.firstName} {provider.user.lastName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {provider.subcategory && (
                        <Badge variant="secondary" className="text-base">
                          {provider.subcategory.name}
                        </Badge>
                      )}
                      {provider.hourlyRate && (
                        <Badge variant="outline" className="text-base">
                          {provider.hourlyRate} TL/saat
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {renderStars(5, Math.round(provider.rating.average))}
                      <span className="text-sm text-muted-foreground">
                        ({provider.rating.count} değerlendirme)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isAuthenticated ? (
                      <Link href={`/mesajlar/${provider.userId}`}>
                        <Button data-testid="button-message-provider">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mesaj Gönder
                        </Button>
                      </Link>
                    ) : (
                      <Button onClick={() => navigate("/api/login")} data-testid="button-login-to-message">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mesaj Gönder
                      </Button>
                    )}
                    {canReview && (
                      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" data-testid="button-write-review">
                            <Star className="h-4 w-4 mr-2" />
                            Değerlendir
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Değerlendirme Yaz</DialogTitle>
                            <DialogDescription>
                              Bu hizmet sağlayıcı hakkında deneyiminizi paylaşın
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label>Puan</Label>
                              <div className="mt-2">
                                {renderStars(5, rating, setRating)}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="comment">Yorumunuz</Label>
                              <Textarea
                                id="comment"
                                placeholder="Deneyiminizi paylaşın..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-2"
                                rows={4}
                                data-testid="input-review-comment"
                              />
                            </div>
                            <Button
                              onClick={handleSubmitReview}
                              disabled={createReview.isPending}
                              className="w-full"
                              data-testid="button-submit-review"
                            >
                              {createReview.isPending ? "Gönderiliyor..." : "Değerlendirmeyi Gönder"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {provider.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
              )}
              {provider.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{provider.phone}</span>
                </div>
              )}
              {provider.user.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{provider.user.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* About Section */}
          {provider.bio && (
            <Card>
              <CardHeader>
                <CardTitle>Hakkında</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{provider.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>Değerlendirmeler ({provider.rating.count})</CardTitle>
            </CardHeader>
            <CardContent>
              {provider.reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Henüz değerlendirme yapılmamış
                </p>
              ) : (
                <div className="space-y-6">
                  {provider.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0" data-testid={`review-${review.id}`}>
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.customer.profileImageUrl ?? undefined} />
                          <AvatarFallback>
                            {getInitials(review.customer.firstName, review.customer.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold">
                              {review.customer.firstName} {review.customer.lastName}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(review.createdAt), {
                                addSuffix: true,
                                locale: tr,
                              })}
                            </span>
                          </div>
                          <div className="mt-1">
                            {renderStars(5, review.rating)}
                          </div>
                          {review.comment && (
                            <p className="mt-2 text-muted-foreground">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
