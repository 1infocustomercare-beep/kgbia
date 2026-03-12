import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, AlertTriangle, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function InventoryPage() {
  const { company } = useIndustry();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", price: "", cost: "", stock: "0", min_stock: "5", category: "Generale" });

  const companyId = company?.id;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data } = await supabase.from("products").select("*").eq("company_id", companyId).order("name");
      return data || [];
    },
    enabled: !!companyId,
  });

  const addProduct = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error("No company");
      await supabase.from("products").insert({
        company_id: companyId,
        name: form.name,
        sku: form.sku || null,
        price: parseFloat(form.price) || 0,
        cost: parseFloat(form.cost) || 0,
        stock: parseInt(form.stock) || 0,
        min_stock: parseInt(form.min_stock) || 5,
        category: form.category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      setForm({ name: "", sku: "", price: "", cost: "", stock: "0", min_stock: "5", category: "Generale" });
      toast.success("Prodotto aggiunto");
    },
  });

  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
  const lowStock = products.filter((p: any) => p.stock <= (p.min_stock || 5));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Inventario & Magazzino</h1>
          {lowStock.length > 0 && (
            <p className="text-sm text-yellow-400 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-4 h-4" /> {lowStock.length} prodotti sotto scorta minima
            </p>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Aggiungi Prodotto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuovo Prodotto</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label>SKU</Label><Input value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Prezzo (€)</Label><Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
                <div><Label>Costo (€)</Label><Input type="number" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} /></div>
                <div><Label>Categoria</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Scorta Attuale</Label><Input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} /></div>
                <div><Label>Scorta Minima</Label><Input type="number" value={form.min_stock} onChange={e => setForm(p => ({ ...p, min_stock: e.target.value }))} /></div>
              </div>
              <Button onClick={() => addProduct.mutate()} disabled={!form.name} className="w-full">Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca prodotto..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-border/50"><CardContent className="p-8 text-center text-muted-foreground"><Package className="w-8 h-8 mx-auto mb-2 opacity-50" />Nessun prodotto trovato.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p: any) => {
            const isLow = p.stock <= (p.min_stock || 5);
            return (
              <Card key={p.id} className={`border-border/50 ${isLow ? "border-yellow-500/30" : ""}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.name}</span>
                      {p.sku && <span className="text-xs text-muted-foreground">SKU: {p.sku}</span>}
                      <Badge variant="outline">{p.category}</Badge>
                      {isLow && <Badge className="bg-yellow-500/20 text-yellow-400">Scorta Bassa</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Stock</p>
                      <p className={`font-bold ${isLow ? "text-yellow-400" : "text-foreground"}`}>{p.stock}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Prezzo</p>
                      <p className="font-bold text-primary">€{Number(p.price).toFixed(2)}</p>
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
