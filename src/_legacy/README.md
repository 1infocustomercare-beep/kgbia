# Legacy Archive

Componenti archiviati durante il refactor Caccia Lead (Fase 1 del piano).
Nessun import reale nella app: mantenuti qui come riferimento storico, escluso dal typecheck via `tsconfig.app.json`.

## /leads
- CreditConfirmDialog, DemoFactoryOverlay (sostituiti da MockupSuiteGenerator)
- LeadAnalysisPanel, LeadCommandPanel, LeadPipelineBoard, LeadResultCard, LeadSearchPanel (sostituiti da SellerCRM + AriannaLeadScoutPanel + LeadsPage nuova IA)

## /partner
- PartnerSandbox + PartnerFullDemo (demo interno mai wirata)
- PartnerDemoProjects, PartnerOutreachCRM, LeadEnginePro, PartnerPortfolio (component) (sostituiti da PartnerPortfolioPage, SellerCRM, LeadsPage)

Per ripristinare un file: spostarlo di nuovo sotto `src/components/...` e riaggiungere l'import.
