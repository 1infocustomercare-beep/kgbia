import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send, Calendar, Instagram, Facebook } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SocialPage() {
  const { company } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ content: "", platform: "instagram" });

  const companyId = company?.id;

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["social-posts", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data } = await supabase.from("social_posts").select("*").eq("company_id", companyId).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!companyId,
  });

  const createPost = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error("No company");
      await supabase.from("social_posts").insert({
        company_id: companyId,
        content: form.content,
        platform: form.platform,
        status: "draft",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      setOpen(false);
      setForm({ content: "", platform: "instagram" });
      toast.success("Post creato");
    },
  });

  const PLATFORM_ICON: Record<string, any> = { instagram: Instagram, facebook: Facebook };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Social Media</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Nuovo Post</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Crea Post</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Piattaforma</Label>
                <Select value={form.platform} onValueChange={v => setForm(p => ({ ...p, platform: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Contenuto</Label><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} /></div>
              <Button onClick={() => createPost.mutate()} disabled={!form.content} className="w-full">Salva Bozza</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
      ) : posts.length === 0 ? (
        <Card className="border-dashed border-border/50"><CardContent className="p-8 text-center text-muted-foreground">
          <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Nessun post social. Crea il primo per iniziare!
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {posts.map((post: any) => {
            const PIcon = PLATFORM_ICON[post.platform] || Send;
            return (
              <Card key={post.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <PIcon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="capitalize">{post.platform}</Badge>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status === "published" ? "Pubblicato" : post.status === "scheduled" ? "Programmato" : "Bozza"}
                        </Badge>
                      </div>
                      <p className="text-sm">{post.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(post.created_at).toLocaleDateString("it-IT")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
