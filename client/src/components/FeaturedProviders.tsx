import ServiceProviderCard from "./ServiceProviderCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import provider1 from "@assets/generated_images/Service_provider_profile_photo_1_a131f1c3.png";
import provider2 from "@assets/generated_images/Service_provider_profile_photo_2_1f7eb592.png";
import provider3 from "@assets/generated_images/Service_provider_profile_photo_3_10adcb1e.png";

const featuredProviders = [
  {
    id: "1",
    name: "Ayşe Yılmaz",
    category: "Matematik Öğretmeni",
    rating: 4.8,
    reviewCount: 32,
    description: "10 yıllık deneyimle lise ve üniversite öğrencilerine özel matematik dersi veriyorum.",
    image: provider1,
  },
  {
    id: "2",
    name: "Mehmet Kaya",
    category: "Elektrikçi",
    rating: 4.9,
    reviewCount: 48,
    description: "Evlerde ve işyerlerinde profesyonel elektrik tesisat ve tamir hizmetleri sunuyorum.",
    image: provider2,
  },
  {
    id: "3",
    name: "Zeynep Demir",
    category: "Pasta Ustası",
    rating: 5.0,
    reviewCount: 67,
    description: "Özel günleriniz için el yapımı pastalar ve tatlılar hazırlıyorum. Doğal malzemeler kullanıyorum.",
    image: provider3,
  },
];

export default function FeaturedProviders() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Öne Çıkan Hizmet Sağlayıcılar
          </h2>
          <p className="text-lg text-muted-foreground">
            En çok tercih edilen ve yüksek puanlı profesyoneller
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredProviders.map((provider) => (
            <ServiceProviderCard key={provider.id} {...provider} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" data-testid="button-view-all-providers">
            Tüm Hizmet Sağlayıcıları Gör
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
