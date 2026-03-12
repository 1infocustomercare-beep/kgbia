import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function MenuPage() {
  const { company } = useIndustry();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Altro" });

  // For food industry, menu_items uses restaurant_id. We need to find restaurant for current user.
  const { data: restaurant } = useQuery({
    queryKey: ["my-restaurant-for-menu"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("restaurants").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
      return data;
    },
  });

  const restaurantId = restaurant?.id;

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["menu-items", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data } = await supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId).order("sort_order");
      return data || [];
    },
    enabled: !!restaurantId,
  });

  const addItem = useMutation({
    mutationFn: async () => {
      if (!restaurantId) throw new Error("No restaurant");
      await supabase.from("menu_items").insert({
        restaurant_id: restaurantId,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price) || 0,
        category: form.category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      setOpen(false);
      setForm({ name: "", description: "", price: "", category: "Altro" });
      toast.success("Piatto aggiunto");
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      await supabase.from("menu_items").update({ is_active: !is_active }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu-items"] }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("menu_items").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Piatto eliminato");
    },
  });

  const categories = [...new Set(items.map((i: any) => i.category))];
  const filtered = items.filter((i: any) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-heading">Menu Digitale</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Aggiungi Piatto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuovo Piatto</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Descrizione</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Prezzo (€)</Label><Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
                <div><Label>Categoria</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
              </div>
              <Button onClick={() => addItem.mutate()} disabled={!form.name} className="w-full">Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca piatto..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
      ) : (
        categories.map(cat => {
          const catItems = filtered.filter((i: any) => i.category === cat);
          if (catItems.length === 0) return null;
          return (
            <div key={cat} className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">{cat}</h2>
              <div className="grid gap-3">
                {catItems.map((item: any) => (
                  <Card key={item.id} className={`border-border/50 ${!item.is_active ? "opacity-50" : ""}`}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{item.name}</span>
                          {item.is_popular && <Badge variant="secondary" className="text-xs">Popolare</Badge>}
                          {!item.is_active && <Badge variant="outline" className="text-xs">Nascosto</Badge>}
                        </div>
                        {item.description && <p className="text-sm text-muted-foreground truncate mt-1">{item.description}</p>}
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="font-bold text-primary">€{Number(item.price).toFixed(2)}</span>
                        <Button variant="ghost" size="icon" onClick={() => toggleActive.mutate({ id: item.id, is_active: item.is_active })}>
                          {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem.mutate(item.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })
      )}

      {!isLoading && items.length === 0 && (
        <Card className="border-dashed border-border/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>Nessun piatto nel menu. Aggiungi il primo!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
