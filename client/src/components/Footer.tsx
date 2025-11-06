import { Link } from "wouter";
import logoImage from "@assets/Logo300yeni_1762458504612.jpg";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="Bulduum" className="h-10 w-10" />
              <span className="text-xl font-bold text-primary">bulduum</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hizmet sağlayıcıları ve müşterileri bir araya getiren güvenilir platform
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/egitim" className="text-muted-foreground hover:text-foreground">Eğitim</Link></li>
              <li><Link href="/ev-hizmetleri" className="text-muted-foreground hover:text-foreground">Ev Hizmetleri</Link></li>
              <li><Link href="/bakim" className="text-muted-foreground hover:text-foreground">Bakım Hizmetleri</Link></li>
              <li><Link href="/el-yapimi" className="text-muted-foreground hover:text-foreground">El Yapımı Ürünler</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hakkimizda" className="text-muted-foreground hover:text-foreground">Hakkımızda</Link></li>
              <li><Link href="/nasil-calisir" className="text-muted-foreground hover:text-foreground">Nasıl Çalışır?</Link></li>
              <li><Link href="/iletisim" className="text-muted-foreground hover:text-foreground">İletişim</Link></li>
              <li><Link href="/kariyer" className="text-muted-foreground hover:text-foreground">Kariyer</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/kullanim-kosullari" className="text-muted-foreground hover:text-foreground">Kullanım Koşulları</Link></li>
              <li><Link href="/gizlilik" className="text-muted-foreground hover:text-foreground">Gizlilik Politikası</Link></li>
              <li><Link href="/cerez" className="text-muted-foreground hover:text-foreground">Çerez Politikası</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Bulduum. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
