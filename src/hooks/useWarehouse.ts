import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

export type MovementType = "in" | "out" | "adjust" | "waste";

export interface Supplier {
  id: string;
  restaurant_id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  lead_time_days: number;
  notes: string | null;
  is_active: boolean;
}

export interface InventoryItem {
  id: string;
  restaurant_id: string;
  supplier_id: string | null;
  sku: string | null;
  name: string;
  category: string;
  unit: string;
  stock_qty: number;
  min_qty: number;
  par_qty: number;
  cost_per_unit: number;
  last_restocked_at: string | null;
  is_active: boolean;
  notes: string | null;
}

export interface RestockSuggestion {
  item_id: string;
  restaurant_id: string;
  name: string;
  sku: string | null;
  category: string;
  unit: string;
  stock_qty: number;
  min_qty: number;
  par_qty: number;
  suggested_order_qty: number;
  cost_per_unit: number;
  suggested_order_cost: number;
  last_restocked_at: string | null;
  supplier_id: string | null;
  supplier_name: string | null;
  supplier_email: string | null;
  supplier_phone: string | null;
  lead_time_days: number | null;
  urgency: "out_of_stock" | "below_min" | "below_par" | "ok";
}

export interface Recipe {
  id: string;
  restaurant_id: string;
  menu_item_id: string | null;
  name: string;
  yield_qty: number;
  yield_unit: string;
  notes: string | null;
  is_active: boolean;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  item_id: string;
  quantity: number;
  unit: string;
  notes: string | null;
}

// Validation schemas
export const supplierSchema = z.object({
  name: z.string().trim().min(1, "Nome obbligatorio").max(120),
  contact_name: z.string().trim().max(120).optional().nullable(),
  email: z.string().trim().email("Email non valida").max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  address: z.string().trim().max(240).optional().or(z.literal("")),
  lead_time_days: z.coerce.number().int().min(0).max(90).default(2),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const itemSchema = z.object({
  name: z.string().trim().min(1, "Nome obbligatorio").max(120),
  sku: z.string().trim().max(60).optional().or(z.literal("")),
  category: z.string().trim().min(1).max(60).default("Generale"),
  unit: z.string().trim().min(1).max(20).default("pz"),
  supplier_id: z.string().uuid().optional().nullable(),
  stock_qty: z.coerce.number().min(0).max(1_000_000).default(0),
  min_qty: z.coerce.number().min(0).max(1_000_000).default(0),
  par_qty: z.coerce.number().min(0).max(1_000_000).default(0),
  cost_per_unit: z.coerce.number().min(0).max(1_000_000).default(0),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const movementSchema = z.object({
  movement_type: z.enum(["in", "out", "adjust", "waste"]),
  quantity: z.coerce.number().positive("Quantità deve essere > 0").max(1_000_000),
  unit_cost: z.coerce.number().min(0).max(1_000_000).optional().nullable(),
  reason: z.string().trim().max(200).optional().or(z.literal("")),
  reference: z.string().trim().max(120).optional().or(z.literal("")),
});

export function useSuppliers(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["suppliers", restaurantId],
    enabled: !!restaurantId,
    queryFn: async (): Promise<Supplier[]> => {
      const { data, error } = await supabase
        .from("suppliers" as any)
        .select("*")
        .eq("restaurant_id", restaurantId!)
        .order("name");
      if (error) throw error;
      return (data as unknown as Supplier[]) || [];
    },
  });
}

export function useInventoryItems(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["inventory_items", restaurantId],
    enabled: !!restaurantId,
    queryFn: async (): Promise<InventoryItem[]> => {
      const { data, error } = await supabase
        .from("inventory_items" as any)
        .select("*")
        .eq("restaurant_id", restaurantId!)
        .order("name");
      if (error) throw error;
      return (data as unknown as InventoryItem[]) || [];
    },
  });
}

export function useRestockSuggestions(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["restock_suggestions", restaurantId],
    enabled: !!restaurantId,
    queryFn: async (): Promise<RestockSuggestion[]> => {
      const { data, error } = await supabase
        .from("restock_suggestions" as any)
        .select("*")
        .eq("restaurant_id", restaurantId!)
        .order("urgency");
      if (error) throw error;
      return (data as unknown as RestockSuggestion[]) || [];
    },
  });
}

export function useRecipes(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["recipes", restaurantId],
    enabled: !!restaurantId,
    queryFn: async (): Promise<Recipe[]> => {
      const { data, error } = await supabase
        .from("recipes" as any)
        .select("*")
        .eq("restaurant_id", restaurantId!)
        .order("name");
      if (error) throw error;
      return (data as unknown as Recipe[]) || [];
    },
  });
}

export function useRecipeIngredients(recipeId: string | undefined) {
  return useQuery({
    queryKey: ["recipe_ingredients", recipeId],
    enabled: !!recipeId,
    queryFn: async (): Promise<RecipeIngredient[]> => {
      const { data, error } = await supabase
        .from("recipe_ingredients" as any)
        .select("*")
        .eq("recipe_id", recipeId!);
      if (error) throw error;
      return (data as unknown as RecipeIngredient[]) || [];
    },
  });
}

export function useUpsertSupplier(restaurantId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string } & z.infer<typeof supplierSchema>) => {
      if (!restaurantId) throw new Error("restaurant non disponibile");
      const parsed = supplierSchema.parse(input);
      const payload: any = { ...parsed, restaurant_id: restaurantId };
      ["email","phone","address","notes","contact_name"].forEach(k => {
        if (payload[k] === "") payload[k] = null;
      });
      if (input.id) {
        const { error } = await supabase.from("suppliers" as any).update(payload).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("suppliers" as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers", restaurantId] });
      toast({ title: "Fornitore salvato" });
    },
    onError: (e: any) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });
}

export function useUpsertItem(restaurantId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string } & z.infer<typeof itemSchema>) => {
      if (!restaurantId) throw new Error("restaurant non disponibile");
      const parsed = itemSchema.parse(input);
      const payload: any = { ...parsed, restaurant_id: restaurantId };
      if (payload.sku === "") payload.sku = null;
      if (payload.notes === "") payload.notes = null;
      if (!payload.supplier_id) payload.supplier_id = null;
      if (input.id) {
        const { error } = await supabase.from("inventory_items" as any).update(payload).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("inventory_items" as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory_items", restaurantId] });
      qc.invalidateQueries({ queryKey: ["restock_suggestions", restaurantId] });
      toast({ title: "Articolo salvato" });
    },
    onError: (e: any) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });
}

export function useCreateMovement(restaurantId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { item_id: string } & z.infer<typeof movementSchema>) => {
      if (!restaurantId) throw new Error("restaurant non disponibile");
      const parsed = movementSchema.parse(input);
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("inventory_movements" as any).insert({
        restaurant_id: restaurantId,
        item_id: input.item_id,
        movement_type: parsed.movement_type,
        quantity: parsed.quantity,
        unit_cost: parsed.unit_cost ?? null,
        reason: parsed.reason || null,
        reference: parsed.reference || null,
        performed_by: userData.user?.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory_items", restaurantId] });
      qc.invalidateQueries({ queryKey: ["restock_suggestions", restaurantId] });
      toast({ title: "Movimento registrato" });
    },
    onError: (e: any) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });
}

export function useUpsertRecipe(restaurantId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string; name: string; yield_qty: number; yield_unit: string; menu_item_id?: string | null; notes?: string | null }) => {
      if (!restaurantId) throw new Error("restaurant non disponibile");
      const payload: any = {
        restaurant_id: restaurantId,
        name: input.name.trim(),
        yield_qty: Number(input.yield_qty) || 1,
        yield_unit: input.yield_unit.trim() || "porzione",
        menu_item_id: input.menu_item_id || null,
        notes: input.notes || null,
      };
      if (input.id) {
        const { error } = await supabase.from("recipes" as any).update(payload).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("recipes" as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recipes", restaurantId] });
      toast({ title: "Ricetta salvata" });
    },
    onError: (e: any) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });
}

export function useAddIngredient(restaurantId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { recipe_id: string; item_id: string; quantity: number; unit: string }) => {
      const { error } = await supabase.from("recipe_ingredients" as any).insert({
        recipe_id: input.recipe_id,
        item_id: input.item_id,
        quantity: Number(input.quantity),
        unit: input.unit.trim() || "pz",
      });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["recipe_ingredients", vars.recipe_id] });
      toast({ title: "Ingrediente aggiunto" });
    },
    onError: (e: any) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });
}

export function useDeleteIngredient(restaurantId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; recipe_id: string }) => {
      const { error } = await supabase.from("recipe_ingredients" as any).delete().eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["recipe_ingredients", vars.recipe_id] });
    },
  });
}
