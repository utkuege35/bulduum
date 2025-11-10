import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import logoImage from "@assets/Logo300yeni_1762458504612.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Çıkış yapıldı",
        description: "Başarıyla çıkış yaptınız.",
      });
      setLocation("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <img src={logoImage} alt="Bulduum" className="h-10 w-10" />
            <span className="text-xl font-bold text-primary">bulduum</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/hizmet-saglayicilar" data-testid="link-providers">
              <Button variant="ghost" size="sm" className="text-base">
                Hizmet / Ürün sağlayıcılar
              </Button>
            </Link>
            <Link href="/hizmet-arayanlar" data-testid="link-seekers">
              <Button variant="ghost" size="sm" className="text-base">
                Hizmet / Ürün arayanlar
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-base"
              onClick={() => {
                const element = document.getElementById('nasil-calisir');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/#nasil-calisir';
                }
              }}
              data-testid="link-how-it-works"
            >
              Nasıl Çalışır?
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu">
              <Menu className="h-5 w-5" />
            </Button>
            
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2" data-testid="button-user-menu">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImageUrl ?? undefined} alt={user.firstName ?? "User"} />
                          <AvatarFallback>{getInitials(user.firstName ?? undefined, user.lastName ?? undefined)}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline">{user.firstName ?? user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profil" className="cursor-pointer" data-testid="link-profile">
                          <User className="mr-2 h-4 w-4" />
                          Profilim
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/mesajlar" className="cursor-pointer" data-testid="link-messages">
                          <User className="mr-2 h-4 w-4" />
                          Mesajlarım
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" data-testid="button-logout">
                        <LogOut className="mr-2 h-4 w-4" />
                        Çıkış Yap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link href="/giris">
                      <Button variant="ghost" size="sm" className="hidden md:inline-flex" data-testid="button-login">
                        Giriş Yap
                      </Button>
                    </Link>
                    <Link href="/kayit-ol">
                      <Button variant="default" size="sm" data-testid="button-signup">
                        Kayıt Ol
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col gap-2 border-t" data-testid="nav-mobile">
            <Link href="/hizmet-saglayicilar" data-testid="link-providers-mobile">
              <Button variant="ghost" className="w-full justify-start">
                Hizmet / Ürün sağlayıcılar
              </Button>
            </Link>
            <Link href="/hizmet-arayanlar" data-testid="link-seekers-mobile">
              <Button variant="ghost" className="w-full justify-start">
                Hizmet / Ürün arayanlar
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                const element = document.getElementById('nasil-calisir');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                } else {
                  window.location.href = '/#nasil-calisir';
                }
              }}
              data-testid="link-how-it-works-mobile"
            >
              Nasıl Çalışır?
            </Button>
            {!isAuthenticated && !isLoading && (
              <Link href="/giris" className="w-full">
                <Button variant="ghost" className="w-full justify-start" data-testid="button-login-mobile">
                  Giriş Yap
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
