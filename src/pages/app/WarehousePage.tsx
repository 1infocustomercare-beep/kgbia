import { useMemo, useState } from "react";
import { useMyRestaurant } from "@/hooks/useMyRestaurant";
import {
  useSuppliers, useInventoryItems, useRestockSuggestions,
  useRecipes, useRecipeIngredients,
  useUpsertSupplier, useUpsertItem, useCreateMovement,
  useUpsertRecipe, useAddIngredient, useDeleteIngredient,
  type InventoryItem, type Supplier, type Recipe,
} from "@/hooks/useWarehouse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Package, AlertTriangle, Truck, ChefHat, Plus, Pencil,
  ArrowDownToLine, ArrowUpFromLine, Trash2, Sparkles, Phone, Mail, ShoppingCart,
} from "lucide-react";

export default function WarehousePage() {
  const { restaurant } = useMyRestaurant();
  const restaurantId = restaurant?.id;

  const suppliers = useSuppliers(restaurantId);
  const items = useInventoryItems(restaurantId);
  const suggestions = useRestockSuggestions(restaurantId);
  const recipes = useRecipes(restaurantId);

  if (!restaurantId) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nessun ristorante associato.
      </div>
    );
  }

  const stockValue = useMemo(
    () => (items.data || []).reduce((s, i) => s + i.stock_qty * i.cost_per_unit, 0),
    [items.data],
  );

  const lowCount = (suggestions.data || []).filter(s => s.urgency !== "ok").length;

  return (
    <div className="container mx-auto p-4 pb-32 space-y-4 max-w-6xl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" /> Magazzino
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestisci scorte, fornitori, ricette e suggerimenti di rifornimento.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="px-3 py-1.5">
            {items.data?.length ?? 0} articoli
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5">
            Valore scorta: €{stockValue.toFixed(2)}
          </Badge>
          {lowCount > 0 && (
            <Badge variant="destructive" className="px-3 py-1.5 gap-1">
              <AlertTriangle className="w-3 h-3" /> {lowCount} sotto soglia
            </Badge>
          )}
        </div>
      </header>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="suggestions" className="gap-1">
            <Sparkles className="w-4 h-4" /> Rifornimenti
          </TabsTrigger>
          <TabsTrigger value="stock" className="gap-1">
            <Package className="w-4 h-4" /> Scorte
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="gap-1">
            <Truck className="w-4 h-4" /> Fornitori
          </TabsTrigger>
          <TabsTrigger value="recipes" className="gap-1">
            <ChefHat className="w-4 h-4" /> Ricette
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-3 mt-4">
          <SuggestionsTab restaurantId={restaurantId} />
        </TabsContent>
        <TabsContent value="stock" className="space-y-3 mt-4">
          <StockTab restaurantId={restaurantId} items={items.data || []} suppliers={suppliers.data || []} />
        </TabsContent>
        <TabsContent value="suppliers" className="space-y-3 mt-4">
          <SuppliersTab restaurantId={restaurantId} suppliers={suppliers.data || []} />
        </TabsContent>
        <TabsContent value="recipes" className="space-y-3 mt-4">
          <RecipesTab restaurantId={restaurantId} recipes={recipes.data || []} items={items.data || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ════════════════════ RIFORNIMENTI ════════════════════ */
function SuggestionsTab({ restaurantId }: { restaurantId: string }) {
  const { data: list = [], isLoading } = useRestockSuggestions(restaurantId);
  const totalCost = list.reduce((s, x) => s + (x.suggested_order_cost || 0), 0);

  const urgencyLabel = (u: string) => ({
    out_of_stock: { label: "ESAURITO", variant: "destructive" as const },
    below_min: { label: "Sotto minimo", variant: "destructive" as const },
    below_par: { label: "Sotto par", variant: "secondary" as const },
    ok: { label: "OK", variant: "outline" as const },
  })[u] || { label: u, variant: "outline" as const };

  if (isLoading) return <p className="text-sm text-muted-foreground">Caricamento…</p>;
  if (list.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-2">
          <Sparkles className="w-10 h-10 mx-auto text-primary" />
          <p className="font-medium">Tutto in ordine</p>
          <p className="text-sm text-muted-foreground">Nessun articolo sotto la soglia di riordino.</p>
        </CardContent>
      </Card>
    );
  }

  // Group by supplier
  const grouped = list.reduce<Record<string, typeof list>>((acc, s) => {
    const key = s.supplier_id || "_no_supplier";
    (acc[key] = acc[key] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-medium">Costo stimato rifornimento totale</p>
            <p className="text-2xl font-bold text-primary">€{totalCost.toFixed(2)}</p>
          </div>
          <Badge variant="secondary">{list.length} articoli da ordinare</Badge>
        </CardContent>
      </Card>

      {Object.entries(grouped).map(([supplierId, rows]) => {
        const first = rows[0];
        const subtotal = rows.reduce((s, r) => s + r.suggested_order_cost, 0);
        return (
          <Card key={supplierId}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    {first.supplier_name || "Senza fornitore assegnato"}
                  </CardTitle>
                  {first.supplier_name && (
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      {first.supplier_email && (
                        <a href={`mailto:${first.supplier_email}?subject=Ordine%20rifornimento`} className="flex items-center gap-1 hover:text-primary">
                          <Mail className="w-3 h-3" /> {first.supplier_email}
                        </a>
                      )}
                      {first.supplier_phone && (
                        <a href={`tel:${first.supplier_phone}`} className="flex items-center gap-1 hover:text-primary">
                          <Phone className="w-3 h-3" /> {first.supplier_phone}
                        </a>
                      )}
                      {first.lead_time_days != null && (
                        <span>Lead time: {first.lead_time_days}g</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Subtotale</p>
                  <p className="font-bold">€{subtotal.toFixed(2)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {rows.map(r => {
                const ul = urgencyLabel(r.urgency);
                return (
                  <div key={r.item_id} className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-card">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium truncate">{r.name}</p>
                        <Badge variant={ul.variant} className="text-[10px]">{ul.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Scorta: {r.stock_qty} {r.unit} · Min: {r.min_qty} · Par: {r.par_qty}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold">{r.suggested_order_qty.toFixed(2)} {r.unit}</p>
                      <p className="text-xs text-muted-foreground">€{r.suggested_order_cost.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
              {first.supplier_email && (
                <Button asChild className="w-full mt-2" variant="default">
                  <a
                    href={buildOrderEmail(first.supplier_email, first.supplier_name || "Fornitore", rows)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Invia ordine via email
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function buildOrderEmail(to: string, supplierName: string, rows: { name: string; suggested_order_qty: number; unit: string }[]) {
  const subject = encodeURIComponent(`Ordine di rifornimento - ${new Date().toLocaleDateString("it-IT")}`);
  const body = encodeURIComponent(
    `Buongiorno ${supplierName},\n\nrichiediamo il seguente rifornimento:\n\n` +
    rows.map(r => `- ${r.name}: ${r.suggested_order_qty.toFixed(2)} ${r.unit}`).join("\n") +
    `\n\nGrazie.\n`
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

/* ════════════════════ SCORTE ════════════════════ */
function StockTab({ restaurantId, items, suppliers }: { restaurantId: string; items: InventoryItem[]; suppliers: Supplier[] }) {
  const [search, setSearch] = useState("");
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || (i.sku || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Cerca articolo o SKU…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 min-w-[200px]" />
        <ItemDialog restaurantId={restaurantId} suppliers={suppliers}>
          <Button><Plus className="w-4 h-4 mr-1" />Nuovo articolo</Button>
        </ItemDialog>
      </div>

      {filtered.length === 0 && (
        <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">Nessun articolo. Aggiungine uno per iniziare.</CardContent></Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(item => (
          <ItemCard key={item.id} item={item} suppliers={suppliers} restaurantId={restaurantId} />
        ))}
      </div>
    </div>
  );
}

function ItemCard({ item, suppliers, restaurantId }: { item: InventoryItem; suppliers: Supplier[]; restaurantId: string }) {
  const supplier = suppliers.find(s => s.id === item.supplier_id);
  const low = item.stock_qty <= 0 ? "out" : item.stock_qty < item.min_qty ? "min" : item.stock_qty < item.par_qty ? "par" : "ok";
  const colorMap = { out: "destructive", min: "destructive", par: "secondary", ok: "outline" } as const;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.category}{item.sku ? ` · SKU ${item.sku}` : ""}</p>
          </div>
          <Badge variant={colorMap[low]} className="text-[10px]">
            {low === "out" ? "ESAURITO" : low === "min" ? "Sotto min" : low === "par" ? "Sotto par" : "OK"}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded bg-muted">
            <p className="text-muted-foreground">Scorta</p>
            <p className="font-bold text-base">{item.stock_qty} <span className="text-[10px] font-normal">{item.unit}</span></p>
          </div>
          <div className="p-2 rounded bg-muted">
            <p className="text-muted-foreground">Min</p>
            <p className="font-bold text-base">{item.min_qty}</p>
          </div>
          <div className="p-2 rounded bg-muted">
            <p className="text-muted-foreground">Par</p>
            <p className="font-bold text-base">{item.par_qty}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Costo: €{item.cost_per_unit.toFixed(2)}/{item.unit}</span>
          {supplier && <span className="truncate">📦 {supplier.name}</span>}
        </div>
        <div className="flex gap-2">
          <MovementDialog restaurantId={restaurantId} item={item} type="in">
            <Button size="sm" variant="default" className="flex-1"><ArrowDownToLine className="w-3 h-3 mr-1" />Carico</Button>
          </MovementDialog>
          <MovementDialog restaurantId={restaurantId} item={item} type="out">
            <Button size="sm" variant="secondary" className="flex-1"><ArrowUpFromLine className="w-3 h-3 mr-1" />Scarico</Button>
          </MovementDialog>
          <ItemDialog restaurantId={restaurantId} suppliers={suppliers} existing={item}>
            <Button size="sm" variant="outline"><Pencil className="w-3 h-3" /></Button>
          </ItemDialog>
        </div>
      </CardContent>
    </Card>
  );
}

function ItemDialog({ restaurantId, suppliers, children, existing }: { restaurantId: string; suppliers: Supplier[]; children: React.ReactNode; existing?: InventoryItem }) {
  const [open, setOpen] = useState(false);
  const upsert = useUpsertItem(restaurantId);
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    sku: existing?.sku ?? "",
    category: existing?.category ?? "Generale",
    unit: existing?.unit ?? "pz",
    supplier_id: existing?.supplier_id ?? "",
    stock_qty: existing?.stock_qty ?? 0,
    min_qty: existing?.min_qty ?? 0,
    par_qty: existing?.par_qty ?? 0,
    cost_per_unit: existing?.cost_per_unit ?? 0,
    notes: existing?.notes ?? "",
  });

  const submit = async () => {
    try {
      await upsert.mutateAsync({
        id: existing?.id,
        ...form,
        supplier_id: form.supplier_id || null,
      });
      setOpen(false);
    } catch { /* toast handled */ }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{existing ? "Modifica articolo" : "Nuovo articolo"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label>Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxLength={120} /></div>
          <div><Label>SKU</Label><Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} maxLength={60} /></div>
          <div><Label>Categoria</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} maxLength={60} /></div>
          <div><Label>Unità (pz, kg, l...)</Label><Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} maxLength={20} /></div>
          <div>
            <Label>Fornitore</Label>
            <Select value={form.supplier_id || "_none"} onValueChange={v => setForm({ ...form, supplier_id: v === "_none" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="Nessuno" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Nessuno</SelectItem>
                {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Scorta iniziale</Label><Input type="number" min={0} step="0.01" value={form.stock_qty} onChange={e => setForm({ ...form, stock_qty: Number(e.target.value) })} /></div>
          <div><Label>Min</Label><Input type="number" min={0} step="0.01" value={form.min_qty} onChange={e => setForm({ ...form, min_qty: Number(e.target.value) })} /></div>
          <div><Label>Par (riordino)</Label><Input type="number" min={0} step="0.01" value={form.par_qty} onChange={e => setForm({ ...form, par_qty: Number(e.target.value) })} /></div>
          <div className="col-span-2"><Label>Costo per unità (€)</Label><Input type="number" min={0} step="0.0001" value={form.cost_per_unit} onChange={e => setForm({ ...form, cost_per_unit: Number(e.target.value) })} /></div>
          <div className="col-span-2"><Label>Note</Label><Textarea value={form.notes ?? ""} onChange={e => setForm({ ...form, notes: e.target.value })} maxLength={500} rows={2} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={submit} disabled={upsert.isPending || !form.name.trim()}>{upsert.isPending ? "Salvataggio…" : "Salva"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MovementDialog({ restaurantId, item, type, children }: { restaurantId: string; item: InventoryItem; type: "in" | "out" | "adjust" | "waste"; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState("");
  const create = useCreateMovement(restaurantId);

  const labels = { in: "Carico di magazzino", out: "Scarico", adjust: "Aggiusta scorta", waste: "Spreco" };

  const submit = async () => {
    if (!qty || qty <= 0) return;
    try {
      await create.mutateAsync({ item_id: item.id, movement_type: type, quantity: qty, reason });
      setOpen(false); setQty(0); setReason("");
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{labels[type]} — {item.name}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Scorta attuale: <strong>{item.stock_qty} {item.unit}</strong></p>
          <div><Label>Quantità ({type === "adjust" ? "nuova scorta totale" : item.unit})</Label><Input type="number" min={0.01} step="0.01" value={qty || ""} onChange={e => setQty(Number(e.target.value))} autoFocus /></div>
          <div><Label>Motivo / note</Label><Input value={reason} onChange={e => setReason(e.target.value)} maxLength={200} placeholder={type === "waste" ? "es. scaduto" : "Opzionale"} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={submit} disabled={create.isPending || !qty}>Conferma</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════ FORNITORI ════════════════════ */
function SuppliersTab({ restaurantId, suppliers }: { restaurantId: string; suppliers: Supplier[] }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <SupplierDialog restaurantId={restaurantId}>
          <Button><Plus className="w-4 h-4 mr-1" />Nuovo fornitore</Button>
        </SupplierDialog>
      </div>
      {suppliers.length === 0 && <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Nessun fornitore registrato.</CardContent></Card>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suppliers.map(s => (
          <Card key={s.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{s.name}</p>
                  {s.contact_name && <p className="text-xs text-muted-foreground">{s.contact_name}</p>}
                </div>
                <SupplierDialog restaurantId={restaurantId} existing={s}>
                  <Button size="sm" variant="outline"><Pencil className="w-3 h-3" /></Button>
                </SupplierDialog>
              </div>
              <div className="text-xs space-y-1 text-muted-foreground">
                {s.email && <p className="flex items-center gap-1"><Mail className="w-3 h-3" />{s.email}</p>}
                {s.phone && <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</p>}
                <p>⏱ Lead time: <strong className="text-foreground">{s.lead_time_days} giorni</strong></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SupplierDialog({ restaurantId, existing, children }: { restaurantId: string; existing?: Supplier; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const upsert = useUpsertSupplier(restaurantId);
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    contact_name: existing?.contact_name ?? "",
    email: existing?.email ?? "",
    phone: existing?.phone ?? "",
    address: existing?.address ?? "",
    lead_time_days: existing?.lead_time_days ?? 2,
    notes: existing?.notes ?? "",
  });

  const submit = async () => {
    try { await upsert.mutateAsync({ id: existing?.id, ...form }); setOpen(false); } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{existing ? "Modifica fornitore" : "Nuovo fornitore"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxLength={120} /></div>
          <div><Label>Referente</Label><Input value={form.contact_name ?? ""} onChange={e => setForm({ ...form, contact_name: e.target.value })} maxLength={120} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Email</Label><Input type="email" value={form.email ?? ""} onChange={e => setForm({ ...form, email: e.target.value })} maxLength={160} /></div>
            <div><Label>Telefono</Label><Input value={form.phone ?? ""} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={40} /></div>
          </div>
          <div><Label>Indirizzo</Label><Input value={form.address ?? ""} onChange={e => setForm({ ...form, address: e.target.value })} maxLength={240} /></div>
          <div><Label>Lead time (giorni)</Label><Input type="number" min={0} max={90} value={form.lead_time_days} onChange={e => setForm({ ...form, lead_time_days: Number(e.target.value) })} /></div>
          <div><Label>Note</Label><Textarea value={form.notes ?? ""} onChange={e => setForm({ ...form, notes: e.target.value })} maxLength={500} rows={2} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={submit} disabled={upsert.isPending || !form.name.trim()}>{upsert.isPending ? "Salvataggio…" : "Salva"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════ RICETTE ════════════════════ */
function RecipesTab({ restaurantId, recipes, items }: { restaurantId: string; recipes: Recipe[]; items: InventoryItem[] }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <RecipeDialog restaurantId={restaurantId}>
          <Button><Plus className="w-4 h-4 mr-1" />Nuova ricetta</Button>
        </RecipeDialog>
      </div>
      {recipes.length === 0 && <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Nessuna ricetta. Crea una ricetta per legare ingredienti agli articoli di magazzino.</CardContent></Card>}
      <div className="space-y-3">
        {recipes.map(r => <RecipeCard key={r.id} recipe={r} items={items} restaurantId={restaurantId} />)}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, items, restaurantId }: { recipe: Recipe; items: InventoryItem[]; restaurantId: string }) {
  const ingredients = useRecipeIngredients(recipe.id);
  const addIng = useAddIngredient(restaurantId);
  const delIng = useDeleteIngredient(restaurantId);
  const [open, setOpen] = useState(false);
  const [pickItem, setPickItem] = useState("");
  const [qty, setQty] = useState(0);
  const [unit, setUnit] = useState("pz");

  const cost = (ingredients.data || []).reduce((s, ing) => {
    const it = items.find(i => i.id === ing.item_id);
    return s + (it ? it.cost_per_unit * ing.quantity : 0);
  }, 0);

  const possiblePortions = (ingredients.data || []).reduce((min, ing) => {
    const it = items.find(i => i.id === ing.item_id);
    if (!it || ing.quantity <= 0) return min;
    const portions = Math.floor((it.stock_qty / ing.quantity) * recipe.yield_qty);
    return min === null ? portions : Math.min(min, portions);
  }, null as number | null);

  const submitIng = async () => {
    if (!pickItem || !qty) return;
    try { await addIng.mutateAsync({ recipe_id: recipe.id, item_id: pickItem, quantity: qty, unit }); setPickItem(""); setQty(0); setUnit("pz"); } catch {}
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="text-base">{recipe.name}</CardTitle>
            <p className="text-xs text-muted-foreground">Resa: {recipe.yield_qty} {recipe.yield_unit} · Costo: €{cost.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <Badge variant={possiblePortions == null ? "outline" : possiblePortions > 0 ? "secondary" : "destructive"}>
              {possiblePortions == null ? "—" : `${possiblePortions} ${recipe.yield_unit} fattibili`}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {(ingredients.data || []).map(ing => {
          const it = items.find(i => i.id === ing.item_id);
          return (
            <div key={ing.id} className="flex items-center justify-between gap-2 p-2 rounded border bg-card">
              <span className="text-sm truncate">{it?.name || "?"} — {ing.quantity} {ing.unit}</span>
              <Button size="sm" variant="ghost" onClick={() => delIng.mutate({ id: ing.id, recipe_id: recipe.id })}><Trash2 className="w-3 h-3" /></Button>
            </div>
          );
        })}

        {open ? (
          <div className="p-3 rounded border bg-muted/30 space-y-2">
            <Select value={pickItem} onValueChange={setPickItem}>
              <SelectTrigger><SelectValue placeholder="Articolo…" /></SelectTrigger>
              <SelectContent>
                {items.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" min={0.01} step="0.01" placeholder="Quantità" value={qty || ""} onChange={e => setQty(Number(e.target.value))} />
              <Input placeholder="Unità" value={unit} onChange={e => setUnit(e.target.value)} maxLength={20} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setOpen(false)} className="flex-1">Annulla</Button>
              <Button size="sm" onClick={submitIng} disabled={!pickItem || !qty} className="flex-1">Aggiungi</Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="w-full"><Plus className="w-3 h-3 mr-1" />Ingrediente</Button>
        )}
      </CardContent>
    </Card>
  );
}

function RecipeDialog({ restaurantId, children }: { restaurantId: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const upsert = useUpsertRecipe(restaurantId);
  const [form, setForm] = useState({ name: "", yield_qty: 1, yield_unit: "porzione", notes: "" });

  const submit = async () => {
    try { await upsert.mutateAsync(form); setOpen(false); setForm({ name: "", yield_qty: 1, yield_unit: "porzione", notes: "" }); } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Nuova ricetta</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxLength={120} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Resa (quantità)</Label><Input type="number" min={0.1} step="0.1" value={form.yield_qty} onChange={e => setForm({ ...form, yield_qty: Number(e.target.value) })} /></div>
            <div><Label>Unità resa</Label><Input value={form.yield_unit} onChange={e => setForm({ ...form, yield_unit: e.target.value })} maxLength={20} /></div>
          </div>
          <div><Label>Note</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} maxLength={500} rows={2} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={submit} disabled={upsert.isPending || !form.name.trim()}>Salva</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
