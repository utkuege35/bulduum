import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertProfileSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Category, Subcategory } from "@shared/schema";

const profileFormSchema = insertProfileSchema
  .omit({ userId: true, userType: true })
  .extend({
    city: z.string().min(1, "Şehir gereklidir"),
    district: z.string().min(1, "İlçe gereklidir"),
  });
type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfileSetup() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: "",
      phone: "",
      city: "",
      district: "",
      neighborhood: "",
      categoryId: undefined,
      subcategoryId: undefined,
      hourlyRate: undefined,
    },
  });

  const selectedCategoryId = form.watch("categoryId");

  const { data: subcategories = [] } = useQuery<Subcategory[]>({
    queryKey: ["/api/categories", selectedCategoryId, "subcategories"],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${selectedCategoryId}/subcategories`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      return res.json();
    },
    enabled: !!selectedCategoryId,
  });

  const createProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await apiRequest("POST", "/api/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profil Oluşturuldu",
        description: "Profiliniz başarıyla oluşturuldu!",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profilinizi Tamamlayın</CardTitle>
            <CardDescription>
              Hizmet vermek veya hizmet aramak için profilinizi oluşturun. Kategori seçerseniz ilan verebilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createProfile.mutate(data))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kısa Tanıtım</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Kendiniz hakkında kısa bilgi..."
                          className="resize-none"
                          rows={4}
                          data-testid="input-bio"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        İsteğe bağlı - Kendinizi tanıtın
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0555 123 45 67"
                          data-testid="input-phone"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>İsteğe bağlı - İletişim için</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şehir *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Antalya, İstanbul, İzmir"
                          data-testid="input-city"
                          {...field}
                          value={field.value ?? ""}
                        />
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
                      <FormLabel>İlçe *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Kepez, Kadıköy, Konak"
                          data-testid="input-district"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mahalle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Yıldız Mahallesi (İsteğe bağlı)"
                          data-testid="input-neighborhood"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>İsteğe bağlı</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-2">Hizmet Sağlayıcı Bilgileri</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    İlan vermek istiyorsanız kategori seçin. Sadece hizmet aramak için boş bırakabilirsiniz.
                  </p>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ana Kategori</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value ?? undefined}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Kategori seçin (isteğe bağlı)" />
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
                          <FormDescription>Hizmet vermek istiyorsanız kategori seçin</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedCategoryId && (
                      <FormField
                        control={form.control}
                        name="subcategoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alt Kategori</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value ?? undefined}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-subcategory">
                                  <SelectValue placeholder="Alt kategori seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subcategories.map((subcat) => (
                                  <SelectItem key={subcat.id} value={subcat.id}>
                                    {subcat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saatlik Ücret (TL)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="200"
                              data-testid="input-hourly-rate"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>İsteğe bağlı - Tahmini saatlik ücretiniz</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/")}
                    data-testid="button-skip"
                  >
                    Daha Sonra
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProfile.isPending}
                    data-testid="button-submit"
                  >
                    {createProfile.isPending ? "Kaydediliyor..." : "Profili Oluştur"}
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
