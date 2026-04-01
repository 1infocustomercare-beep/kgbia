import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Package, Euro } from "lucide-react";
import { toast } from "sonner";

export default function CatalogPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", price: "", sku: "", stock: "", category: "" });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["catalog", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").eq("company_id", companyId!).order("sort_order");
      return data || [];
    },
  });

  const addProduct = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        company_id: companyId!, name: form.name, price: parseFloat(form.price) || 0,
        sku: form.sku, stock: parseInt(form.stock) || null, category: form.category,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      setOpen(false);
      setForm({ name: "", price: "", sku: "", stock: "", category: "" });
      toast.success("Prodotto aggiunto!");
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const filtered = products.filter((p: any) => p.name?.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">🛍️ Catalogo Prodotti</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="h-11"><Plus className="w-4 h-4 mr-2" /> Aggiungi</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nuovo Prodotto</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-11" /></div>
              <div><Label>Prezzo (€)</Label><Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="h-11" /></div>
              <div><Label>SKU</Label><Input value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} className="h-11" /></div>
              <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className="h-11" /></div>
              <div><Label>Categoria</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="h-11" /></div>
              <Button className="w-full h-11" onClick={() => addProduct.mutate()} disabled={!form.name}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Input placeholder="Cerca prodotto..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11" /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((p: any) => (
          <Card key={p.id}><CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2"><Package className="w-4 h-4 text-primary" /><p className="font-semibold">{p.name}</p></div>
              <p className="font-bold flex items-center"><Euro className="w-3 h-3" />{Number(p.price || 0).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {p.sku && <Badge variant="outline">{p.sku}</Badge>}
              {p.stock != null && <span>Stock: {p.stock}</span>}
              {p.category && <Badge variant="secondary">{p.category}</Badge>}
            </div>
          </CardContent></Card>
        ))}
      </div>

      {filtered.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">Nessun prodotto. Clicca "Aggiungi" per iniziare.</CardContent></Card>}
    </div>
  );
}
