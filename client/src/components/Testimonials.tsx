import TestimonialCard from "./TestimonialCard";
import customer1 from "@assets/generated_images/Service_provider_profile_photo_1_a131f1c3.png";
import customer2 from "@assets/generated_images/Service_provider_profile_photo_2_1f7eb592.png";
import customer3 from "@assets/generated_images/Service_provider_profile_photo_3_10adcb1e.png";

const testimonials = [
  {
    name: "Elif Şahin",
    role: "Müşteri",
    rating: 5,
    comment: "Çocuğum için harika bir İngilizce öğretmeni buldum. Platform çok kullanışlı ve güvenli.",
    image: customer1,
  },
  {
    name: "Ahmet Yıldız",
    role: "Hizmet Sağlayıcı",
    rating: 5,
    comment: "Elektrik işlerimi buradan buluyorum. Müşterilerle doğrudan iletişim kurmak çok kolay.",
    image: customer2,
  },
  {
    name: "Fatma Arslan",
    role: "Müşteri",
    rating: 5,
    comment: "Evime düzenli temizlik için güvenilir birini buldum. Çok memnunum, herkese tavsiye ederim.",
    image: customer3,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kullanıcılarımız Ne Diyor?
          </h2>
          <p className="text-lg text-muted-foreground">
            Binlerce mutlu kullanıcımızdan bazılarının görüşleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
