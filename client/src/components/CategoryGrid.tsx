import { Card } from "@/components/ui/card";
import educationIcon from "@assets/generated_images/Education_category_icon_14309370.png";
import homeServicesIcon from "@assets/generated_images/Home_services_category_icon_bfb1aed0.png";
import careServicesIcon from "@assets/generated_images/Care_services_category_icon_5ac9efa3.png";
import handmadeIcon from "@assets/generated_images/Handmade_products_category_icon_14ee765e.png";

const categories = [
  {
    id: "egitim",
    name: "Eğitim",
    icon: educationIcon,
    subcategories: 12,
    description: "Matematik, İngilizce, Müzik ve daha fazlası",
  },
  {
    id: "ev-hizmetleri",
    name: "Ev Hizmetleri",
    icon: homeServicesIcon,
    subcategories: 8,
    description: "Temizlik, Tadilat, Elektrik, Tesisat",
  },
  {
    id: "bakim",
    name: "Bakım Hizmetleri",
    icon: careServicesIcon,
    subcategories: 6,
    description: "Çocuk, Yaşlı ve Hasta Bakımı",
  },
  {
    id: "el-yapimi",
    name: "El Yapımı Ürünler",
    icon: handmadeIcon,
    subcategories: 10,
    description: "Pasta, Börek, El İşi Ürünler",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popüler Kategoriler
          </h2>
          <p className="text-lg text-muted-foreground">
            İhtiyacınız olan hizmeti hemen bulun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
              data-testid={`card-category-${category.id}`}
              onClick={() => console.log("Category clicked:", category.id)}
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-16 h-16 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description}
                </p>
                <div className="text-xs text-primary font-medium">
                  {category.subcategories} Alt Kategori
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
