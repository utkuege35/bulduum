import { Card } from "@/components/ui/card";
import { Shield, Star, MessageSquare, CheckCircle } from "lucide-react";
import trustImage from "@assets/generated_images/Trust_and_safety_illustration_e37b9440.png";

const trustFeatures = [
  {
    icon: CheckCircle,
    title: "Doğrulanmış Profiller",
    description: "Tüm hizmet sağlayıcılar kimlik doğrulamasından geçer",
  },
  {
    icon: Star,
    title: "Gerçek Değerlendirmeler",
    description: "Sadece hizmet alan kullanıcılar yorum yapabilir",
  },
  {
    icon: MessageSquare,
    title: "Güvenli Mesajlaşma",
    description: "Platform üzerinden güvenle iletişim kurun",
  },
  {
    icon: Shield,
    title: "Gizlilik Garantisi",
    description: "Kişisel bilgileriniz korunur ve paylaşılmaz",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 md:py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Güven ve Güvenlik
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Bulduum'da güvenliğiniz önceliğimizdir. Her adımda sizin ve hizmet sağlayıcıların güvenliğini sağlıyoruz.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={trustImage}
              alt="Güven ve Güvenlik"
              className="rounded-lg max-w-md w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
