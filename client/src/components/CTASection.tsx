import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Search } from "lucide-react";
import ctaImage from "@assets/generated_images/CTA_section_background_8f2ef23f.png";

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ctaImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            İster hizmet arıyor olun, ister hizmet sağlıyor olun, Bulduum sizin için doğru yer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Hizmet Arıyorum
            </h3>
            <p className="text-white/80 mb-6">
              İhtiyacınıza uygun profesyonelleri keşfedin
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/90 backdrop-blur hover:bg-white border-white/50"
              data-testid="button-find-service"
            >
              Keşfet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Hizmet Sağlıyorum
            </h3>
            <p className="text-white/80 mb-6">
              Müşterilerinize ulaşın, işinizi büyütün
            </p>
            <Button 
              size="lg"
              className="bg-primary/90 backdrop-blur border border-primary-border"
              data-testid="button-join-provider"
            >
              Katıl
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
