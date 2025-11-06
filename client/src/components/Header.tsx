import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import logoImage from "@assets/Logo300yeni_1762458504612.jpg";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <img src={logoImage} alt="Bulduum" className="h-10 w-10" />
            <span className="text-xl font-bold text-primary">bulduum</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/kategoriler" data-testid="link-categories">
              <Button variant="ghost" size="sm" className="text-base">
                Kategoriler
              </Button>
            </Link>
            <Link href="/hizmet-saglayicilar" data-testid="link-providers">
              <Button variant="ghost" size="sm" className="text-base">
                Hizmet Sağlayıcılar
              </Button>
            </Link>
            <Link href="/nasil-calisir" data-testid="link-how-it-works">
              <Button variant="ghost" size="sm" className="text-base">
                Nasıl Çalışır?
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/giris" data-testid="link-login">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/kayit" data-testid="link-signup">
              <Button variant="default" size="sm" data-testid="button-signup">
                Kayıt Ol
              </Button>
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col gap-2 border-t" data-testid="nav-mobile">
            <Link href="/kategoriler" data-testid="link-categories-mobile">
              <Button variant="ghost" className="w-full justify-start">
                Kategoriler
              </Button>
            </Link>
            <Link href="/hizmet-saglayicilar" data-testid="link-providers-mobile">
              <Button variant="ghost" className="w-full justify-start">
                Hizmet Sağlayıcılar
              </Button>
            </Link>
            <Link href="/nasil-calisir" data-testid="link-how-it-works-mobile">
              <Button variant="ghost" className="w-full justify-start">
                Nasıl Çalışır?
              </Button>
            </Link>
            <Link href="/giris" data-testid="link-login-mobile">
              <Button variant="ghost" className="w-full justify-start">
                Giriş Yap
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
