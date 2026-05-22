-- 1) Aggiorna anagrafica + branding + orari reali Come Mai
UPDATE public.restaurants
SET
  name = 'Come Mai - Pizza & Food',
  tagline = 'Pizza al forno a legna e cucina toscana nel cuore di Arcille',
  address = 'Piazza della Repubblica, 1',
  city = 'Arcille (GR)',
  phone = '+39 333 952 1469',
  email = 'info@comemai-pizzafood.it',
  logo_url = 'https://cdn.res-menu.net/come-mai-pizza-food/logo-share.jpg',
  primary_color = '#7B4A3D',
  languages = ARRAY['it','en','nl']::text[],
  opening_hours = '[
    {"day":"Lunedì","hours":"06:30 - 14:00 · 17:00 - 22:00"},
    {"day":"Martedì","hours":"06:30 - 14:00 · 17:00 - 23:00"},
    {"day":"Mercoledì","hours":"06:30 - 14:00 · 17:00 - 23:00"},
    {"day":"Giovedì","hours":"Chiuso"},
    {"day":"Venerdì","hours":"06:30 - 22:30"},
    {"day":"Sabato","hours":"06:30 - 23:00"},
    {"day":"Domenica","hours":"06:00 - 23:00"}
  ]'::jsonb,
  theme_config = jsonb_build_object(
    'palette', jsonb_build_object(
      'primary', '#7B4A3D',
      'primaryDark', '#5C3528',
      'accent', '#D9A441',
      'background', '#FFF8F0',
      'foreground', '#2A1B14',
      'muted', '#F2E6D8'
    ),
    'typography', jsonb_build_object(
      'heading', 'Playfair Display, serif',
      'body', 'Inter, sans-serif'
    ),
    'hero', jsonb_build_object(
      'image', 'https://cdn.res-menu.net/come-mai-pizza-food/3.jpg',
      'eyebrow', 'Forno a legna · Tradizione toscana',
      'title', 'Come Mai',
      'subtitle', 'Pizza al forno a legna, pici fatti in casa e cucina del territorio. In Piazza della Repubblica, Arcille.'
    ),
    'gallery', jsonb_build_array(
      'https://cdn.res-menu.net/come-mai-pizza-food/1.jpg',
      'https://cdn.res-menu.net/come-mai-pizza-food/2.jpg',
      'https://cdn.res-menu.net/come-mai-pizza-food/3.jpg',
      'https://cdn.res-menu.net/come-mai-pizza-food/albums-1.jpg',
      'https://cdn.res-menu.net/come-mai-pizza-food/albums-2.jpg',
      'https://cdn.res-menu.net/come-mai-pizza-food/albums-3.jpg',
      'https://cdn.res-menu.net/come-mai-pizza-food/albums-4.jpg',
      'https://cdn.res-menu.net/come-mai-pizza-food/albums-5.jpg',
      'https://cdn.res-menu.net/come-mai-pizza-food/albums-6.jpg',
      'https://cdn.res-menu.net/come-mai-pizza-food/albums-7.jpg'
    ),
    'social', jsonb_build_object(
      'instagram', 'https://www.instagram.com/comemai_pizzafood/',
      'google', 'https://www.google.com/maps/place/Come+Mai+-+Pizza+et+Food+Arcille',
      'tripadvisor', 'https://www.tripadvisor.com/Restaurant_Review-g3577701-d31662662-Reviews-Come_Mai-Arcille_Province_of_Grosseto_Tuscany.html'
    ),
    'rating', jsonb_build_object('value', 4.6, 'count', 53, 'source', 'Google'),
    'highlights', jsonb_build_array(
      'Forno a legna',
      'Pici fatti in casa',
      'Serate karaoke & piano live',
      'Conduzione giovane',
      'Delivery & Asporto'
    )
  ),
  delivery_enabled = true,
  takeaway_enabled = true,
  table_orders_enabled = true,
  is_active = true,
  updated_at = now()
WHERE id = '1e6f4c55-0972-4fe7-8a84-d5936e751597';

-- 2) Reset menu items placeholder
DELETE FROM public.menu_items
WHERE restaurant_id = '1e6f4c55-0972-4fe7-8a84-d5936e751597';

-- 3) Inserisci menu reale: 24 Pizze Rosse + 4 Calzoni + 3 Antipasti + 2 Primi
INSERT INTO public.menu_items
  (restaurant_id, category, name, description, price, image_url, is_popular, sort_order)
VALUES
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Margherita DOP','Pomodoro San Marzano, mozzarella fior di latte, basilico fresco, olio EVO.',8.00,'https://cdn.res-menu.net/come-mai-pizza-food/photo-3.jpg',true,1),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Marinara','Pomodoro, aglio, origano, olio EVO. Senza mozzarella, tradizione partenopea.',7.00,NULL,false,2),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Regina','Pomodoro, mozzarella, prosciutto cotto, funghi champignon.',10.00,NULL,false,3),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Diavola','Pomodoro, mozzarella, salame piccante, peperoncino.',9.00,NULL,true,4),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Porcini','Pomodoro, mozzarella, funghi porcini freschi, prezzemolo.',10.00,NULL,false,5),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Vandalaccia','Pomodoro, mozzarella, salsiccia, friarielli, scaglie di pecorino.',12.00,NULL,false,6),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Dom''è','Pomodoro, mozzarella, crudo di Parma, rucola, scaglie di grana.',10.00,NULL,false,7),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','La Mi Ex','Pomodoro, mozzarella, tonno, cipolla rossa di Tropea, olive nere taggiasche.',12.00,NULL,false,8),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','5 Formaggi','Pomodoro, mozzarella, gorgonzola, fontina, pecorino toscano, scamorza affumicata.',10.00,NULL,false,9),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','5 Stagioni','Pomodoro, mozzarella, carciofini, funghi, prosciutto cotto, salsiccia, olive.',13.00,NULL,false,10),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Valnostrana 2.0','Pomodoro, mozzarella, salumi e formaggi del territorio toscano.',14.00,NULL,false,11),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Vegetariana','Pomodoro, mozzarella, verdure di stagione grigliate, olio EVO.',10.00,NULL,false,12),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Parmigianina','Pomodoro, mozzarella, melanzane fritte, parmigiano, basilico.',13.00,NULL,true,13),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Napoli Vera','Pomodoro, mozzarella, acciughe del Cantabrico, capperi, origano.',10.00,NULL,false,14),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Tonno e Cipolla','Pomodoro, mozzarella, tonno, cipolla rossa.',10.00,NULL,false,15),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','La Pazza Idea','Pomodoro, mozzarella, ingredienti speciali a sorpresa dello chef.',12.00,NULL,false,16),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Biancaneve','Pomodoro, mozzarella, ricotta fresca, spinaci saltati.',10.00,NULL,false,17),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Pomo d''Oro','Pomodoro datterino giallo e rosso, mozzarella, basilico.',10.00,NULL,false,18),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Ilary','Pomodoro, mozzarella, bresaola, rucola, grana, gocce di balsamico.',12.00,NULL,false,19),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Nenny','Pomodoro, mozzarella, salsiccia, patate al forno, rosmarino.',12.00,NULL,false,20),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Norcina','Pomodoro, mozzarella, salsiccia di Norcia, funghi porcini, tartufo nero.',12.00,'https://cdn.res-menu.net/come-mai-pizza-food/photo-1.jpg',true,21),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Salsiccia e Friarielli','Pomodoro, mozzarella, salsiccia, friarielli saltati in padella.',10.00,NULL,false,22),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Spark','Pomodoro, mozzarella, speck, brie, noci.',10.00,NULL,false,23),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Pizze Rosse','Argentario 2.0','Pomodoro, mozzarella, gamberi, zucchine, lime - omaggio al mare della Maremma.',15.00,NULL,false,24),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Calzoni','Classico','Pomodoro, mozzarella, prosciutto cotto, funghi. Chiuso e cotto al forno a legna.',9.00,NULL,false,30),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Calzoni','Amiata','Funghi porcini del Monte Amiata, mozzarella, salsiccia, scamorza affumicata.',10.00,NULL,false,31),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Calzoni','Napoletano','Ricotta, mozzarella, salame napoletano, pepe nero.',10.00,NULL,false,32),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Calzoni','Il Bacio di Evelyn','2° posto al Campionato Mondiale PIZZA DOC. Creazione signature dello chef.',16.00,'https://cdn.res-menu.net/come-mai-pizza-food/photo-2.jpg',true,33),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Antipasti','Antipasti Misti','Tagliere di salumi e formaggi toscani, verdure sott''olio fatte in casa, supplì croccanti.',12.00,NULL,true,40),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Antipasti','Supplì della Casa','Riso al ragù, mozzarella filante, panati e fritti al momento. Spettacolari.',6.00,NULL,true,41),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Antipasti','Frittura Mista','Selezione di fritture croccanti del giorno, servite con limone.',10.00,NULL,false,42),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Primi','Pici alle Vongole','Pici fatti in casa, vongole veraci, aglio, prezzemolo, olio EVO.',14.00,'https://cdn.res-menu.net/come-mai-pizza-food/photo-4.jpg',true,50),
  ('1e6f4c55-0972-4fe7-8a84-d5936e751597','Primi','Pici al Ragù','Pici tirati a mano con ragù di chianina cotto a lungo.',12.00,NULL,false,51);