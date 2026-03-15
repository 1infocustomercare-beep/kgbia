
-- ==========================================
-- TABELLA 1: agents (catalogo agenti)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('universal','sector-specific')),
  category VARCHAR(50) NOT NULL CHECK (category IN ('concierge','analytics','content','sales','operations','compliance')),
  description_it TEXT NOT NULL,
  icon_emoji VARCHAR(10),
  color_hex VARCHAR(7),
  sectors TEXT[] NOT NULL DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','beta','inactive')),
  capabilities TEXT[] DEFAULT '{}',
  pricing JSONB DEFAULT '{"base":0,"currency":"EUR"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABELLA 2: agent_installations
-- ==========================================
CREATE TABLE IF NOT EXISTS public.agent_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABELLA 3: agent_executions
-- ==========================================
CREATE TABLE IF NOT EXISTS public.agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  execution_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  input JSONB,
  output JSONB,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABELLA 4: agent_metrics
-- ==========================================
CREATE TABLE IF NOT EXISTS public.agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  executions_total INT DEFAULT 0,
  executions_success INT DEFAULT 0,
  avg_duration_ms INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- RLS
-- ==========================================
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;

-- agents: SELECT pubblico
CREATE POLICY "agents_public_read" ON public.agents FOR SELECT USING (true);

-- agent_installations: filtro tenant
CREATE POLICY "installations_select" ON public.agent_installations FOR SELECT TO authenticated USING (tenant_id = auth.uid());
CREATE POLICY "installations_insert" ON public.agent_installations FOR INSERT TO authenticated WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "installations_update" ON public.agent_installations FOR UPDATE TO authenticated USING (tenant_id = auth.uid());
CREATE POLICY "installations_delete" ON public.agent_installations FOR DELETE TO authenticated USING (tenant_id = auth.uid());

-- agent_executions: filtro tenant
CREATE POLICY "executions_select" ON public.agent_executions FOR SELECT TO authenticated USING (tenant_id = auth.uid());
CREATE POLICY "executions_insert" ON public.agent_executions FOR INSERT TO authenticated WITH CHECK (tenant_id = auth.uid());

-- agent_metrics: filtro tenant
CREATE POLICY "metrics_select" ON public.agent_metrics FOR SELECT TO authenticated USING (tenant_id = auth.uid());
CREATE POLICY "metrics_upsert" ON public.agent_metrics FOR INSERT TO authenticated WITH CHECK (tenant_id = auth.uid());
CREATE POLICY "metrics_update" ON public.agent_metrics FOR UPDATE TO authenticated USING (tenant_id = auth.uid());

-- Super admin override
CREATE POLICY "agents_superadmin_all" ON public.agents FOR ALL USING (public.is_super_admin());
CREATE POLICY "installations_superadmin" ON public.agent_installations FOR ALL USING (public.is_super_admin());
CREATE POLICY "executions_superadmin" ON public.agent_executions FOR ALL USING (public.is_super_admin());
CREATE POLICY "metrics_superadmin" ON public.agent_metrics FOR ALL USING (public.is_super_admin());

-- ==========================================
-- SEED 91 AGENTI
-- ==========================================
INSERT INTO public.agents (name, type, category, description_it, icon_emoji, color_hex, sectors, status, capabilities, pricing) VALUES

-- UNIVERSALI (7)
('Concierge AI', 'universal', 'concierge', 'Assistente virtuale intelligente disponibile 24/7 che gestisce richieste clienti, prenotazioni e informazioni. Risponde in tempo reale con empatia e precisione, riducendo il carico sul tuo staff e aumentando la soddisfazione del cliente.', '🤖', '#8B5CF6', ARRAY['food','ncc','beauty','healthcare','construction','retail','fitness','hospitality','beach','trades','agriturismo','cleaning','legal','accounting','garage','photography','gardening','veterinary','tattoo','childcare','education','events','logistics'], 'active', ARRAY['chat','voice','booking','faq'], '{"base":0,"currency":"EUR"}'),

('Analytics Brain', 'universal', 'analytics', 'Motore di business intelligence che analizza vendite, flussi e trend in tempo reale. Genera report predittivi e suggerimenti strategici basati sui tuoi dati, trasformando numeri grezzi in decisioni redditizie.', '🧠', '#06B6D4', ARRAY['food','ncc','beauty','healthcare','construction','retail','fitness','hospitality','beach','trades','agriturismo','cleaning','legal','accounting','garage','photography','gardening','veterinary','tattoo','childcare','education','events','logistics'], 'active', ARRAY['dashboard','predictions','reports','kpi'], '{"base":29,"currency":"EUR"}'),

('Social Manager', 'universal', 'content', 'Crea contenuti professionali per Instagram, Facebook e TikTok con un click. Genera caption persuasive, programma pubblicazioni e analizza engagement per massimizzare la tua visibilità online senza sforzo.', '📱', '#EC4899', ARRAY['food','ncc','beauty','healthcare','construction','retail','fitness','hospitality','beach','trades','agriturismo','cleaning','legal','accounting','garage','photography','gardening','veterinary','tattoo','childcare','education','events','logistics'], 'active', ARRAY['post-generation','scheduling','hashtags','analytics'], '{"base":19,"currency":"EUR"}'),

('Sales Closer', 'universal', 'sales', 'Agente di vendita AI che qualifica lead, gestisce follow-up automatici e chiude trattative con script persuasivi personalizzati. Aumenta il tasso di conversione medio del 40% grazie a tecniche di neuromarketing integrate.', '🎯', '#10B981', ARRAY['food','ncc','beauty','healthcare','construction','retail','fitness','hospitality','beach','trades','agriturismo','cleaning','legal','accounting','garage','photography','gardening','veterinary','tattoo','childcare','education','events','logistics'], 'active', ARRAY['lead-scoring','follow-up','scripts','pipeline'], '{"base":39,"currency":"EUR"}'),

('Document AI', 'universal', 'operations', 'Digitalizza, classifica e gestisce documenti automaticamente con OCR avanzato. Estrae dati da fatture, contratti e moduli, eliminando l''inserimento manuale e riducendo errori del 95%.', '📄', '#F59E0B', ARRAY['food','ncc','beauty','healthcare','construction','retail','fitness','hospitality','beach','trades','agriturismo','cleaning','legal','accounting','garage','photography','gardening','veterinary','tattoo','childcare','education','events','logistics'], 'active', ARRAY['ocr','classification','extraction','archive'], '{"base":15,"currency":"EUR"}'),

('Smart Notifier', 'universal', 'operations', 'Sistema di notifiche intelligenti multicanale che invia avvisi personalizzati via WhatsApp, email e push. Automatizza promemoria appuntamenti, conferme ordini e campagne di re-engagement con timing ottimale.', '🔔', '#EF4444', ARRAY['food','ncc','beauty','healthcare','construction','retail','fitness','hospitality','beach','trades','agriturismo','cleaning','legal','accounting','garage','photography','gardening','veterinary','tattoo','childcare','education','events','logistics'], 'active', ARRAY['whatsapp','email','push','scheduling'], '{"base":0,"currency":"EUR"}'),

('Compliance Guardian', 'universal', 'compliance', 'Monitora normative GDPR, HACCP, sicurezza e fiscali in tempo reale. Ti avvisa di scadenze, genera documentazione conforme e mantiene il tuo business sempre in regola con audit trail completo.', '🛡️', '#6366F1', ARRAY['food','ncc','beauty','healthcare','construction','retail','fitness','hospitality','beach','trades','agriturismo','cleaning','legal','accounting','garage','photography','gardening','veterinary','tattoo','childcare','education','events','logistics'], 'active', ARRAY['gdpr','audit','alerts','documentation'], '{"base":25,"currency":"EUR"}'),

-- FOOD (6)
('KDS AI', 'sector-specific', 'operations', 'Kitchen Display System intelligente che ottimizza i tempi di preparazione e la sequenza ordini in cucina. Gestisce priorità automatiche, allergeni e tempi di cottura per servire piatti perfetti ogni volta.', '👨‍🍳', '#FF6B35', ARRAY['food'], 'active', ARRAY['order-queue','timing','allergens','prep-sequence'], '{"base":25,"currency":"EUR"}'),

('Smart Reservation', 'sector-specific', 'concierge', 'Gestisce prenotazioni tavoli con AI predittiva che ottimizza la capienza e riduce i no-show del 60%. Conferma automatica via WhatsApp, lista d''attesa intelligente e gestione eventi speciali integrata.', '📅', '#4CAF50', ARRAY['food'], 'active', ARRAY['booking','waitlist','confirmation','no-show-prevention'], '{"base":20,"currency":"EUR"}'),

('Food Cost Optimizer', 'sector-specific', 'analytics', 'Analizza costi ingredienti, margini per piatto e sprechi alimentari in tempo reale. Suggerisce ottimizzazioni menu basate su profittabilità e stagionalità, aumentando il margine operativo fino al 15%.', '💰', '#FF9800', ARRAY['food'], 'active', ARRAY['cost-analysis','margin-optimization','waste-tracking','supplier-comparison'], '{"base":22,"currency":"EUR"}'),

('Menu Analyzer', 'sector-specific', 'analytics', 'Studia le performance di ogni piatto del menu analizzando vendite, margini e popolarità. Identifica i piatti star, i cavalli di battaglia e quelli da ripensare con la matrice BCG applicata alla ristorazione.', '📊', '#9C27B0', ARRAY['food'], 'active', ARRAY['bcg-matrix','sales-analysis','popularity','recommendations'], '{"base":18,"currency":"EUR"}'),

('Waste Tracker', 'sector-specific', 'compliance', 'Monitora e registra gli sprechi alimentari in conformità HACCP. Genera report dettagliati, identifica pattern di spreco e suggerisce ordini ottimizzati per ridurre le perdite e rispettare le normative ambientali.', '♻️', '#4CAF50', ARRAY['food'], 'active', ARRAY['waste-logging','haccp-compliance','reports','optimization'], '{"base":15,"currency":"EUR"}'),

('QR Menu', 'sector-specific', 'content', 'Menu digitale interattivo con QR code personalizzato, foto HD dei piatti e traduzioni automatiche in 30 lingue. Aggiornamenti in tempo reale di prezzi e disponibilità senza ristampare nulla.', '📲', '#2196F3', ARRAY['food'], 'beta', ARRAY['qr-generation','multilingual','photo-menu','realtime-updates'], '{"base":12,"currency":"EUR"}'),

-- NCC (5)
('Fleet Optimizer', 'sector-specific', 'operations', 'Ottimizza l''utilizzo della flotta veicoli analizzando percorsi, disponibilità e manutenzioni. Riduce i tempi morti del 35% e massimizza il revenue per veicolo con assegnazioni intelligenti automatiche.', '🚗', '#1E3A5F', ARRAY['ncc'], 'active', ARRAY['fleet-management','scheduling','maintenance','utilization'], '{"base":30,"currency":"EUR"}'),

('Dynamic Pricing', 'sector-specific', 'analytics', 'Calcola tariffe ottimali in tempo reale basandosi su domanda, stagionalità, distanza e concorrenza. Massimizza i ricavi nei periodi di picco e mantiene competitività nei momenti di bassa domanda.', '💹', '#00BCD4', ARRAY['ncc'], 'active', ARRAY['surge-pricing','demand-analysis','competitor-monitoring','revenue-optimization'], '{"base":28,"currency":"EUR"}'),

('Route Planner', 'sector-specific', 'operations', 'Pianifica percorsi ottimali considerando traffico in tempo reale, pedaggi e preferenze cliente. Calcola tempi di arrivo precisi e suggerisce soste strategiche per un servizio premium impeccabile.', '🗺️', '#607D8B', ARRAY['ncc'], 'active', ARRAY['route-optimization','traffic','eta','toll-calculation'], '{"base":15,"currency":"EUR"}'),

('Airport Monitor', 'sector-specific', 'operations', 'Monitora voli in tempo reale per anticipare ritardi e cancellazioni. Aggiorna automaticamente gli orari di pickup, notifica l''autista e informa il cliente, eliminando attese inutili e garantendo puntualità assoluta.', '✈️', '#FF5722', ARRAY['ncc'], 'active', ARRAY['flight-tracking','delay-alerts','auto-reschedule','passenger-notification'], '{"base":18,"currency":"EUR"}'),

('Passenger App', 'sector-specific', 'concierge', 'App dedicata ai passeggeri con tracking in tempo reale del veicolo, chat con autista e pagamento digitale integrato. Offre un''esperienza premium che fidelizza il cliente e aumenta le recensioni positive.', '📍', '#3F51B5', ARRAY['ncc'], 'beta', ARRAY['live-tracking','in-app-chat','digital-payment','rating'], '{"base":20,"currency":"EUR"}'),

-- BEAUTY (6)
('Smart Booking', 'sector-specific', 'concierge', 'Sistema di prenotazione intelligente per saloni che gestisce disponibilità operatori, durata trattamenti e pause tecniche. Riduce buchi in agenda del 45% con suggerimenti di slot ottimali ai clienti.', '💅', '#E91E63', ARRAY['beauty'], 'active', ARRAY['operator-matching','gap-filling','duration-calc','reminders'], '{"base":22,"currency":"EUR"}'),

('Skin Analyzer', 'sector-specific', 'analytics', 'Analisi avanzata della pelle tramite foto AI che identifica tipo di pelle, problematiche e suggerisce trattamenti personalizzati. Crea un percorso beauty su misura che aumenta lo scontrino medio del 30%.', '🔬', '#9C27B0', ARRAY['beauty'], 'active', ARRAY['photo-analysis','skin-type','treatment-plan','product-matching'], '{"base":35,"currency":"EUR"}'),

('Product Recommender', 'sector-specific', 'sales', 'Suggerisce prodotti e trattamenti personalizzati basandosi sullo storico cliente, tipo di pelle e stagionalità. Genera upselling naturale e aumenta il valore medio per cliente con raccomandazioni mirate.', '🧴', '#FF4081', ARRAY['beauty'], 'active', ARRAY['cross-sell','upsell','client-history','seasonal-recommendations'], '{"base":15,"currency":"EUR"}'),

('Commission Calc', 'sector-specific', 'operations', 'Calcola automaticamente commissioni e bonus per ogni operatore basandosi su servizi erogati, prodotti venduti e obiettivi raggiunti. Genera report trasparenti che motivano il team e semplificano la busta paga.', '💵', '#4CAF50', ARRAY['beauty'], 'active', ARRAY['commission-tracking','bonus-calculation','goal-monitoring','payroll-export'], '{"base":12,"currency":"EUR"}'),

('Loyalty Gamification', 'sector-specific', 'sales', 'Programma fedeltà gamificato con punti, livelli e premi esclusivi che trasforma clienti occasionali in habitué. Aumenta la frequenza di visita del 40% con sfide personalizzate e ricompense irresistibili.', '🎮', '#FF9800', ARRAY['beauty'], 'active', ARRAY['points-system','levels','rewards','challenges'], '{"base":18,"currency":"EUR"}'),

('Virtual Try-On', 'sector-specific', 'content', 'Prova virtuale di acconciature, colori capelli e makeup tramite realtà aumentata. Il cliente vede il risultato prima del trattamento, riducendo insoddisfazioni e aumentando la fiducia nella scelta.', '🪞', '#E040FB', ARRAY['beauty'], 'beta', ARRAY['ar-preview','hairstyle-simulation','color-preview','before-after'], '{"base":28,"currency":"EUR"}'),

-- HEALTHCARE (5)
('AI Triage', 'sector-specific', 'concierge', 'Sistema di triage intelligente che valuta sintomi e urgenza prima della visita. Ottimizza i tempi di attesa, indirizza il paziente al reparto corretto e prepara il medico con un pre-screening dettagliato.', '🏥', '#F44336', ARRAY['healthcare'], 'active', ARRAY['symptom-assessment','urgency-scoring','department-routing','pre-screening'], '{"base":35,"currency":"EUR"}'),

('Prescription Manager', 'sector-specific', 'operations', 'Gestisce prescrizioni mediche con controllo interazioni farmacologiche, dosaggi e rinnovi automatici. Invia promemoria ai pazienti per l''assunzione farmaci e segnala potenziali controindicazioni al medico.', '💊', '#2196F3', ARRAY['healthcare'], 'active', ARRAY['drug-interactions','dosage-check','auto-renewal','patient-reminders'], '{"base":25,"currency":"EUR"}'),

('Lab Integrator', 'sector-specific', 'operations', 'Integra risultati di laboratorio direttamente nella cartella paziente con interpretazione AI dei valori. Evidenzia anomalie, confronta trend storici e genera alert per il medico su valori critici.', '🧪', '#00BCD4', ARRAY['healthcare'], 'active', ARRAY['lab-import','value-interpretation','trend-analysis','critical-alerts'], '{"base":30,"currency":"EUR"}'),

('Telemedicine', 'sector-specific', 'concierge', 'Piattaforma di telemedicina integrata con videoconsulto HD, condivisione documenti e prescrizione digitale. Permette visite a distanza sicure e conformi GDPR con registrazione automatica nella cartella clinica.', '📹', '#4CAF50', ARRAY['healthcare'], 'active', ARRAY['video-consult','document-sharing','e-prescription','ehr-integration'], '{"base":28,"currency":"EUR"}'),

('EHR Assistant', 'sector-specific', 'operations', 'Assistente per cartelle cliniche elettroniche che compila automaticamente anamnesi, referti e note cliniche tramite dettatura vocale. Riduce il tempo di documentazione del 60% mantenendo accuratezza medica.', '📋', '#795548', ARRAY['healthcare'], 'beta', ARRAY['voice-dictation','auto-fill','clinical-notes','template-library'], '{"base":32,"currency":"EUR"}'),

-- CONSTRUCTION (6)
('Project Timeline', 'sector-specific', 'operations', 'Gestisce cronoprogrammi di cantiere con Gantt interattivo, dipendenze tra attività e allocazione risorse. Prevede ritardi con AI predittiva e suggerisce azioni correttive per consegnare in tempo.', '🏗️', '#795548', ARRAY['construction'], 'active', ARRAY['gantt-chart','resource-allocation','delay-prediction','milestone-tracking'], '{"base":35,"currency":"EUR"}'),

('Safety Inspector', 'sector-specific', 'compliance', 'Monitora la sicurezza in cantiere con checklist digitali, ispezioni programmate e segnalazione incidenti. Genera documentazione conforme D.Lgs 81/08 e mantiene il DVR sempre aggiornato automaticamente.', '⚠️', '#FF9800', ARRAY['construction'], 'active', ARRAY['safety-checklists','incident-reporting','dvr-management','compliance-audit'], '{"base":28,"currency":"EUR"}'),

('Material Cost', 'sector-specific', 'analytics', 'Analizza e confronta prezzi materiali da diversi fornitori in tempo reale. Ottimizza gli ordini basandosi su storico prezzi, previsioni di mercato e quantità necessarie per ridurre i costi fino al 20%.', '🧱', '#607D8B', ARRAY['construction'], 'active', ARRAY['price-comparison','supplier-analysis','order-optimization','market-forecast'], '{"base":25,"currency":"EUR"}'),

('Weather Planner', 'sector-specific', 'operations', 'Integra previsioni meteo a 14 giorni nella pianificazione cantiere. Suggerisce automaticamente riorganizzazione attività in base a pioggia, vento e temperature, minimizzando giorni di fermo.', '🌤️', '#03A9F4', ARRAY['construction'], 'active', ARRAY['weather-forecast','activity-rescheduling','downtime-prevention','seasonal-planning'], '{"base":12,"currency":"EUR"}'),

('Site Photo', 'sector-specific', 'content', 'Documenta l''avanzamento cantiere con foto georeferenziate e timestamp certificato. Genera report fotografici automatici per committenti e direzione lavori con confronto prima/dopo integrato.', '📸', '#9E9E9E', ARRAY['construction'], 'active', ARRAY['geo-photo','progress-reports','before-after','client-sharing'], '{"base":15,"currency":"EUR"}'),

('Subcontractor Manager', 'sector-specific', 'operations', 'Gestisce subappaltatori con contratti digitali, monitoraggio avanzamento lavori e valutazione performance. Traccia ore, materiali e conformità documentale per ogni ditta coinvolta nel progetto.', '🤝', '#455A64', ARRAY['construction'], 'beta', ARRAY['contract-management','progress-tracking','performance-rating','compliance-docs'], '{"base":22,"currency":"EUR"}'),

-- RETAIL (4)
('Inventory AI', 'sector-specific', 'operations', 'Gestione inventario intelligente con previsione domanda, riordino automatico e alert scorte minime. Analizza stagionalità e trend vendite per ottimizzare il magazzino e ridurre overstock del 30%.', '📦', '#FF5722', ARRAY['retail'], 'active', ARRAY['demand-forecast','auto-reorder','stock-alerts','seasonal-analysis'], '{"base":25,"currency":"EUR"}'),

('Customer 360', 'sector-specific', 'analytics', 'Profilo cliente completo che unifica acquisti, preferenze e interazioni in un''unica vista. Segmenta automaticamente la clientela e suggerisce azioni personalizzate per massimizzare il lifetime value.', '👤', '#3F51B5', ARRAY['retail'], 'active', ARRAY['customer-profile','segmentation','purchase-history','ltv-prediction'], '{"base":22,"currency":"EUR"}'),

('Price Matcher', 'sector-specific', 'analytics', 'Monitora prezzi della concorrenza online e offline in tempo reale. Suggerisce strategie di pricing dinamico per mantenere competitività e margini, con alert automatici su variazioni significative del mercato.', '🏷️', '#4CAF50', ARRAY['retail'], 'active', ARRAY['competitor-monitoring','dynamic-pricing','margin-analysis','price-alerts'], '{"base":20,"currency":"EUR"}'),

('Visual Merchandiser', 'sector-specific', 'content', 'Suggerisce layout espositivi ottimali basandosi su dati di vendita, stagionalità e psicologia del consumatore. Genera planogrammi digitali e monitora l''impatto visivo sulle conversioni in negozio.', '🎨', '#E91E63', ARRAY['retail'], 'beta', ARRAY['planogram','layout-optimization','conversion-tracking','seasonal-displays'], '{"base":18,"currency":"EUR"}'),

-- FITNESS (4)
('Workout Planner', 'sector-specific', 'operations', 'Crea programmi di allenamento personalizzati basati su obiettivi, livello fitness e attrezzatura disponibile. Si adatta ai progressi del cliente e suggerisce variazioni per mantenere motivazione e risultati.', '🏋️', '#FF5722', ARRAY['fitness'], 'active', ARRAY['program-design','progress-tracking','adaptation','exercise-library'], '{"base":22,"currency":"EUR"}'),

('Nutrition Advisor', 'sector-specific', 'operations', 'Piano alimentare personalizzato che si integra con il programma di allenamento. Calcola macro e micro nutrienti, suggerisce pasti e monitora l''aderenza al piano con report settimanali motivazionali.', '🥗', '#4CAF50', ARRAY['fitness'], 'active', ARRAY['meal-planning','macro-tracking','diet-adaptation','weekly-reports'], '{"base":20,"currency":"EUR"}'),

('Class Optimizer', 'sector-specific', 'analytics', 'Analizza frequenza, popolarità e redditività di ogni corso fitness. Ottimizza orari e capienza basandosi su dati storici e preferenze membri per massimizzare partecipazione e ricavi.', '📊', '#2196F3', ARRAY['fitness'], 'active', ARRAY['attendance-analysis','schedule-optimization','revenue-per-class','member-preferences'], '{"base":15,"currency":"EUR"}'),

('Member Retention', 'sector-specific', 'sales', 'Identifica membri a rischio abbandono con AI predittiva e attiva campagne di retention automatiche. Analizza pattern di frequenza, engagement e soddisfazione per intervenire prima che il cliente se ne vada.', '💪', '#9C27B0', ARRAY['fitness'], 'active', ARRAY['churn-prediction','retention-campaigns','engagement-scoring','win-back'], '{"base":18,"currency":"EUR"}'),

-- HOSPITALITY (4)
('Revenue Manager', 'sector-specific', 'analytics', 'Ottimizza tariffe camere con algoritmi di revenue management che analizzano occupazione, domanda stagionale e prezzi competitor. Massimizza il RevPAR con pricing dinamico automatico e previsioni accurate.', '🏨', '#1E88E5', ARRAY['hospitality'], 'active', ARRAY['dynamic-pricing','occupancy-forecast','competitor-analysis','revpar-optimization'], '{"base":35,"currency":"EUR"}'),

('Guest Experience', 'sector-specific', 'concierge', 'Gestisce l''esperienza ospite dal check-in al check-out con comunicazioni personalizzate. Anticipa esigenze, gestisce richieste speciali e raccoglie feedback in tempo reale per un servizio a 5 stelle.', '⭐', '#FFD700', ARRAY['hospitality'], 'active', ARRAY['digital-checkin','guest-preferences','request-management','feedback-collection'], '{"base":25,"currency":"EUR"}'),

('Housekeeping AI', 'sector-specific', 'operations', 'Ottimizza le operazioni di pulizia con assegnazioni intelligenti basate su check-out, priorità e disponibilità staff. Traccia stato camere in tempo reale e gestisce inventario amenities automaticamente.', '🧹', '#78909C', ARRAY['hospitality'], 'active', ARRAY['room-assignment','priority-queue','supply-tracking','quality-inspection'], '{"base":18,"currency":"EUR"}'),

('Concierge Plus', 'sector-specific', 'concierge', 'Concierge digitale premium che gestisce prenotazioni ristoranti, tour, transfer e esperienze esclusive per gli ospiti. Integra partner locali e genera ricavi accessori con commissioni automatiche.', '🔑', '#6D4C41', ARRAY['hospitality'], 'beta', ARRAY['restaurant-booking','tour-booking','transfer-arrangement','experience-curation'], '{"base":30,"currency":"EUR"}'),

-- BEACH (3)
('Beach Map AI', 'sector-specific', 'operations', 'Mappa interattiva dello stabilimento con gestione ombrelloni, lettini e aree in tempo reale. Prenotazione online con scelta posizione, gestione stagionali e abbonamenti con vista occupazione live.', '🏖️', '#00BCD4', ARRAY['beach'], 'active', ARRAY['interactive-map','online-booking','seasonal-passes','occupancy-view'], '{"base":22,"currency":"EUR"}'),

('Bar Service AI', 'sector-specific', 'operations', 'Ordini dal lettino tramite app con consegna tracciata. Gestisce menu bar dello stabilimento, pagamenti digitali e comande cucina con notifiche automatiche quando l''ordine è pronto.', '🍹', '#FF9800', ARRAY['beach'], 'active', ARRAY['beachside-ordering','delivery-tracking','digital-payment','kitchen-integration'], '{"base":15,"currency":"EUR"}'),

('Meteo Beach', 'sector-specific', 'operations', 'Previsioni meteo marine specializzate con indice UV, temperatura acqua, vento e stato mare. Avvisa i clienti prenotati in caso di maltempo e suggerisce riprogrammazione automatica della giornata.', '🌊', '#0288D1', ARRAY['beach'], 'active', ARRAY['marine-forecast','uv-index','wave-conditions','auto-reschedule'], '{"base":10,"currency":"EUR"}'),

-- TRADES (3)
('Field Dispatch', 'sector-specific', 'operations', 'Gestisce interventi sul campo con assegnazione automatica tecnici basata su competenze, posizione e disponibilità. Traccia spostamenti, tempi di intervento e genera rapportini digitali firmabili.', '🔧', '#455A64', ARRAY['trades'], 'active', ARRAY['technician-matching','gps-tracking','digital-reports','signature-capture'], '{"base":20,"currency":"EUR"}'),

('Smart Estimate', 'sector-specific', 'sales', 'Genera preventivi professionali in pochi minuti basandosi su catalogo servizi, materiali e tempo stimato. Include foto sopralluogo, condizioni contrattuali e accettazione digitale con firma elettronica.', '📝', '#FF9800', ARRAY['trades'], 'active', ARRAY['quote-builder','material-catalog','digital-signature','photo-attachment'], '{"base":18,"currency":"EUR"}'),

('Maintenance Recall', 'sector-specific', 'sales', 'Programma e automatizza richiami per manutenzioni periodiche (caldaie, condizionatori, impianti). Invia promemoria ai clienti, gestisce lo scheduling e genera ricavi ricorrenti prevedibili.', '🔔', '#4CAF50', ARRAY['trades'], 'active', ARRAY['maintenance-scheduling','auto-reminders','recurring-revenue','service-history'], '{"base":12,"currency":"EUR"}'),

-- AGRITURISMO (3)
('Farm Experience', 'sector-specific', 'concierge', 'Gestisce esperienze agrituristiche come degustazioni, visite guidate e laboratori didattici. Prenotazione online, gestione gruppi e creazione pacchetti personalizzati per massimizzare l''esperienza rurale.', '🌾', '#8BC34A', ARRAY['agriturismo'], 'active', ARRAY['experience-booking','group-management','package-builder','seasonal-activities'], '{"base":20,"currency":"EUR"}'),

('Local Product', 'sector-specific', 'sales', 'Vetrina e-commerce per prodotti tipici dell''agriturismo con spedizione tracciata. Gestisce catalogo, ordini online e abbonamenti box mensili per fidelizzare clienti anche dopo la visita.', '🧀', '#FF9800', ARRAY['agriturismo'], 'active', ARRAY['product-catalog','e-commerce','subscription-boxes','shipping-tracking'], '{"base":15,"currency":"EUR"}'),

('Seasonal Planner', 'sector-specific', 'operations', 'Pianifica attività agricole e turistiche in base a stagionalità, meteo e calendario eventi locali. Ottimizza la rotazione colture e sincronizza offerta turistica con i ritmi naturali dell''azienda.', '📆', '#689F38', ARRAY['agriturismo'], 'active', ARRAY['seasonal-calendar','crop-rotation','event-sync','weather-integration'], '{"base":12,"currency":"EUR"}'),

-- CLEANING (3)
('Route Optimizer Clean', 'sector-specific', 'operations', 'Ottimizza i percorsi delle squadre di pulizia minimizzando spostamenti e massimizzando il numero di interventi giornalieri. Gestisce urgenze con riassegnazione dinamica e tracking GPS in tempo reale.', '🧽', '#00BCD4', ARRAY['cleaning'], 'active', ARRAY['route-planning','team-assignment','gps-tracking','emergency-dispatch'], '{"base":18,"currency":"EUR"}'),

('Quality Check Clean', 'sector-specific', 'compliance', 'Checklist di qualità digitali con foto verifica per ogni intervento di pulizia. Genera report per il cliente, monitora standard qualitativi e gestisce reclami con workflow strutturato e tracciabile.', '✅', '#4CAF50', ARRAY['cleaning'], 'active', ARRAY['quality-checklists','photo-verification','client-reports','complaint-management'], '{"base":15,"currency":"EUR"}'),

('Contract Manager Clean', 'sector-specific', 'operations', 'Gestisce contratti di pulizia con rinnovi automatici, fatturazione periodica e monitoraggio margini per cliente. Traccia ore effettive vs preventivate e genera alert su contratti in scadenza.', '📃', '#607D8B', ARRAY['cleaning'], 'active', ARRAY['contract-lifecycle','auto-billing','margin-tracking','renewal-alerts'], '{"base":12,"currency":"EUR"}'),

-- LEGAL (3)
('Case Manager', 'sector-specific', 'operations', 'Gestisce pratiche legali con timeline, scadenze e documenti associati in un''unica interfaccia. Traccia ore fatturabili, genera timesheet automatici e monitora lo stato di ogni causa con dashboard dedicata.', '⚖️', '#5D4037', ARRAY['legal'], 'active', ARRAY['case-tracking','deadline-management','time-billing','document-association'], '{"base":30,"currency":"EUR"}'),

('Legal Document AI', 'sector-specific', 'content', 'Genera bozze di documenti legali (contratti, diffide, pareri) partendo da template personalizzabili. Analizza clausole con AI, suggerisce modifiche e mantiene un archivio strutturato di precedenti.', '📜', '#795548', ARRAY['legal'], 'active', ARRAY['document-drafting','clause-analysis','template-library','precedent-search'], '{"base":25,"currency":"EUR"}'),

('Deadline Sentinel', 'sector-specific', 'compliance', 'Monitora tutte le scadenze processuali, fiscali e contrattuali con alert multilivello. Mai più un termine perso: notifica anticipata a 30, 15, 7 e 1 giorno con escalation automatica al responsabile.', '⏰', '#F44336', ARRAY['legal'], 'active', ARRAY['deadline-tracking','multi-level-alerts','escalation','calendar-sync'], '{"base":15,"currency":"EUR"}'),

-- ACCOUNTING (3)
('Tax Calendar', 'sector-specific', 'compliance', 'Calendario fiscale italiano completo e sempre aggiornato con tutte le scadenze IVA, IRPEF, INPS e camerali. Genera promemoria personalizzati per ogni cliente e traccia adempienze completate.', '🗓️', '#1E88E5', ARRAY['accounting'], 'active', ARRAY['tax-deadlines','client-reminders','compliance-tracking','regulatory-updates'], '{"base":25,"currency":"EUR"}'),

('Doc Collector', 'sector-specific', 'operations', 'Raccoglie automaticamente fatture e documenti dai clienti via email, WhatsApp o upload diretto. Classifica con OCR, verifica completezza e segnala documenti mancanti per chiusure contabili puntuali.', '📥', '#FF9800', ARRAY['accounting'], 'active', ARRAY['auto-collection','ocr-classification','completeness-check','missing-doc-alerts'], '{"base":18,"currency":"EUR"}'),

('F24 Generator', 'sector-specific', 'operations', 'Genera modelli F24 precompilati basandosi sui dati contabili del cliente. Calcola automaticamente imposte, contributi e ritenute con verifica incrociata per eliminare errori di compilazione.', '🧾', '#4CAF50', ARRAY['accounting'], 'active', ARRAY['f24-generation','tax-calculation','cross-verification','batch-processing'], '{"base":20,"currency":"EUR"}'),

-- GARAGE (3)
('Vehicle Tracker', 'sector-specific', 'operations', 'Gestisce lo storico completo di ogni veicolo: interventi, ricambi, chilometraggio e scadenze revisioni/assicurazioni. Invia promemoria automatici ai clienti per tagliandi e controlli programmati.', '🔩', '#455A64', ARRAY['garage'], 'active', ARRAY['vehicle-history','parts-tracking','mileage-log','service-reminders'], '{"base":18,"currency":"EUR"}'),

('Parts Finder', 'sector-specific', 'operations', 'Cerca e confronta ricambi auto da più fornitori in tempo reale. Identifica il pezzo corretto tramite numero telaio, confronta prezzi e disponibilità e ordina direttamente con consegna tracciata.', '🔍', '#FF5722', ARRAY['garage'], 'active', ARRAY['vin-lookup','price-comparison','availability-check','direct-ordering'], '{"base":15,"currency":"EUR"}'),

('Repair Estimator', 'sector-specific', 'sales', 'Genera preventivi dettagliati per riparazioni auto con voci manodopera, ricambi e tempario. Include foto del danno, accettazione digitale del cliente e gestione autorizzazioni per lavori aggiuntivi.', '🛠️', '#9E9E9E', ARRAY['garage'], 'active', ARRAY['quote-generation','labor-time','photo-documentation','digital-approval'], '{"base":15,"currency":"EUR"}'),

-- PHOTOGRAPHY (3)
('Booking Photo', 'sector-specific', 'concierge', 'Gestisce prenotazioni servizi fotografici con calendario condiviso, brief online e contratto digitale. Il cliente sceglie pacchetto, location e stile desiderato con anteprima portfolio integrata.', '📷', '#9C27B0', ARRAY['photography'], 'active', ARRAY['session-booking','brief-collection','contract-signing','portfolio-preview'], '{"base":18,"currency":"EUR"}'),

('Gallery Delivery', 'sector-specific', 'operations', 'Consegna gallerie fotografiche private ai clienti con watermark, selezione preferiti e download in alta risoluzione. Gestisce revisioni, stampe e album con workflow automatizzato e professionale.', '🖼️', '#E91E63', ARRAY['photography'], 'active', ARRAY['private-gallery','watermark','selection-tools','print-ordering'], '{"base":15,"currency":"EUR"}'),

('Portfolio Curator', 'sector-specific', 'content', 'Cura e aggiorna automaticamente il portfolio online selezionando gli scatti migliori con AI. Ottimizza SEO delle immagini, genera descrizioni e organizza per categoria per attirare nuovi clienti.', '🎞️', '#FF4081', ARRAY['photography'], 'beta', ARRAY['auto-curation','seo-optimization','category-management','best-shot-selection'], '{"base":12,"currency":"EUR"}'),

-- GARDENING (2)
('Seasonal Garden', 'sector-specific', 'operations', 'Pianifica interventi di giardinaggio in base a stagione, tipo di piante e condizioni meteo locali. Genera calendario manutenzioni annuale, gestisce squadre e traccia lavori completati per ogni cliente.', '🌿', '#4CAF50', ARRAY['gardening'], 'active', ARRAY['seasonal-planning','plant-database','crew-management','work-logging'], '{"base":15,"currency":"EUR"}'),

('Plant Care AI', 'sector-specific', 'concierge', 'Identifica piante da foto, diagnostica malattie e parassiti con AI visiva. Suggerisce trattamenti, irrigazione ottimale e concimazione basandosi su specie, clima locale e stagione corrente.', '🌱', '#8BC34A', ARRAY['gardening'], 'active', ARRAY['plant-identification','disease-diagnosis','treatment-suggestions','watering-schedule'], '{"base":12,"currency":"EUR"}'),

-- VETERINARY (3)
('Pet Health', 'sector-specific', 'operations', 'Cartella clinica digitale per animali con storico visite, vaccinazioni, esami e terapie. Genera promemoria per richiami vaccinali e controlli periodici, mantenendo il pet sempre in salute.', '🐾', '#795548', ARRAY['veterinary'], 'active', ARRAY['medical-records','vaccination-tracking','exam-history','health-reminders'], '{"base":20,"currency":"EUR"}'),

('Vet Prescription', 'sector-specific', 'operations', 'Gestisce prescrizioni veterinarie con ricetta elettronica, dosaggi per peso/specie e controllo interazioni farmacologiche. Integra il registro dei farmaci veterinari e genera documentazione conforme.', '💉', '#F44336', ARRAY['veterinary'], 'active', ARRAY['e-prescription','dosage-calculator','drug-interactions','regulatory-compliance'], '{"base":18,"currency":"EUR"}'),

('Breed Advisor', 'sector-specific', 'concierge', 'Guida informativa su razze con caratteristiche, esigenze nutrizionali e predisposizioni genetiche. Aiuta i proprietari a comprendere meglio il proprio animale e supporta il veterinario nella comunicazione.', '🐕', '#8D6E63', ARRAY['veterinary'], 'beta', ARRAY['breed-database','genetic-predispositions','nutrition-guide','owner-education'], '{"base":12,"currency":"EUR"}'),

-- TATTOO (3)
('Tattoo Booking', 'sector-specific', 'concierge', 'Gestisce appuntamenti tattoo con brief dettagliato, upload reference images e deposito cauzionale online. Calcola durata stimata in base a dimensione e complessità del design richiesto.', '🎨', '#212121', ARRAY['tattoo'], 'active', ARRAY['appointment-booking','brief-collection','deposit-payment','duration-estimate'], '{"base":18,"currency":"EUR"}'),

('Aftercare AI', 'sector-specific', 'operations', 'Programma di aftercare personalizzato post-tattoo con notifiche per cura della pelle, foto di controllo guarigione e consigli stagionali. Riduce complicazioni e aumenta la soddisfazione del cliente.', '🩹', '#E91E63', ARRAY['tattoo'], 'active', ARRAY['aftercare-schedule','healing-tracking','photo-checkups','seasonal-tips'], '{"base":10,"currency":"EUR"}'),

('Design Portfolio Tattoo', 'sector-specific', 'content', 'Portfolio digitale organizzato per stile (realistico, traditional, blackwork, watercolor) con galleria interattiva. I clienti navigano, salvano preferiti e condividono idee direttamente col tatuatore.', '🖌️', '#9C27B0', ARRAY['tattoo'], 'active', ARRAY['style-gallery','favorites','sharing','style-filtering'], '{"base":15,"currency":"EUR"}'),

-- CHILDCARE (3)
('Daily Diary', 'sector-specific', 'content', 'Diario digitale giornaliero per asili e centri infanzia con foto, attività svolte, pasti e riposo. I genitori ricevono aggiornamenti in tempo reale con momenti speciali del proprio bambino.', '📓', '#FF9800', ARRAY['childcare'], 'active', ARRAY['daily-reports','photo-sharing','meal-tracking','nap-logging'], '{"base":20,"currency":"EUR"}'),

('Parent Comm', 'sector-specific', 'concierge', 'Canale di comunicazione sicuro tra educatori e genitori con messaggi, avvisi e autorizzazioni digitali. Gestisce permessi di uscita, allergie alimentari e contatti di emergenza in un''unica piattaforma.', '👨‍👩‍👧', '#4CAF50', ARRAY['childcare'], 'active', ARRAY['secure-messaging','digital-permissions','allergy-management','emergency-contacts'], '{"base":15,"currency":"EUR"}'),

('Activity Planner', 'sector-specific', 'operations', 'Pianifica attività educative e ludiche per fasce d''età con libreria di oltre 500 attività categorizzate. Genera programmi settimanali bilanciati tra motricità, creatività, linguaggio e socializzazione.', '🎪', '#E91E63', ARRAY['childcare'], 'active', ARRAY['activity-library','age-appropriate','weekly-planning','development-areas'], '{"base":12,"currency":"EUR"}'),

-- EDUCATION (3)
('Learning Path', 'sector-specific', 'operations', 'Crea percorsi formativi personalizzati con moduli, quiz e certificazioni. Traccia progressi degli studenti, identifica lacune e adatta il contenuto al ritmo di apprendimento individuale con AI adattiva.', '🎓', '#1E88E5', ARRAY['education'], 'active', ARRAY['adaptive-learning','progress-tracking','quiz-builder','certification'], '{"base":25,"currency":"EUR"}'),

('Certificate Generator', 'sector-specific', 'content', 'Genera certificati e attestati professionali personalizzabili con verifica QR code anti-contraffazione. Gestisce template per corsi, workshop e formazione continua con registro digitale dei rilasci.', '🏆', '#FFD700', ARRAY['education'], 'active', ARRAY['certificate-design','qr-verification','template-library','issuance-registry'], '{"base":12,"currency":"EUR"}'),

('Student Engagement', 'sector-specific', 'analytics', 'Analizza engagement e partecipazione degli studenti con metriche di completamento, tempo studio e interazione. Identifica studenti a rischio dropout e suggerisce interventi personalizzati di supporto.', '📈', '#9C27B0', ARRAY['education'], 'active', ARRAY['engagement-metrics','completion-rates','dropout-prediction','intervention-suggestions'], '{"base":18,"currency":"EUR"}'),

-- EVENTS (3)
('Event Planner AI', 'sector-specific', 'operations', 'Pianifica eventi complessi con gestione timeline, budget, fornitori e checklist dettagliate. Coordina team, monitora progressi e genera report per il cliente con vista d''insieme sempre aggiornata.', '🎪', '#E91E63', ARRAY['events'], 'active', ARRAY['timeline-management','budget-tracking','vendor-coordination','checklist-automation'], '{"base":30,"currency":"EUR"}'),

('Vendor Matcher', 'sector-specific', 'operations', 'Trova e confronta fornitori per eventi (catering, audio/video, fiori, location) basandosi su budget, disponibilità e recensioni. Gestisce richieste preventivo multiple e negoziazione automatizzata.', '🤝', '#FF9800', ARRAY['events'], 'active', ARRAY['vendor-search','quote-comparison','availability-check','review-integration'], '{"base":20,"currency":"EUR"}'),

('Guest Engagement', 'sector-specific', 'concierge', 'Coinvolge gli ospiti dell''evento con app dedicata: programma, mappa, networking, sondaggi live e foto condivise. Crea un''esperienza interattiva memorabile che aumenta engagement e soddisfazione.', '🎉', '#9C27B0', ARRAY['events'], 'active', ARRAY['event-app','live-polls','photo-sharing','networking-features'], '{"base":18,"currency":"EUR"}'),

-- LOGISTICS (3)
('Route Optimizer Logistics', 'sector-specific', 'operations', 'Ottimizza percorsi di consegna multi-stop considerando finestre temporali, capacità veicolo e priorità. Riduce chilometraggio del 25% e aumenta le consegne giornaliere con routing dinamico in tempo reale.', '🚛', '#1E88E5', ARRAY['logistics'], 'active', ARRAY['multi-stop-routing','time-windows','capacity-planning','dynamic-rerouting'], '{"base":30,"currency":"EUR"}'),

('Delivery Predictor', 'sector-specific', 'analytics', 'Prevede tempi di consegna con precisione del 95% analizzando traffico storico, condizioni meteo e pattern stagionali. Genera ETA affidabili per i clienti e ottimizza le promesse di consegna.', '📊', '#00BCD4', ARRAY['logistics'], 'active', ARRAY['eta-prediction','traffic-analysis','weather-impact','delivery-windows'], '{"base":22,"currency":"EUR"}'),

('Warehouse Manager', 'sector-specific', 'operations', 'Gestisce operazioni di magazzino con mappatura ubicazioni, picking ottimizzato e inventario in tempo reale. Coordina ricevimento merci, preparazione ordini e spedizioni con barcode/RFID integrati.', '🏭', '#455A64', ARRAY['logistics'], 'active', ARRAY['location-mapping','pick-optimization','real-time-inventory','barcode-rfid'], '{"base":25,"currency":"EUR"}')

ON CONFLICT (name) DO NOTHING;
