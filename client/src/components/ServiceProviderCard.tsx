import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle } from "lucide-react";

interface ServiceProviderCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
}

export default function ServiceProviderCard({
  id,
  name,
  category,
  rating,
  reviewCount,
  description,
  image,
}: ServiceProviderCardProps) {
  const handleMessage = () => {
    console.log("Message provider:", id);
  };

  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid={`card-provider-${id}`}>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 truncate" data-testid={`text-provider-name-${id}`}>{name}</h3>
            <Badge variant="secondary" className="mb-2">{category}</Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">{rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviewCount} değerlendirme)</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <Button className="w-full" onClick={handleMessage} data-testid={`button-message-${id}`}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Mesaj Gönder
        </Button>
      </div>
    </Card>
  );
}
