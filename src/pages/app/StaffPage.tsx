import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Briefcase, Phone, Mail, MoreHorizontal, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  full_name: string;
  role: string;
  email: string | null;
  phone: string | null;
  hourly_rate: number;
  monthly_salary: number;
  is_active: boolean;
}

export default function StaffPage() {
  const { companyId, terminology } = useIndustry();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ full_name: "", role: "staff", email: "", phone: "", hourly_rate: "0", monthly_salary: "0" });

  const fetch = async () => {
    if (!companyId) return;
    const { data } = await supabase.from("staff" as any).select("*").eq("company_id", companyId).order("created_at", { ascending: false });
    if (data) setStaff(data as unknown as StaffMember[]);
  };

  useEffect(() => { fetch(); }, [companyId]);

  const addStaff = async () => {
    if (!form.full_name.trim() || !companyId) return;
    const { error } = await supabase.from("staff" as any).insert({
      company_id: companyId,
      full_name: form.full_name,
      role: form.role,
      email: form.email || null,
      phone: form.phone || null,
      hourly_rate: parseFloat(form.hourly_rate) || 0,
      monthly_salary: parseFloat(form.monthly_salary) || 0,
    });
    if (error) { toast.error("Errore"); return; }
    toast.success("Aggiunto!");
    setShowAdd(false);
    setForm({ full_name: "", role: "staff", email: "", phone: "", hourly_rate: "0", monthly_salary: "0" });
    fetch();
  };

  const filtered = staff.filter((s) => s.full_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">{terminology.staff}</h1>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-vibrant-gradient text-white"><Plus className="w-4 h-4 mr-2" />Aggiungi</Button>
          </DialogTrigger>
          <DialogContent className="glass border-border/50">
            <DialogHeader><DialogTitle>Nuovo Membro {terminology.staff}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Nome completo *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Ruolo</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Telefono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Tariffa oraria (€)</Label><Input type="number" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })} /></div>
              </div>
              <div><Label>Stipendio mensile (€)</Label><Input type="number" value={form.monthly_salary} onChange={(e) => setForm({ ...form, monthly_salary: e.target.value })} /></div>
              <Button className="w-full bg-vibrant-gradient text-white" onClick={addStaff}>Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca..." className="pl-9 bg-secondary/50" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((s) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="glass border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCog className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{s.full_name}</p>
                        <Badge variant="secondary" className="text-xs capitalize">{s.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {s.email && <p className="flex items-center gap-2"><Mail className="w-3 h-3" />{s.email}</p>}
                    {s.phone && <p className="flex items-center gap-2"><Phone className="w-3 h-3" />{s.phone}</p>}
                    {s.monthly_salary > 0 && <p className="flex items-center gap-2"><Briefcase className="w-3 h-3" />€{s.monthly_salary.toLocaleString("it-IT")}/mese</p>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <UserCog className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Nessun membro dello staff</p>
        </div>
      )}
    </div>
  );
}
