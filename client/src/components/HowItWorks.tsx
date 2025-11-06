import { Card } from "@/components/ui/card";
import { UserPlus, Search, MessageCircle } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Kayıt Ol",
    description: "Ücretsiz hesap oluşturun ve profilinizi tamamlayın",
    icon: UserPlus,
  },
  {
    number: 2,
    title: "Ara & Bul",
    description: "İhtiyacınıza uygun hizmet sağlayıcıları keşfedin",
    icon: Search,
  },
  {
    number: 3,
    title: "İletişime Geç",
    description: "Mesajlaşın, detayları konuşun ve anlaşın",
    icon: MessageCircle,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-muted-foreground">
            Üç basit adımda istediğiniz hizmete ulaşın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card className="p-8 text-center h-full">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
