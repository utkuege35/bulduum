import TestimonialCard from '../TestimonialCard';
import userImage from '@assets/generated_images/Service_provider_profile_photo_1_a131f1c3.png';

export default function TestimonialCardExample() {
  return (
    <div className="max-w-md">
      <TestimonialCard
        name="Elif Şahin"
        role="Müşteri"
        rating={5}
        comment="Çocuğum için harika bir İngilizce öğretmeni buldum. Platform çok kullanışlı ve güvenli."
        image={userImage}
      />
    </div>
  );
}
