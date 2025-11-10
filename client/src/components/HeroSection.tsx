import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/generated_images/Hero_section_background_image_c1e1a53d.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    console.log("Search triggered:", { searchQuery, category });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Aradığın her hizmeti ve ürünü
          <br />
          bir tıkla bul.
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8">
          Özel ders, temizlik, bakım hizmetleri ve daha fazlası için güvenilir hizmet sağlayıcıları keşfedin
        </p>

        <div className="bg-white/95 backdrop-blur p-4 rounded-lg shadow-xl max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="md:w-48" data-testid="select-category">
                <SelectValue placeholder="Kategori Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="egitim">Eğitim</SelectItem>
                <SelectItem value="ev-hizmetleri">Ev Hizmetleri</SelectItem>
                <SelectItem value="bakim">Bakım Hizmetleri</SelectItem>
                <SelectItem value="el-yapimi">El Yapımı Ürünler</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Ne arıyorsunuz?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                data-testid="input-search"
              />
              <Button onClick={handleSearch} data-testid="button-search">
                <Search className="h-4 w-4 mr-2" />
                Ara
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">5000+</span>
            <span>Hizmet Sağlayıcı</span>
          </div>
          <div className="hidden md:block w-1 h-1 bg-white/50 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="font-semibold">15.000+</span>
            <span>Mutlu Müşteri</span>
          </div>
        </div>
      </div>
    </section>
  );
}
