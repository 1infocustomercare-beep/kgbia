import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Instagram, Facebook, Send, Calendar, BarChart3, Plus, Sparkles, Hash,
  Image, Clock, Eye, Heart, MessageCircle, Share2, TrendingUp, Edit,
  Trash2, Copy, Globe, Check, X, RefreshCw, Bot, Zap,
} from "lucide-react";

// ── Types ──
type PostStatus = "draft" | "scheduled" | "published" | "failed";
type Platform = "instagram" | "facebook" | "tiktok" | "google";

const PLATFORM_META: Record<Platform, { icon: typeof Instagram; label: string; color: string; maxChars: number }> = {
  instagram: { icon: Instagram, label: "Instagram", color: "text-pink-500", maxChars: 2200 },
  facebook: { icon: Facebook, label: "Facebook", color: "text-blue-500", maxChars: 5000 },
  tiktok: { icon: Hash, label: "TikTok", color: "text-foreground", maxChars: 2200 },
  google: { icon: Globe, label: "Google", color: "text-green-500", maxChars: 1500 },
};

const STATUS_BADGE: Record<PostStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Bozza", variant: "secondary" },
  scheduled: { label: "Programmato", variant: "outline" },
  published: { label: "Pubblicato", variant: "default" },
  failed: { label: "Errore", variant: "destructive" },
};

// ── Component ──
export default function SocialPage() {
  const { user } = useAuth();
  const { company } = useIndustry();
  const queryClient = useQueryClient();
  const companyId = company?.id;

  const [activeTab, setActiveTab] = useState("crea");

  // Post form
  const [postForm, setPostForm] = useState({
    platform: "instagram" as Platform,
    content: "",
    image_url: "",
    scheduling: "now" as "now" | "schedule",
    scheduled_date: "",
    scheduled_time: "09:00",
  });

  // AI Generator
  const [aiForm, setAiForm] = useState({
    goal: "promozione",
    tone: "professionale",
    topic: "",
    platform: "instagram",
    length: "medio",
    include_cta: true,
    include_hashtags: true,
  });
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);

  // Filters
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // ── Queries ──
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["social-posts", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data, error } = await supabase
        .from("social_posts")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  // ── Stats ──
  const stats = {
    total: posts.length,
    published: posts.filter((p: any) => p.status === "published").length,
    scheduled: posts.filter((p: any) => p.status === "scheduled").length,
    drafts: posts.filter((p: any) => p.status === "draft").length,
  };

  // Filtered posts
  const filteredPosts = posts.filter((p: any) => {
    if (filterPlatform !== "all" && p.platform !== filterPlatform) return false;
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    return true;
  });

  // ── Mutations ──
  const createPost = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error("No company");
      const insert: any = {
        company_id: companyId,
        content: postForm.content,
        platform: postForm.platform,
        image_url: postForm.image_url || null,
        status: postForm.scheduling === "schedule" ? "scheduled" : "draft",
      };
      if (postForm.scheduling === "schedule" && postForm.scheduled_date) {
        insert.scheduled_at = `${postForm.scheduled_date}T${postForm.scheduled_time}:00`;
      }
      const { error } = await supabase.from("social_posts").insert(insert);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      setPostForm({ platform: "instagram", content: "", image_url: "", scheduling: "now", scheduled_date: "", scheduled_time: "09:00" });
      toast.success("Post creato con successo!");
    },
    onError: (e: any) => toast.error(e.message || "Errore nella creazione"),
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      toast.success("Post eliminato");
    },
  });

  const duplicatePost = useMutation({
    mutationFn: async (post: any) => {
      if (!companyId) throw new Error("No company");
      const { error } = await supabase.from("social_posts").insert({
        company_id: companyId,
        content: post.content,
        platform: post.platform,
        image_url: post.image_url,
        status: "draft",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      toast.success("Post duplicato come bozza");
    },
  });

  // ── AI Generation ──
  const generateAiContent = async () => {
    if (!aiForm.topic.trim()) {
      toast.error("Inserisci un argomento");
      return;
    }
    setIsAiGenerating(true);
    setAiResults([]);
    try {
      const { data, error } = await supabase.functions.invoke("sector-ai-agent", {
        body: {
          agent: "social-writer",
          action: "generate_posts",
          payload: {
            goal: aiForm.goal,
            tone: aiForm.tone,
            topic: aiForm.topic,
            platform: aiForm.platform,
            length: aiForm.length,
            include_cta: aiForm.include_cta,
            include_hashtags: aiForm.include_hashtags,
            business_name: company?.name || "",
            industry: company?.industry || "food",
          },
        },
      });
      if (error) throw error;
      const text = typeof data === "string" ? data : data?.result || data?.text || data?.content || "";
      // Split by numbered items or double newlines
      const parts = text.split(/\n(?=\d+[\.\)]|\n)/).map((s: string) => s.trim()).filter(Boolean);
      setAiResults(parts.length > 1 ? parts : [text]);
    } catch (err: any) {
      console.error("AI generation error:", err);
      // Fallback: generate locally
      const templates = generateLocalFallback(aiForm);
      setAiResults(templates);
      toast.info("Generazione AI non disponibile, ecco dei suggerimenti predefiniti");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const useAiResult = (text: string) => {
    setPostForm((p) => ({ ...p, content: text, platform: aiForm.platform as Platform }));
    setShowAiDialog(false);
    setActiveTab("crea");
    toast.success("Contenuto applicato! Modifica e pubblica.");
  };

  // ── Char info ──
  const currentPlatform = PLATFORM_META[postForm.platform] || PLATFORM_META.instagram;
  const charCount = postForm.content.length;
  const charPercent = Math.min(100, (charCount / currentPlatform.maxChars) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Social Publishing AI</h1>
          <p className="text-sm text-muted-foreground">Crea, programma e gestisci i tuoi post con l'aiuto dell'AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" /> AI Generator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" /> AI Content Generator
                </DialogTitle>
              </DialogHeader>
              <AiGeneratorForm
                aiForm={aiForm}
                setAiForm={setAiForm}
                isGenerating={isAiGenerating}
                results={aiResults}
                onGenerate={generateAiContent}
                onUse={useAiResult}
              />
            </DialogContent>
          </Dialog>
          <Button onClick={() => setActiveTab("crea")} className="gap-2">
            <Plus className="w-4 h-4" /> Nuovo Post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={BarChart3} label="Totale Post" value={stats.total} color="text-primary" />
        <StatCard icon={Check} label="Pubblicati" value={stats.published} color="text-green-500" />
        <StatCard icon={Clock} label="Programmati" value={stats.scheduled} color="text-amber-500" />
        <StatCard icon={Edit} label="Bozze" value={stats.drafts} color="text-muted-foreground" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crea" className="gap-2"><Plus className="w-3.5 h-3.5" /> Crea</TabsTrigger>
          <TabsTrigger value="feed" className="gap-2"><Eye className="w-3.5 h-3.5" /> Feed</TabsTrigger>
          <TabsTrigger value="calendario" className="gap-2"><Calendar className="w-3.5 h-3.5" /> Calendario</TabsTrigger>
        </TabsList>

        {/* ── TAB: Crea ── */}
        <TabsContent value="crea" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-[1fr,320px] gap-4">
            {/* Editor */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Componi Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Platform select */}
                <div className="space-y-1.5">
                  <Label>Piattaforma</Label>
                  <div className="flex gap-2">
                    {(Object.keys(PLATFORM_META) as Platform[]).map((p) => {
                      const meta = PLATFORM_META[p];
                      const Icon = meta.icon;
                      return (
                        <Button
                          key={p}
                          variant={postForm.platform === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPostForm((f) => ({ ...f, platform: p }))}
                          className="gap-1.5"
                        >
                          <Icon className={`w-4 h-4 ${postForm.platform === p ? "" : meta.color}`} />
                          {meta.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>Contenuto</Label>
                    <span className={`text-xs ${charPercent > 90 ? "text-destructive" : "text-muted-foreground"}`}>
                      {charCount}/{currentPlatform.maxChars}
                    </span>
                  </div>
                  <Textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="Scrivi il tuo post o usa l'AI Generator..."
                    rows={6}
                    className="resize-none"
                  />
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${charPercent > 90 ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${charPercent}%` }}
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5"><Image className="w-3.5 h-3.5" /> URL Immagine (opzionale)</Label>
                  <Input
                    value={postForm.image_url}
                    onChange={(e) => setPostForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                {/* Scheduling */}
                <Separator />
                <div className="space-y-3">
                  <Label>Pubblicazione</Label>
                  <RadioGroup
                    value={postForm.scheduling}
                    onValueChange={(v) => setPostForm((f) => ({ ...f, scheduling: v as "now" | "schedule" }))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="now" id="pub-now" />
                      <Label htmlFor="pub-now" className="font-normal">Salva come bozza</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="schedule" id="pub-sched" />
                      <Label htmlFor="pub-sched" className="font-normal">Programma</Label>
                    </div>
                  </RadioGroup>
                  {postForm.scheduling === "schedule" && (
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={postForm.scheduled_date}
                        onChange={(e) => setPostForm((f) => ({ ...f, scheduled_date: e.target.value }))}
                      />
                      <Input
                        type="time"
                        value={postForm.scheduled_time}
                        onChange={(e) => setPostForm((f) => ({ ...f, scheduled_time: e.target.value }))}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => createPost.mutate()}
                    disabled={!postForm.content.trim() || createPost.isPending}
                    className="flex-1 gap-2"
                  >
                    {postForm.scheduling === "schedule" ? <Calendar className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {postForm.scheduling === "schedule" ? "Programma Post" : "Salva Bozza"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAiDialog(true)} className="gap-2">
                    <Sparkles className="w-4 h-4" /> AI
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Anteprima
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PostPreview
                  platform={postForm.platform}
                  content={postForm.content}
                  imageUrl={postForm.image_url}
                  businessName={company?.name || "La tua attività"}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── TAB: Feed ── */}
        <TabsContent value="feed" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Piattaforma" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte</SelectItem>
                {(Object.keys(PLATFORM_META) as Platform[]).map((p) => (
                  <SelectItem key={p} value={p}>{PLATFORM_META[p].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Stato" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="draft">Bozze</SelectItem>
                <SelectItem value="scheduled">Programmati</SelectItem>
                <SelectItem value="published">Pubblicati</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Caricamento...</div>
          ) : filteredPosts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center text-muted-foreground">
                <Send className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Nessun post trovato</p>
                <p className="text-xs mt-1">Crea il tuo primo post o modifica i filtri</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {filteredPosts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={() => deletePost.mutate(post.id)}
                  onDuplicate={() => duplicatePost.mutate(post)}
                  onEdit={() => {
                    setPostForm({
                      platform: post.platform,
                      content: post.content || "",
                      image_url: post.image_url || "",
                      scheduling: post.scheduled_at ? "schedule" : "now",
                      scheduled_date: post.scheduled_at ? post.scheduled_at.split("T")[0] : "",
                      scheduled_time: post.scheduled_at ? post.scheduled_at.split("T")[1]?.slice(0, 5) || "09:00" : "09:00",
                    });
                    setActiveTab("crea");
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── TAB: Calendario ── */}
        <TabsContent value="calendario" className="mt-4">
          <CalendarView posts={posts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Sub-components ──

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PostCard({ post, onDelete, onDuplicate, onEdit }: { post: any; onDelete: () => void; onDuplicate: () => void; onEdit: () => void }) {
  const meta = PLATFORM_META[post.platform as Platform] || PLATFORM_META.instagram;
  const Icon = meta.icon;
  const statusInfo = STATUS_BADGE[post.status as PostStatus] || STATUS_BADGE.draft;

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${meta.color}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="capitalize text-xs">{meta.label}</Badge>
              <Badge variant={statusInfo.variant} className="text-xs">{statusInfo.label}</Badge>
              {post.scheduled_at && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(post.scheduled_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
            <p className="text-sm whitespace-pre-line line-clamp-3">{post.content}</p>
            {post.image_url && (
              <div className="mt-2 rounded-lg overflow-hidden border max-w-[200px]">
                <img src={post.image_url} alt="" className="w-full h-24 object-cover" />
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Creato: {new Date(post.created_at).toLocaleDateString("it-IT")}
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} title="Modifica">
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDuplicate} title="Duplica">
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete} title="Elimina">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PostPreview({ platform, content, imageUrl, businessName }: { platform: string; content: string; imageUrl: string; businessName: string }) {
  const meta = PLATFORM_META[platform as Platform] || PLATFORM_META.instagram;
  const Icon = meta.icon;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className={`w-4 h-4 ${meta.color}`} />
        </div>
        <div>
          <p className="text-xs font-semibold">{businessName}</p>
          <p className="text-[10px] text-muted-foreground">Adesso</p>
        </div>
      </div>
      {/* Image */}
      {imageUrl && (
        <div className="aspect-square bg-muted">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {/* Content */}
      <div className="p-3">
        <p className="text-xs whitespace-pre-line line-clamp-6">{content || "Il tuo contenuto apparirà qui..."}</p>
      </div>
      {/* Actions mock */}
      <div className="flex items-center gap-4 px-3 pb-3 text-muted-foreground">
        <Heart className="w-4 h-4" />
        <MessageCircle className="w-4 h-4" />
        <Share2 className="w-4 h-4" />
      </div>
    </div>
  );
}

function AiGeneratorForm({
  aiForm, setAiForm, isGenerating, results, onGenerate, onUse,
}: {
  aiForm: any; setAiForm: (fn: any) => void; isGenerating: boolean;
  results: string[]; onGenerate: () => void; onUse: (t: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Obiettivo</Label>
          <Select value={aiForm.goal} onValueChange={(v) => setAiForm((f: any) => ({ ...f, goal: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="promozione">Promozione</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
              <SelectItem value="evento">Evento</SelectItem>
              <SelectItem value="offerta">Offerta Speciale</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Tono</Label>
          <Select value={aiForm.tone} onValueChange={(v) => setAiForm((f: any) => ({ ...f, tone: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="professionale">Professionale</SelectItem>
              <SelectItem value="amichevole">Amichevole</SelectItem>
              <SelectItem value="divertente">Divertente</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
              <SelectItem value="ispirazionale">Ispirazionale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Argomento / Cosa vuoi comunicare</Label>
        <Textarea
          value={aiForm.topic}
          onChange={(e) => setAiForm((f: any) => ({ ...f, topic: e.target.value }))}
          placeholder="Es: Nuovo menu estivo con piatti freschi e leggeri..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Piattaforma</Label>
          <Select value={aiForm.platform} onValueChange={(v) => setAiForm((f: any) => ({ ...f, platform: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(PLATFORM_META) as Platform[]).map((p) => (
                <SelectItem key={p} value={p}>{PLATFORM_META[p].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Lunghezza</Label>
          <Select value={aiForm.length} onValueChange={(v) => setAiForm((f: any) => ({ ...f, length: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="corto">Corto</SelectItem>
              <SelectItem value="medio">Medio</SelectItem>
              <SelectItem value="lungo">Lungo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={aiForm.include_cta} onCheckedChange={(v) => setAiForm((f: any) => ({ ...f, include_cta: v }))} />
          <Label className="font-normal text-sm">CTA</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={aiForm.include_hashtags} onCheckedChange={(v) => setAiForm((f: any) => ({ ...f, include_hashtags: v }))} />
          <Label className="font-normal text-sm">Hashtag</Label>
        </div>
      </div>

      <Button onClick={onGenerate} disabled={isGenerating || !aiForm.topic.trim()} className="w-full gap-2">
        {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {isGenerating ? "Generazione in corso..." : "Genera con AI"}
      </Button>

      {results.length > 0 && (
        <ScrollArea className="max-h-[300px]">
          <div className="space-y-3">
            {results.map((r, i) => (
              <Card key={i} className="border-primary/20">
                <CardContent className="p-3">
                  <p className="text-sm whitespace-pre-line mb-2">{r}</p>
                  <Button size="sm" variant="outline" onClick={() => onUse(r)} className="gap-1.5">
                    <Check className="w-3 h-3" /> Usa questo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function CalendarView({ posts }: { posts: any[] }) {
  const scheduled = posts.filter((p: any) => p.scheduled_at || p.published_at);
  const grouped: Record<string, any[]> = {};
  scheduled.forEach((p) => {
    const d = (p.scheduled_at || p.published_at || p.created_at).split("T")[0];
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(p);
  });
  const sortedDates = Object.keys(grouped).sort().reverse();

  if (sortedDates.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-10 text-center text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nessun post programmato</p>
          <p className="text-xs mt-1">Programma i tuoi post per vederli qui</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {new Date(date + "T00:00:00").toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          <div className="space-y-2 pl-6 border-l-2 border-primary/20">
            {grouped[date].map((post: any) => {
              const meta = PLATFORM_META[post.platform as Platform] || PLATFORM_META.instagram;
              const Icon = meta.icon;
              const statusInfo = STATUS_BADGE[post.status as PostStatus] || STATUS_BADGE.draft;
              const time = (post.scheduled_at || post.published_at || "").split("T")[1]?.slice(0, 5) || "";
              return (
                <Card key={post.id} className="ml-2">
                  <CardContent className="p-3 flex items-center gap-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${meta.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-1">{post.content}</p>
                    </div>
                    {time && <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>}
                    <Badge variant={statusInfo.variant} className="text-xs">{statusInfo.label}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Local fallback templates ──
function generateLocalFallback(form: any): string[] {
  const hashtags = form.include_hashtags ? "\n\n#business #crescita #innovazione #digital" : "";
  const cta = form.include_cta ? "\n\n👉 Contattaci per saperne di più!" : "";
  return [
    `🚀 ${form.topic}\n\nScopri come possiamo aiutarti a raggiungere i tuoi obiettivi!${cta}${hashtags}`,
    `✨ ${form.topic}\n\nLa qualità che meriti, il servizio che desideri.${cta}${hashtags}`,
    `💡 ${form.topic}\n\nInnovazione e tradizione al servizio del tuo business.${cta}${hashtags}`,
  ];
}
