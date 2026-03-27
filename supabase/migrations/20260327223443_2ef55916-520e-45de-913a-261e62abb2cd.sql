
CREATE OR REPLACE FUNCTION public.handle_new_restaurant()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Core setup
  INSERT INTO public.ai_tokens (restaurant_id, balance) VALUES (NEW.id, 5);
  INSERT INTO public.fisco_configs (restaurant_id) VALUES (NEW.id);
  INSERT INTO public.restaurant_memberships (restaurant_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'restaurant_admin');

  -- ═══════════════════════════════════════════════════════
  -- SEED COMPLETE FOOD DATA — Menu completo, tavoli, ordini,
  -- recensioni, prenotazioni, PIN cucina
  -- ═══════════════════════════════════════════════════════

  -- Kitchen access PIN
  INSERT INTO public.kitchen_access_pins (restaurant_id, pin_code, label, is_active) VALUES
    (NEW.id, '1234', 'Cucina Principale', true);

  -- ── MENU ITEMS (65+ piatti) ──

  -- Antipasti (12)
  INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_active, is_popular, sort_order) VALUES
    (NEW.id, 'Bruschetta Classica', 'Pomodorini freschi, basilico e olio EVO su pane toscano croccante', 8, 'Antipasti', true, true, 1),
    (NEW.id, 'Tagliere Misto', 'Selezione di salumi e formaggi stagionati con miele e confetture', 18, 'Antipasti', true, true, 2),
    (NEW.id, 'Carpaccio di Manzo', 'Fettine sottili con rucola, scaglie di parmigiano e limone', 14, 'Antipasti', true, false, 3),
    (NEW.id, 'Burrata Pugliese', 'Burrata fresca con pomodorini datterini e pesto di basilico', 15, 'Antipasti', true, true, 4),
    (NEW.id, 'Frittura di Calamari', 'Calamari freschi fritti con salsa tartara della casa', 13, 'Antipasti', true, false, 5),
    (NEW.id, 'Tartare di Tonno', 'Tonno rosso battuto a coltello con avocado e sesamo', 16, 'Antipasti', true, false, 6),
    (NEW.id, 'Crostini Toscani', 'Pane tostato con paté di fegatini e cipolla caramellata', 9, 'Antipasti', true, false, 7),
    (NEW.id, 'Insalata Caprese', 'Mozzarella di bufala DOP, pomodoro cuore di bue, basilico', 12, 'Antipasti', true, false, 8),
    (NEW.id, 'Polpo alla Griglia', 'Tentacoli grigliati con patate, olive e capperi', 17, 'Antipasti', true, false, 9),
    (NEW.id, 'Vitello Tonnato', 'Fettine di vitello con salsa tonnata cremosa', 15, 'Antipasti', true, false, 10),
    (NEW.id, 'Arancini Siciliani', 'Arancini al ragù con cuore di mozzarella filante', 10, 'Antipasti', true, false, 11),
    (NEW.id, 'Antipasto di Mare', 'Selezione di frutti di mare crudi e marinati', 22, 'Antipasti', true, false, 12),

  -- Primi Piatti (15)
    (NEW.id, 'Spaghetti alla Carbonara', 'Guanciale croccante, pecorino romano DOP, tuorlo d''uovo', 14, 'Primi', true, true, 13),
    (NEW.id, 'Risotto ai Funghi Porcini', 'Riso Carnaroli mantecato con porcini freschi e tartufo', 16, 'Primi', true, true, 14),
    (NEW.id, 'Paccheri all''Amatriciana', 'Pomodoro San Marzano, guanciale croccante, pecorino', 13, 'Primi', true, false, 15),
    (NEW.id, 'Tagliatelle al Ragù', 'Pasta all''uovo con ragù bolognese tradizionale 6 ore', 14, 'Primi', true, true, 16),
    (NEW.id, 'Cacio e Pepe', 'Tonnarelli con pecorino romano e pepe nero macinato fresco', 13, 'Primi', true, true, 17),
    (NEW.id, 'Lasagna della Nonna', 'Sfoglia all''uovo, ragù, besciamella e parmigiano', 15, 'Primi', true, false, 18),
    (NEW.id, 'Gnocchi alla Sorrentina', 'Gnocchi di patate con sugo, mozzarella e basilico', 13, 'Primi', true, false, 19),
    (NEW.id, 'Spaghetti alle Vongole', 'Vongole veraci, aglio, prezzemolo e peperoncino', 16, 'Primi', true, false, 20),
    (NEW.id, 'Pappardelle al Cinghiale', 'Pasta larga con ragù di cinghiale e rosmarino', 16, 'Primi', true, false, 21),
    (NEW.id, 'Risotto alla Milanese', 'Riso allo zafferano mantecato con midollo e parmigiano', 15, 'Primi', true, false, 22),
    (NEW.id, 'Ravioli Ricotta e Spinaci', 'Ravioli fatti a mano con burro e salvia', 14, 'Primi', true, false, 23),
    (NEW.id, 'Linguine allo Scoglio', 'Pasta con frutti di mare misti in salsa di pomodoro', 18, 'Primi', true, false, 24),
    (NEW.id, 'Orecchiette con Cime di Rapa', 'Pasta pugliese con cime di rapa, aglio e acciughe', 13, 'Primi', true, false, 25),
    (NEW.id, 'Fettuccine ai Porcini e Tartufo', 'Pasta fresca con crema di porcini e tartufo nero', 19, 'Primi', true, false, 26),
    (NEW.id, 'Rigatoni alla Gricia', 'Guanciale, pecorino romano e pepe nero', 13, 'Primi', true, false, 27),

  -- Pizze (10)
    (NEW.id, 'Pizza Margherita', 'Mozzarella di bufala DOP, pomodoro San Marzano, basilico', 12, 'Pizze', true, true, 28),
    (NEW.id, 'Pizza Diavola', 'Salame piccante, mozzarella fior di latte, peperoncino', 14, 'Pizze', true, true, 29),
    (NEW.id, 'Pizza Quattro Formaggi', 'Mozzarella, gorgonzola, fontina, parmigiano reggiano', 15, 'Pizze', true, false, 30),
    (NEW.id, 'Pizza Napoletana', 'Acciughe del Cantabrico, capperi, olive nere, origano', 14, 'Pizze', true, false, 31),
    (NEW.id, 'Pizza Prosciutto e Funghi', 'Prosciutto cotto, funghi champignon, mozzarella', 14, 'Pizze', true, false, 32),
    (NEW.id, 'Pizza Capricciosa', 'Prosciutto, funghi, carciofi, olive, mozzarella', 15, 'Pizze', true, false, 33),
    (NEW.id, 'Pizza Bufalina', 'Mozzarella di bufala, pomodorini Pachino, rucola', 16, 'Pizze', true, false, 34),
    (NEW.id, 'Pizza Tartufo', 'Crema di tartufo, mozzarella, funghi porcini, rucola', 18, 'Pizze', true, false, 35),
    (NEW.id, 'Pizza Tonno e Cipolla', 'Tonno, cipolla rossa di Tropea, mozzarella', 14, 'Pizze', true, false, 36),
    (NEW.id, 'Focaccia Gourmet', 'Focaccia con stracchino, prosciutto crudo e fichi', 16, 'Pizze', true, false, 37),

  -- Secondi (10)
    (NEW.id, 'Tagliata di Manzo', 'Controfiletto alla griglia con rucola, grana e aceto balsamico', 24, 'Secondi', true, true, 38),
    (NEW.id, 'Branzino al Forno', 'Filetto con patate, olive taggiasche e capperi', 22, 'Secondi', true, false, 39),
    (NEW.id, 'Filetto al Pepe Verde', 'Filetto di manzo con salsa cremosa al pepe verde', 28, 'Secondi', true, true, 40),
    (NEW.id, 'Ossobuco alla Milanese', 'Stinco di vitello brasato con gremolada e risotto', 26, 'Secondi', true, false, 41),
    (NEW.id, 'Pollo alla Cacciatora', 'Pollo ruspante con pomodoro, olive e rosmarino', 18, 'Secondi', true, false, 42),
    (NEW.id, 'Salmone alla Griglia', 'Con verdure di stagione e salsa al limone', 22, 'Secondi', true, false, 43),
    (NEW.id, 'Costolette d''Agnello', 'Scottadito con patate arrosto e salsa alla menta', 26, 'Secondi', true, false, 44),
    (NEW.id, 'Fritto Misto di Pesce', 'Calamari, gamberi e alici fritte con limone', 20, 'Secondi', true, false, 45),
    (NEW.id, 'Scaloppine al Limone', 'Vitello con salsa al limone e capperi', 18, 'Secondi', true, false, 46),
    (NEW.id, 'Bistecca alla Fiorentina', 'Costata di manzo chianina alla brace (al kg)', 55, 'Secondi', true, true, 47),

  -- Contorni (6)
    (NEW.id, 'Patate Arrosto', 'Con rosmarino e aglio', 6, 'Contorni', true, false, 48),
    (NEW.id, 'Insalata Mista', 'Lattuga, pomodorini, carote e mais', 5, 'Contorni', true, false, 49),
    (NEW.id, 'Verdure Grigliate', 'Zucchine, melanzane, peperoni e cipolla', 7, 'Contorni', true, false, 50),
    (NEW.id, 'Spinaci Saltati', 'Con aglio, olio e peperoncino', 6, 'Contorni', true, false, 51),
    (NEW.id, 'Patatine Fritte', 'Fritte croccanti con sale marino', 5, 'Contorni', true, false, 52),
    (NEW.id, 'Friarielli', 'Broccoli napoletani saltati in padella con aglio', 7, 'Contorni', true, false, 53),

  -- Dolci (8)
    (NEW.id, 'Tiramisù', 'Mascarpone, savoiardi, caffè espresso e cacao amaro', 8, 'Dolci', true, true, 54),
    (NEW.id, 'Panna Cotta', 'Con coulis di frutti di bosco freschi', 7, 'Dolci', true, true, 55),
    (NEW.id, 'Cannolo Siciliano', 'Ricotta di pecora, gocce di cioccolato e pistacchio', 7, 'Dolci', true, false, 56),
    (NEW.id, 'Torta della Nonna', 'Crema pasticcera, pinoli tostati e zucchero a velo', 7, 'Dolci', true, false, 57),
    (NEW.id, 'Millefoglie', 'Pasta sfoglia con crema diplomatica e frutti rossi', 8, 'Dolci', true, false, 58),
    (NEW.id, 'Sorbetto al Limone', 'Limoni di Amalfi, servito in scorza di limone', 6, 'Dolci', true, false, 59),
    (NEW.id, 'Semifreddo al Torroncino', 'Con croccante alle mandorle e cioccolato', 8, 'Dolci', true, false, 60),
    (NEW.id, 'Cheesecake ai Frutti di Bosco', 'Base di biscotto, crema al formaggio e berries', 8, 'Dolci', true, false, 61),

  -- Bevande (10)
    (NEW.id, 'Espresso', 'Caffè 100% arabica tostatura media', 2, 'Bevande', true, false, 62),
    (NEW.id, 'Cappuccino', 'Espresso con latte montato a crema', 3, 'Bevande', true, false, 63),
    (NEW.id, 'Acqua Minerale', 'Naturale o frizzante 75cl', 3, 'Bevande', true, false, 64),
    (NEW.id, 'Coca-Cola / Fanta', 'Bibita in vetro 33cl', 4, 'Bevande', true, false, 65),
    (NEW.id, 'Prosecco Valdobbiadene', 'Calice di bollicine DOCG', 7, 'Bevande', true, false, 66),
    (NEW.id, 'Vino Rosso della Casa', 'Montepulciano d''Abruzzo, calice', 6, 'Bevande', true, false, 67),
    (NEW.id, 'Vino Bianco della Casa', 'Vermentino di Sardegna, calice', 6, 'Bevande', true, false, 68),
    (NEW.id, 'Birra Artigianale', 'IPA alla spina 40cl', 7, 'Bevande', true, false, 69),
    (NEW.id, 'Spritz Aperol', 'Prosecco, Aperol, soda e arancia', 8, 'Bevande', true, false, 70),
    (NEW.id, 'Amaro Digestivo', 'Selezione di amari italiani', 5, 'Bevande', true, false, 71);

  -- ── TABLES (10 tavoli con posizioni griglia) ──
  INSERT INTO public.restaurant_tables (restaurant_id, table_number, seats, status, label, pos_x, pos_y) VALUES
    (NEW.id, 1, 2, 'free', 'Tavolo 1', 10, 15),
    (NEW.id, 2, 2, 'free', 'Tavolo 2', 30, 15),
    (NEW.id, 3, 4, 'free', 'Tavolo 3', 55, 15),
    (NEW.id, 4, 4, 'free', 'Tavolo 4', 80, 15),
    (NEW.id, 5, 4, 'occupied', 'Tavolo 5', 10, 45),
    (NEW.id, 6, 6, 'free', 'Tavolo 6', 35, 45),
    (NEW.id, 7, 6, 'free', 'Tavolo 7', 65, 45),
    (NEW.id, 8, 8, 'free', 'Tavolo 8', 10, 75),
    (NEW.id, 9, 4, 'occupied', 'Tavolo 9', 45, 75),
    (NEW.id, 10, 2, 'free', 'Tavolo 10', 80, 75);

  -- ── SAMPLE ORDERS (10 ordini) ──
  INSERT INTO public.orders (restaurant_id, customer_name, customer_phone, order_type, table_number, status, total, items, notes) VALUES
    (NEW.id, 'Marco Rossi', '+39 333 1234567', 'table', 5, 'preparing', 42, '[{"name":"Carbonara","qty":2,"price":14},{"name":"Bruschetta","qty":1,"price":8},{"name":"Acqua","qty":2,"price":3}]'::jsonb, 'Senza pepe'),
    (NEW.id, 'Laura Bianchi', '+39 334 9876543', 'delivery', null, 'pending', 44, '[{"name":"Pizza Margherita","qty":2,"price":12},{"name":"Tiramisù","qty":2,"price":8},{"name":"Coca-Cola","qty":1,"price":4}]'::jsonb, 'Citofono rotto, chiamare'),
    (NEW.id, 'Giovanni Paoli', '+39 335 5551234', 'takeaway', null, 'ready', 46, '[{"name":"Risotto Porcini","qty":1,"price":16},{"name":"Tagliata","qty":1,"price":24},{"name":"Vino Rosso","qty":1,"price":6}]'::jsonb, 'Extra limone'),
    (NEW.id, 'Anna Ferretti', '+39 336 7778899', 'table', 9, 'preparing', 55, '[{"name":"Filetto Pepe Verde","qty":1,"price":28},{"name":"Burrata","qty":1,"price":15},{"name":"Margherita","qty":1,"price":12}]'::jsonb, null),
    (NEW.id, 'Roberto Conti', '+39 337 4445566', 'delivery', null, 'pending', 38, '[{"name":"Cacio e Pepe","qty":2,"price":13},{"name":"Panna Cotta","qty":1,"price":7},{"name":"Espresso","qty":2,"price":2},{"name":"Spritz","qty":1,"price":8}]'::jsonb, 'Piano 3, interno 5'),
    (NEW.id, 'Sofia Martini', '+39 338 1112233', 'table', 3, 'delivered', 36, '[{"name":"Lasagna","qty":2,"price":15},{"name":"Cappuccino","qty":2,"price":3}]'::jsonb, null),
    (NEW.id, 'Matteo De Luca', '+39 339 6667788', 'takeaway', null, 'preparing', 52, '[{"name":"Tagliere Misto","qty":1,"price":18},{"name":"Carbonara","qty":1,"price":14},{"name":"Cannolo","qty":2,"price":7},{"name":"Prosecco","qty":1,"price":7}]'::jsonb, 'Allergico alle noci'),
    (NEW.id, 'Chiara Galli', '+39 340 3334455', 'delivery', null, 'ready', 33, '[{"name":"Diavola","qty":1,"price":14},{"name":"Gnocchi Sorrentina","qty":1,"price":13},{"name":"Birra","qty":1,"price":7}]'::jsonb, null),
    (NEW.id, 'Luca Fontana', '+39 341 8889900', 'table', 6, 'pending', 68, '[{"name":"Antipasto di Mare","qty":1,"price":22},{"name":"Linguine Scoglio","qty":1,"price":18},{"name":"Tagliata","qty":1,"price":24},{"name":"Amaro","qty":1,"price":5}]'::jsonb, 'Compleanno — candela'),
    (NEW.id, 'Valentina Ricci', '+39 342 2223344', 'takeaway', null, 'delivered', 28, '[{"name":"Capricciosa","qty":1,"price":15},{"name":"Insalata Caprese","qty":1,"price":12}]'::jsonb, 'Senza olive');

  -- ── REVIEWS (8 recensioni) ──
  INSERT INTO public.reviews (restaurant_id, rating, customer_name, comment, is_public) VALUES
    (NEW.id, 5, 'Marco R.', 'Carbonara perfetta, come dalla nonna! Ambiente fantastico.', true),
    (NEW.id, 5, 'Sara T.', 'Servizio impeccabile e piatti eccezionali. Tornerò sicuramente!', true),
    (NEW.id, 5, 'Laura B.', 'La migliore pizza napoletana della città. Consiglio il tartufo!', true),
    (NEW.id, 4, 'Paolo V.', 'Buona pizza e ottima selezione di vini. Ambiente accogliente.', true),
    (NEW.id, 5, 'Anna F.', 'Tagliata eccezionale! Il personale è molto cortese e attento.', true),
    (NEW.id, 4, 'Roberto C.', 'Ottima qualità, porzioni generose. Il tiramisù è divino.', true),
    (NEW.id, 2, 'Giovanni P.', 'Attesa troppo lunga per i secondi piatti.', false),
    (NEW.id, 3, 'Maria L.', 'Buono ma non eccezionale, prezzi un po'' alti per la zona.', false);

  -- ── RESERVATIONS (5 prenotazioni) ──
  INSERT INTO public.reservations (restaurant_id, customer_name, customer_phone, reservation_date, reservation_time, guests, status) VALUES
    (NEW.id, 'Marco Rossi', '+39 333 1234567', CURRENT_DATE, '20:30', 4, 'confirmed'),
    (NEW.id, 'Laura Bianchi', '+39 334 9876543', CURRENT_DATE, '21:00', 2, 'pending'),
    (NEW.id, 'Giovanni Paoli', '+39 335 5551234', CURRENT_DATE + 1, '20:00', 6, 'confirmed'),
    (NEW.id, 'Sofia Martini', '+39 338 1112233', CURRENT_DATE + 1, '19:30', 3, 'pending'),
    (NEW.id, 'Luca Fontana', '+39 341 8889900', CURRENT_DATE + 2, '21:00', 8, 'confirmed');

  RETURN NEW;
END;
$function$;
