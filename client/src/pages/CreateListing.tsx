import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertListingSchema, type Category, type Subcategory } from "@shared/schema";
import { Loader2 } from "lucide-react";

const formSchema = insertListingSchema.omit({ userId: true }).extend({
  listingType: z.enum(["provider", "seeker"]),
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır"),
  description: z.string().min(20, "Açıklama en az 20 karakter olmalıdır"),
  categoryId: z.string().min(1, "Kategori seçiniz"),
  city: z.string().min(1, "Şehir giriniz"),
  district: z.string().min(1, "İlçe giriniz"),
});

export default function CreateListing() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: subcategories = [] } = useQuery<Subcategory[]>({
    queryKey: ["/api/subcategories", selectedCategory],
    enabled: !!selectedCategory,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingType: "provider" as const,
      title: "",
      description: "",
      categoryId: "",
      subcategoryId: "",
      city: "",
      district: "",
      neighborhood: "",
      price: undefined,
    },
  });

  const listingType = form.watch("listingType");

  const createListingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/listings", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "İlan oluşturuldu!",
        description: "İlanınız başarıyla oluşturuldu.",
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey[0];
          return typeof key === 'string' && (
            key.startsWith("/api/listings") || 
            key.startsWith("/api/my-listings")
          );
        }
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "İlan oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/giris");
    return null;
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const submitData = {
      ...data,
      price: data.price ? Number(data.price) : undefined,
      subcategoryId: data.subcategoryId || undefined,
      neighborhood: data.neighborhood || undefined,
    };
    createListingMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle>İlan Oluştur</CardTitle>
            <CardDescription>
              Hem hizmet/ürün sağlayıcısı hem de arayan olarak ilan oluşturabilirsiniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="listingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İlan Tipi</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                          data-testid="radio-listing-type"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="provider" id="provider" data-testid="radio-provider" />
                            <label htmlFor="provider" className="cursor-pointer">
                              Hizmet / Ürün Sağlayıcı
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="seeker" id="seeker" data-testid="radio-seeker" />
                            <label htmlFor="seeker" className="cursor-pointer">
                              Hizmet / Ürün Arayan
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İlan Başlığı</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Örn: Deneyimli İngilizce Öğretmeni"
                          {...field}
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="İlan detaylarını buraya yazınız..."
                          rows={5}
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategory(value);
                          form.setValue("subcategoryId", "");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Kategori seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedCategory && subcategories.length > 0 && (
                  <FormField
                    control={form.control}
                    name="subcategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Kategori (Opsiyonel)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-subcategory">
                              <SelectValue placeholder="Alt kategori seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategories.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şehir</FormLabel>
                        <FormControl>
                          <Input placeholder="Örn: İstanbul" {...field} data-testid="input-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İlçe</FormLabel>
                        <FormControl>
                          <Input placeholder="Örn: Kadıköy" {...field} data-testid="input-district" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mahalle (Opsiyonel)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Örn: Moda"
                          {...field}
                          data-testid="input-neighborhood"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {listingType === "provider" && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fiyat (₺/saat - Opsiyonel)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Örn: 150"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/")}
                    className="flex-1"
                    data-testid="button-cancel"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={createListingMutation.isPending}
                    className="flex-1"
                    data-testid="button-submit"
                  >
                    {createListingMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      "İlan Oluştur"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
