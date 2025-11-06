import ServiceProviderCard from '../ServiceProviderCard';
import providerImage from '@assets/generated_images/Service_provider_profile_photo_1_a131f1c3.png';

export default function ServiceProviderCardExample() {
  return (
    <div className="max-w-sm">
      <ServiceProviderCard
        id="1"
        name="Ayşe Yılmaz"
        category="Matematik Öğretmeni"
        rating={4.8}
        reviewCount={32}
        description="10 yıllık deneyimle lise ve üniversite öğrencilerine özel matematik dersi veriyorum."
        image={providerImage}
      />
    </div>
  );
}
