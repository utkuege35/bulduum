import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import type { User, Message } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

type Conversation = {
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
};

export default function Messages() {
  const params = useParams();
  const otherUserId = params.userId;
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [messageContent, setMessageContent] = useState("");

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/messages"],
  });

  const { data: messages = [] } = useQuery<(Message & { sender: User; receiver: User })[]>({
    queryKey: ["/api/messages", otherUserId],
    queryFn: async () => {
      const res = await fetch(`/api/messages/${otherUserId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!otherUserId,
  });

  const sendMessage = useMutation({
    mutationFn: async (data: { receiverId: string; content: string }) => {
      const res = await apiRequest("POST", "/api/messages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages", otherUserId] });
      setMessageContent("");
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageContent.trim() || !otherUserId) return;
    sendMessage.mutate({ receiverId: otherUserId, content: messageContent });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const selectedConversation = conversations.find(c => c.otherUser.id === otherUserId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            {/* Conversations List */}
            <Card className={`md:col-span-1 ${otherUserId ? 'hidden md:block' : ''}`}>
              <CardHeader>
                <h2 className="text-2xl font-bold">Mesajlar</h2>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-18rem)]">
                  {conversations.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      Henüz mesajınız yok
                    </div>
                  ) : (
                    <div className="divide-y">
                      {conversations.map((conv) => (
                        <Link
                          key={conv.otherUser.id}
                          href={`/mesajlar/${conv.otherUser.id}`}
                        >
                          <div
                            className={`p-4 hover-elevate cursor-pointer ${
                              otherUserId === conv.otherUser.id ? 'bg-muted' : ''
                            }`}
                            data-testid={`conversation-${conv.otherUser.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={conv.otherUser.profileImageUrl ?? undefined} />
                                <AvatarFallback>
                                  {getInitials(conv.otherUser.firstName, conv.otherUser.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="font-semibold truncate">
                                    {conv.otherUser.firstName} {conv.otherUser.lastName}
                                  </h3>
                                  {conv.unreadCount > 0 && (
                                    <Badge variant="default" className="shrink-0">
                                      {conv.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mt-1">
                                  {conv.lastMessage.content}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                                    addSuffix: true,
                                    locale: tr,
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Message Thread */}
            <Card className="md:col-span-2">
              {otherUserId && selectedConversation ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => navigate("/mesajlar")}
                        data-testid="button-back"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <Avatar>
                        <AvatarImage src={selectedConversation.otherUser.profileImageUrl ?? undefined} />
                        <AvatarFallback>
                          {getInitials(selectedConversation.otherUser.firstName, selectedConversation.otherUser.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {selectedConversation.otherUser.firstName} {selectedConversation.otherUser.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.otherUser.email}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col">
                    <ScrollArea className="flex-1 p-4 h-[calc(100vh-28rem)]">
                      <div className="space-y-4">
                        {messages.map((msg) => {
                          const isOwn = msg.senderId === user?.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                              data-testid={`message-${msg.id}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {formatDistanceToNow(new Date(msg.createdAt), {
                                    addSuffix: true,
                                    locale: tr,
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                    <Separator />
                    <div className="p-4">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Mesajınızı yazın..."
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="min-h-[80px] resize-none"
                          data-testid="input-message"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageContent.trim() || sendMessage.isPending}
                          size="icon"
                          className="shrink-0"
                          data-testid="button-send"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-6">
                  <div className="text-muted-foreground">
                    <p className="text-lg font-semibold mb-2">Mesaj Seçilmedi</p>
                    <p className="text-sm">
                      Bir konuşma seçin veya yeni bir mesaj başlatın
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
