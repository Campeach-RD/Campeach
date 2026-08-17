export type CampRichInfo = {
  source?: string;
  location?: string;
  priceFrom?: number;
  priceNote?: string;
  capacity?: number;
  distance?: string;
  intro?: string;
  important?: string[];
  includes?: string[];
  nearby?: string[];
  pricing?: string[];
  lodging?: string[];
  extraActivities?: string[];
  food?: string[];
  whatToBring?: string[];
  rules?: string[];
  reservation?: string[];
};

export const campRichInfo: Record<string, CampRichInfo> = {
  "taiku": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 1600,
    "priceNote": "RD$ 1,600 por persona",
    "distance": "1 hora y 15 minutos desde Santo Domingo",
    "intro": "Taiku combina Capacidad maxima dentro del campamento: 40 personas. Distancia desde Santo Domingo: 1 hora y 15 minutos. Banos completos con duchas de agua fria y caliente. Parqueo seguro con vigilancia. Zona de camping y glamping con distintas modalidades de alojamiento. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Capacidad maxima dentro del campamento: 40 personas.",
      "Distancia desde Santo Domingo: 1 hora y 15 minutos.",
      "Banos completos con duchas de agua fria y caliente.",
      "Parqueo seguro con vigilancia.",
      "Bar y restaurante en la propiedad.",
      "Acceso a rio cercano.",
      "Para privatizar el espacio se requiere reserva con al menos 5 dias de antelacion y un consumo minimo de RD$ 20,000."
    ],
    "includes": [
      "Zona de camping y glamping con distintas modalidades de alojamiento.",
      "Banos, duchas, electricidad para celulares.",
      "Restaurante y bar (costo adicional).",
      "Parqueo vigilado.",
      "Acceso a rio y areas sociales.",
      "Check in: 2:00 pm (reciben hasta las 5:00 pm) Check out: 12:00 pm"
    ],
    "nearby": [
      "(No se especifican en el documento)"
    ],
    "pricing": [
      "Carpa (max. 3 personas) + sleeping bag",
      "RD$ 1,600 por persona",
      "Basecamp:",
      "Mini choza de madera, colchon y mosquitero",
      "RD$ 1,900 por pareja",
      "4 unidades disponibles",
      "Tropical Hut:",
      "Choza con bano privado, colchon Queen, balcon",
      "RD$ 2,900 por pareja",
      "Colchoneta extra para ninos: RD$ 600",
      "RD$ 600 por persona por noche"
    ],
    "lodging": [],
    "extraActivities": [
      "Hiking:",
      "1 a 6 personas: RD$ 3,000 c/u",
      "7 o mas personas: RD$ 600 c/u",
      "Yoga: A partir de 8 personas - RD$ 400 c/u",
      "Masaje en el arroyo: RD$ 2,000 por persona (reservar con 7 dias de antelacion)"
    ],
    "food": [],
    "whatToBring": [
      "Sabanas, almohada, productos de cuidado personal, toalla.",
      "Ropa comoda y calzado adecuado.",
      "Repelente, termo con agua, actitud positiva."
    ],
    "rules": [
      "Check-in hasta las 5:00 pm.",
      "Silencio: 10:00 pm a 7:00 am.",
      "Colocar la basura en los zafacones.",
      "Cuidar tus pertenencias personales.",
      "Fogatas solo con autorizacion previa. No usar liquidos inflamables y apagar antes de dormir.",
      "Se permiten mascotas; deben mantenerse bajo control y recoger sus desechos.",
      "Prohibido el uso de sustancias inflamables sin autorizacion."
    ],
    "reservation": [
      "Indicar fecha y numero de personas.",
      "Realizar el pago del 100% para confirmar la reserva.",
      "Recibiras factura y todos los detalles necesarios.",
      "Confirmacion de la ubicacion tras reserva."
    ]
  },
  "azua": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 1400,
    "priceNote": "Adultos desde RD$ 1,400 por noche (llevando casa de campana).",
    "capacity": 4,
    "distance": "2 horas y 24 minutos desde Santo Domingo",
    "intro": "Azua combina Piscina dentro de la propiedad. Restaurante y bar dentro del campamento. Actividades: paseo en bote por la bahia. Capacidad maxima dentro del campamento: 24 personas. Desayuno dominicano. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Piscina dentro de la propiedad.",
      "Restaurante y bar dentro del campamento.",
      "Actividades: paseo en bote por la bahia.",
      "Capacidad maxima dentro del campamento: 24 personas.",
      "Distancia desde Santo Domingo: 2 horas y 24 minutos."
    ],
    "includes": [
      "Desayuno dominicano.",
      "Wifi.",
      "Bar y restaurante (costo adicional).",
      "Hamacas, chaise lounge, fogata.",
      "Piscina dentro de la propiedad.",
      "Banos y duchas compartidas.",
      "Electricidad para cargar celulares.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Check in: 3:00 pm Check out: 12:30 pm"
    ],
    "nearby": [
      "Playa Las Caobitas: 11 minutos.",
      "Playa La Uvita y Monte Rio: 50 minutos.",
      "Rancho Caprache: 1 hora y 28 minutos.",
      "Ideal para rutas de senderismo, kayak, bicicletas, tubing, motocross."
    ],
    "pricing": [
      "Adultos: RD$ 1,400 por noche (llevando casa de campana).",
      "Ninos 6 a 10 anos: RD$ 800 por noche.",
      "Entrada de 3:00 pm a 7:00 pm / Salida 12:30 pm.",
      "Alquiler de equipos disponible con retiro en Santo Domingo.",
      "Adultos: RD$ 1,600",
      "Ninos (6 a 10 anos): RD$ 900"
    ],
    "lodging": [
      "Capacidad: 4 adultos.",
      "RD$ 4,500 por pareja (ocupacion minima: 2 personas)."
    ],
    "extraActivities": [
      "Paseo en barca (hasta 6 personas): RD$ 3,000",
      "Rutas en bicicleta (2 hrs): RD$ 500",
      "Paseo a caballo (1.5 hrs): RD$ 1,500",
      "Masaje relajante (30 mins): RD$ 1,000",
      "Paseo a la Cueva de los Indios: RD$ 500",
      "Rutas de senderismo: a consultar"
    ],
    "food": [],
    "whatToBring": [
      "Bloqueador solar, repelente.",
      "Cepillo dental, pasta, jabon.",
      "Toallas, ropa fresca, abrigo.",
      "Linterna."
    ],
    "rules": [
      "No se permiten mascotas.",
      "Musica solo para ti, no se permite de 9:00 pm a 8:00 am.",
      "No armas, bocinas, jucas ni quitipon.",
      "Prohibido fumar.",
      "No se permite ingresar bebidas ni comidas.",
      "Nadar bajo tu propio riesgo.",
      "Mantener limpieza en todas las areas.",
      "No tocar flora/fauna sin permiso.",
      "Parqueo solo en zonas designadas."
    ],
    "reservation": [
      "Contactar a Campeach minimo 3 dias antes con fecha y numero de personas.",
      "Pago del 100% requerido para confirmar.",
      "La factura es confirmacion oficial de la reserva y aceptacion de responsabilidades.",
      "Titular debe ser mayor de 18 anos con cedula o ID.",
      "Cancelacion:",
      "1 semana antes: penalidad 50%.",
      "24h antes o no show: penalidad 100%.",
      "No se permite modificacion de fecha."
    ]
  },
  "bayaguana": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 1000,
    "priceNote": "1 noche adultos: RD$ 1,000",
    "distance": "1 hora y 20 minutos desde Santo Domingo",
    "intro": "Bayaguana combina Pets Friendly: Se permiten mascotas. Distancia desde Santo Domingo: 1 hora y 20 minutos. Capacidad maxima dentro del campamento: 60 personas. Ideal para bodas, retiros y eventos privados de hasta 50 personas. (No especificados) Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Distancia desde Santo Domingo: 1 hora y 20 minutos.",
      "Capacidad maxima dentro del campamento: 60 personas.",
      "Ideal para bodas, retiros y eventos privados de hasta 50 personas.",
      "Rio privado dentro de la propiedad.",
      "Area de fogata, columpios y juegos de mesa.",
      "Banos y duchas compartidas."
    ],
    "includes": [],
    "nearby": [
      "(No especificados)"
    ],
    "pricing": [
      "Camping Libre (llevando tus equipos):",
      "1 noche adultos: RD$ 1,000",
      "2 noches adultos: RD$ 1,500",
      "1 noche ninos (4-10 anos): RD$ 750",
      "2 noches ninos (4-10 anos): RD$ 1,125",
      "Todo Incluido (equipos + alimentos):",
      "1 noche adultos: RD$ 3,800",
      "2 noches adultos: RD$ 6,800",
      "1 noche ninos (4-10 anos): RD$ 2,850",
      "2 noches ninos (4-10 anos): RD$ 5,100",
      "Todo Incluido + Parrillada:",
      "1 noche adultos: RD$ 4,200"
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [],
    "whatToBring": [
      "Mochila, bloqueador solar, repelente.",
      "Estufa de camping si no contratas plan con comida.",
      "Tenis o crocs.",
      "Toallas y productos de aseo personal.",
      "Foco, sabanas, traje de bano, snacks y bebidas."
    ],
    "rules": [
      "No cortar ni danar la flora o fauna.",
      "No tomar frutos sin permiso.",
      "No mover ni danar utensilios o mobiliario.",
      "No dejar basura, usar los contenedores.",
      "Fogatas solo en zonas permitidas, mantener vigiladas.",
      "No hacer ruidos fuertes en la noche.",
      "Mantener limpieza en banos y areas comunes.",
      "Las mascotas deben ir con correa y se debe recoger sus desechos."
    ],
    "reservation": [
      "Contacta con el staff indicando la fecha, cantidad de personas y tipo de alojamiento.",
      "Realiza el pago del 100% para confirmar la reserva.",
      "Recibiras la factura y la informacion necesaria.",
      "Se confirma ubicacion y detalles."
    ]
  },
  "bonao": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "intro": "Bonao combina Pets Friendly: Se permiten mascotas. Acceso a la Plaza Ceremonial Taina (dentro de la propiedad). Acceso al Salto Arroyo Carlos (dentro de la propiedad). Acceso al salto no. 4 del Arroyo Carlos. Salto de Jima: A 35 minutos. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Acceso a la Plaza Ceremonial Taina (dentro de la propiedad).",
      "Acceso al Salto Arroyo Carlos (dentro de la propiedad).",
      "Acceso al salto no. 4 del Arroyo Carlos.",
      "Excelente para Overlands.",
      "No hay acceso en transporte publico.",
      "No hay electricidad.",
      "No hay delivery.",
      "Buena senal de Claro y Altice.",
      "Capacidad maxima dentro del campamento: 100 personas."
    ],
    "includes": [],
    "nearby": [
      "Salto de Jima: A 35 minutos.",
      "Pozos de Blanco: A 40 minutos.",
      "Rancho Guacamayos: A 9 minutos.",
      "Salto del Rodeo (Blanco): A 37 minutos.",
      "Complejo Ecoturistico Rio Blanco: A 29 minutos.",
      "Rancho Don Soto: A 10 minutos.",
      "Ideal para rutas de senderismo, aventuras, rutas MTB, bicicletas, motocross, 4 wheels, y buggies."
    ],
    "pricing": [
      "Lunes a Jueves:",
      "Area de fogata y lena.",
      "Area de mesas de picnic.",
      "Letrina en el area del camping.",
      "Letrina panoramica.",
      "Acceso al rio Juma.",
      "Senderos.",
      "Parqueo en propiedad privada.",
      "Servicios adicionales con cargos extras (se debe reservar con anticipacion):",
      "Guia local.",
      "Cocinera local.",
      "Nota: Recuerda dejar el espacio en las mismas condiciones como lo encontraste y llevarte tus residuos."
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Botella de agua.",
      "Vasos, platos y cubiertos reutilizables.",
      "Pasta y cepillo dental.",
      "Papel higienico.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Traje de bano y toalla.",
      "La comida que vayas a consumir."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion, esto podria ocasionar sanciones legales y pagos de multas."
    ],
    "reservation": [
      "Contacta al Staff de Campeach RD informandole la fecha de tu reserva (minimo 3 dias antes de la entrada), cantidad de personas y carpas que necesitas, asi como los equipos de camping adicionales que desees.",
      "Se requiere el pago del 100% para formalizar la reserva del espacio. El mismo se hace por transferencia, deposito o link de pago (se carga un 6% a pagos con tarjeta).",
      "Al momento de recibir la factura de los servicios contratados aceptara la misma como comprobante de constancia de la reserva y responsabilidades dentro del campamento plasmadas en este catalogo.",
      "El titular del alquiler debe ser mayor de 18 anos, tener documento de identificacion y sera el responsable del equipo contratado y cualquier eventualidad que surja en el campamento.",
      "Politicas de cancelacion: No es reembolsable, si cancelas con un minimo de 3 dias antes, se modifica la fecha de acuerdo a la disponibilidad del mismo."
    ]
  },
  "cabarete": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 700,
    "priceNote": "Plan sencillo: RD$ 700.00 por persona (incluye uso de espacio).",
    "capacity": 4,
    "distance": "3 horas y 40 minutos desde Santo Domingo",
    "intro": "Cabarete combina Pets Friendly: Se permiten mascotas. Rio Yasica frente al area de camping. Restaurante y bar dentro del campamento los sabados y domingos. Capacidad maxima dentro del campamento: 500 personas. Banos y duchas compartidos con agua caliente. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Rio Yasica frente al area de camping.",
      "Restaurante y bar dentro del campamento los sabados y domingos.",
      "Capacidad maxima dentro del campamento: 500 personas.",
      "Distancia desde Santo Domingo: 3 horas y 40 minutos."
    ],
    "includes": [
      "Banos y duchas compartidos con agua caliente.",
      "Billar y area de juegos (damas, ajedrez, petanca, barajas y dominos).",
      "Cancha de volleyball y badminton.",
      "Areas de comedor.",
      "Wifi.",
      "Cafe en la manana.",
      "Corriente electrica solo para celulares.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Rio dentro de la propiedad.",
      "Piscina dentro de la propiedad.",
      "Fogata: Si necesitas que se recolecte la lena por ti, RD$ 500.00."
    ],
    "nearby": [
      "Parque de Paint Ball: A 2 minutos de distancia.",
      "Laguna Gri Gri y Rio San Juan: A 55 minutos de distancia.",
      "Monkey Jungle: A 45 minutos.",
      "Playa Encuentro (centro de surf): A 27 minutos.",
      "Playa Cabarete y Cuevas de Cabarete (centro de Kite): A 15 minutos.",
      "Ideal para rutas de senderismo, aventuras, bicicletas, kiteboard, windsurf, surf, stand up paddleboard, motocross, 4 wheels, y buggies."
    ],
    "pricing": [
      "Plan sencillo: RD$ 700.00 por persona (incluye uso de espacio).",
      "Plan semi full: RD$ 1,000.00 por persona (incluye cafe y desayuno).",
      "Plan full: RD$ 1,700.00 por persona (incluye desayuno, almuerzo y refrigerios).",
      "Ninos menores de 11 anos: Gratis, presentando un documento que valide la edad.",
      "Costo de las mascotas: RD$ 50.00 por cada una.",
      "Check in: 2:00 pm",
      "Check out: 12:00 pm",
      "Cerrado: Los miercoles",
      "Equipos de camping de alquiler: Con retiro en Santo Domingo disponibles, solicitar catalogo en caso de necesitar.",
      "Area de Entrada y Parqueos:",
      "Para los campistas que desean salir de noche, se tiene un deposito reembolsable de RD$ 1,500.00 para el prestamo del control de puerta de acceso."
    ],
    "lodging": [
      "Precio: RD$ 4,000.00 por noche.",
      "Capacidad: 1 a 2 personas.",
      "Equipamiento:",
      "Wifi.",
      "1 cama full.",
      "Electricidad.",
      "Acceso a todas las instalaciones de la propiedad y juegos recreativos.",
      "Precio: RD$ 1,200.00 por persona.",
      "Capacidad: 4 personas.",
      "Wifi gratis.",
      "2 camas twin.",
      "Bano compartido fuera de la habitacion con agua caliente."
    ],
    "extraActivities": [
      "Tours con reservacion previa 2 semanas antes, disponibles a partir de 8 personas.",
      "Paint ball: RD$ 2,000.00 por persona (equipos y refrigerio, 200 tiros).",
      "Tour en caballo por la montana: RD$ 3,800.00 por persona (recorrido por rio y refrigerio).",
      "Entrada, transporte y refrigerio a Monkey Jungle: RD$ 4,000.00 por persona.",
      "Paddle Board: RD$ 1,000.00 por tabla.",
      "Cuevas de Cabarete con transporte: RD$ 1,800.00 por persona.",
      "Recorrido River Tubing y refrigerio: RD$ 2,000.00 por persona."
    ],
    "food": [
      "Restaurante y bar dentro del campamento, abierto al publico sabados y domingos (dias de semana bajo reserva previa).",
      "Fogon de uso gratuito: Lena y utensilios alquilados por RD$ 500.00.",
      "BBQ de uso gratuito: No incluye utensilios ni carbon.",
      "Cocina (kitchenette): Cargo extra por uso y gas RD$ 500.00 por grupo o RD$ 100.00 por persona.",
      "Varios restaurantes a menos de 20 minutos de la propiedad.",
      "Se facilitan los numeros para pedir a domicilio en el campamento."
    ],
    "whatToBring": [],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti. No se permite musica de 10:00 pm a 6:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No tomar frutas, tallos, plantas, etc., sin autorizacion.",
      "No mover las instalaciones de su lugar, romper o maltratar. Avisar si se rompe algo o pasa un accidente.",
      "No tocar las plantaciones y los animales sin autorizacion.",
      "Las mascotas deben de tener correa y recoger sus desechos.",
      "No se permiten armas blancas o de fuego.",
      "Mantener las areas limpias que has utilizado.",
      "No esta permitido colocar las casas de campana en terrazas techadas, de ser necesario, pedir ayuda al encargado del campamento.",
      "No tirar colillas de cigarrillos, tapas, servilletas, etc., en las areas."
    ],
    "reservation": []
  },
  "comatillo": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 2200,
    "priceNote": "Adultos desde RD$ 2,200.00 por persona por noche.",
    "capacity": 12,
    "distance": "1 hora y 44 minutos desde Santo Domingo",
    "intro": "Comatillo combina Pets Friendly: Se permiten mascotas. Restaurante y 3 bares dentro del campamento. No hay acceso en transporte publico. Capacidad maxima dentro del campamento: 500 personas. Banos y duchas compartidos. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Restaurante y 3 bares dentro del campamento.",
      "No hay acceso en transporte publico.",
      "Capacidad maxima dentro del campamento: 500 personas.",
      "Distancia desde Santo Domingo: 1 hora y 44 minutos.",
      "Opcion de pasadia disponible"
    ],
    "includes": [
      "Banos y duchas compartidos.",
      "Areas infantiles y columpios.",
      "Billar, futbolito y area de juegos.",
      "Juegos de mesa.",
      "Cancha de volleyball.",
      "Areas de comedor.",
      "Fogata: Los sabados.",
      "Gazebo.",
      "Corriente electrica para celulares.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Pets friendly."
    ],
    "nearby": [
      "Salto Alto: A 8 minutos de distancia.",
      "El Pez de Bayaguana: A 28 minutos de distancia.",
      "Balneario Sierra de Agua: A 4 minutos de distancia.",
      "Salto de Socoa: A 1 hora de distancia.",
      "Ideal para rutas de senderismo, aventuras, Rutas MTB, bicicletas, motocross, 4 wheels y buggies."
    ],
    "pricing": [
      "Check in: 3:00 PM",
      "Check out: 12:00 PM",
      "Adultos: RD$ 2,200.00 por persona por noche.",
      "Ninos (3-11 anos): RD$ 1,900.00 por persona por noche."
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [
      "Contamos con restaurante y 3 bares dentro del campamento.",
      "BBQ disponible con cargo extra: USD $10.00.",
      "No contamos con cocina, debes llevar tus articulos para cocinar en caso de que lo necesites."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Toallas.",
      "Sabanas y colchoneta o sleeping bag.",
      "Casa de campana.",
      "Linternas.",
      "Abrigo."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti. No se permite musica de 10:00 pm a 6:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion.",
      "Las mascotas deben de tener correa, recoger sus desechos.",
      "No se permiten armas blancas o de fuego.",
      "Mantener las areas limpias que has utilizado.",
      "No esta permitido colocar las casas de campana en los quioscos.",
      "No tirar colillas de cigarrillos, tapas, servilletas, etc., en las areas."
    ],
    "reservation": []
  },
  "constanza": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceNote": "Costo de entrada por pareja: RD$ 3,000.00.",
    "intro": "Constanza combina Pets Friendly: Se permiten mascotas. Restaurante, bar, mini market y gift shop dentro del campamento. Zip Line dentro del campamento. Apreciacion de animales de granja. Fogata: Se enciende de cortesia los sabados; otros dias, debes comprar la madera (RD$ 100.00). Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Restaurante, bar, mini market y gift shop dentro del campamento.",
      "Zip Line dentro del campamento.",
      "Apreciacion de animales de granja.",
      "Suficiente senal de celulares.",
      "Capacidad maxima dentro del campamento: 100 personas."
    ],
    "includes": [
      "Fogata: Se enciende de cortesia los sabados; otros dias, debes comprar la madera (RD$ 100.00).",
      "Desayuno dominicano.",
      "Banos y duchas compartidos.",
      "Columpios.",
      "Trampolin.",
      "Zip Line (cargo extra).",
      "Billar, ping pong y juegos de mesa.",
      "Cancha de futbol y volleyball.",
      "Areas de comedor.",
      "Chimenea.",
      "Area de fogata.",
      "Corriente electrica para celulares."
    ],
    "nearby": [
      "Salto de Aguas Blancas: A 45 minutos de distancia.",
      "Las Piramides de Valle Nuevo: A 1 hora de distancia.",
      "Ideal para rutas de senderismo, aventuras, Rutas MTB, bicicletas, motocross, 4 wheels y buggies."
    ],
    "pricing": [
      "Costo de entrada por pareja: RD$ 3,000.00.",
      "Ninos de 0 a 2 anos: Gratis.",
      "Check in: 3:00 pm",
      "Check out: 1:00 pm",
      "Ziplines: RD$ 350.00 por persona",
      "Caballos: RD$ 500.00 por hora"
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [
      "Contamos con restaurante, mini market y BBQ dentro del campamento.",
      "El BBQ debe reservarse previamente para su uso (no incluye el carbon).",
      "Varios restaurantes cercanos al campamento para degustar la gastronomia local."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Toallas.",
      "Sabanas y colchoneta o sleeping bag.",
      "Linternas.",
      "Abrigo.",
      "Debes Tener en Cuenta lo Siguiente (Equipos de Camping):",
      "Eres responsable de los equipos que alquiles, asi como del espacio asignado.",
      "La limpieza sencilla de los equipos corre por parte del campamento, pero si el sucio es notable (manchas, basuras, tierra, etc.), el cliente debe hacer la limpieza correspondiente o pagar el costo de limpieza."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti. No se permite musica de 10:00 pm a 6:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion.",
      "Las mascotas deben de tener correa y recoger sus desechos.",
      "No se permiten armas blancas o de fuego.",
      "Mantener las areas limpias que has utilizado.",
      "No esta permitido colocar las casas de campana en los quioscos.",
      "No tirar colillas de cigarrillos, tapas, servilletas, etc., en las areas."
    ],
    "reservation": []
  },
  "el-valle": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 400,
    "priceNote": "Costo de entrada ninos (3 a 11 anos): RD$ 400.00 por persona.",
    "distance": "3 horas desde Santo Domingo",
    "intro": "El Valle combina Pets Friendly: Se permiten mascotas. Restaurante con costo adicional. Frente a la playa. Excursiones disponibles con costo adicional. Bano y ducha. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Restaurante con costo adicional.",
      "Frente a la playa.",
      "Excursiones disponibles con costo adicional.",
      "Area de masajes disponible con costo adicional.",
      "Capacidad maxima dentro del campamento: 100 personas.",
      "Distancia desde Santo Domingo: 3 horas."
    ],
    "includes": [
      "Bano y ducha.",
      "Areas para camping.",
      "Luz en las instalaciones y conectores de electricidad en las areas comunes.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Fogata con costo adicional: RD$ 1,000 (pequena) y RD$ 1,500 (grande)."
    ],
    "nearby": [
      "Playa El Valle: Frente a la propiedad.",
      "Zipline: A 8 minutos de distancia.",
      "Cascada Lulu: A 9 minutos de distancia.",
      "Ideal para rutas de senderismo, aventuras, Rutas MTB, bicicletas, motocross, 4 wheels y buggies."
    ],
    "pricing": [
      "Costo de entrada ninos (3 a 11 anos): RD$ 400.00 por persona.",
      "Ninos menores de 2 anos: Gratis.",
      "Check in: 9:00 am hasta las 7:00 pm",
      "Check out: 5:00 pm"
    ],
    "lodging": [
      "Casas de Campanas para parejas:",
      "RD$ 1,500 (carpas para 2 personas).",
      "RD$ 2,000 (carpas para 4 personas)."
    ],
    "extraActivities": [
      "Tours con reservacion previa 1 semana antes, disponibles a partir de 10 personas.",
      "Viaje a caballo:",
      "Cascada El Castano y Fabrica de chocolate en Arroyo Seco: RD$ 1,200.00 por persona.",
      "Playa Ermitano:",
      "RD$ 1,900.00 por persona con comida incluida.",
      "RD$ 1,200.00 por persona sin comida (solo para grupos de 10 personas o mas).",
      "RD$ 1,400.00 por persona sin comida (solo para grupos de 9 personas o menos).",
      "Viaje a caballo por la playa: RD$ 500.00 por persona por 30 minutos.",
      "Masajes: RD$ 1,500.00 por 1 hora."
    ],
    "food": [],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Wipes.",
      "Jabon personal.",
      "Ropa fresca y comoda para el dia.",
      "Ropa abrigada para la noche.",
      "Traje de bano.",
      "Toallas.",
      "Ropa de cama."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion; esto podria ocasionar sanciones legales y pagos de multas."
    ],
    "reservation": []
  },
  "hato-mayor": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 700,
    "priceNote": "Costo por noche adultos: RD$ 700.00 p/p.",
    "distance": "2 horas y 50 minutos desde Santo Domingo",
    "intro": "Hato Mayor combina Pets Friendly: Se permiten mascotas. Rio dentro de la propiedad. Restaurante y Gift shop dentro del campamento. Capacidad maxima dentro del campamento: 500 personas. Banos y duchas compartidos. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Rio dentro de la propiedad.",
      "Restaurante y Gift shop dentro del campamento.",
      "Capacidad maxima dentro del campamento: 500 personas.",
      "Distancia desde Santo Domingo: 2 horas y 50 minutos."
    ],
    "includes": [
      "Banos y duchas compartidos.",
      "Areas de comedor.",
      "Wifi.",
      "Tour de Cafe, Cacao y Ambar.",
      "Fogata.",
      "Uso de kayak (costo adicional).",
      "Bano con barro terapeutico.",
      "Corriente electrica para celulares.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Rio dentro de la propiedad.",
      "Salvavidas (costo adicional)."
    ],
    "nearby": [
      "Parque Nacional Los Haitises: A 10 minutos de la propiedad.",
      "Cascadas Virgenes: A 20 minutos de distancia.",
      "Sabana de la Mar: A 30 minutos de la propiedad.",
      "Rio Cano Hondo y Bahia de San Lorenzo: A 50 minutos de la propiedad.",
      "Ideal para rutas de senderismo, trekking, rutas holisticas, rutas Off Road, motocross, aventuras, 4 wheels y buggies."
    ],
    "pricing": [
      "Check in: 9:00 am",
      "Check out: 5:00 pm",
      "Costo por noche adultos: RD$ 700.00 p/p.",
      "Costo por noche ninos: RD$ 500.00 p/p (de 3 a 10 anos).",
      "Planes Alimenticios Tipo Buffet:"
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Toallas, sabanas y almohadas.",
      "Casa de campana.",
      "Linternas.",
      "Abrigo."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "No se permite el uso de Hookas.",
      "Musica moderada, la musica solo para ti. No se permite musica de 9:00 pm a 8:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar ni tocar los arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "Las mascotas deben de tener correa, recoger sus desechos.",
      "No se permiten armas blancas o de fuego.",
      "Mantener las areas limpias que has utilizado.",
      "No tirar colillas de cigarrillos, tapas, servilletas, etc., en las areas.",
      "Parqueos solo en el area especificada."
    ],
    "reservation": []
  },
  "jamao": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 4800,
    "priceNote": "RD$ 4,800.00 por 1 persona.",
    "distance": "2 horas y 55 minutos desde Santo Domingo",
    "intro": "Jamao al Norte combina Rio dentro de la propiedad. Restaurante y bar dentro del campamento. Se requiere 4x4 para llegar al campamento. Pets Friendly: Se permiten mascotas. Desayuno dominicano. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Rio dentro de la propiedad.",
      "Restaurante y bar dentro del campamento.",
      "Se requiere 4x4 para llegar al campamento.",
      "Pets Friendly: Se permiten mascotas.",
      "Campamento de Glampings.",
      "Capacidad maxima dentro del campamento: 24 personas en glamping.",
      "Distancia desde Santo Domingo: 2 horas y 55 minutos."
    ],
    "includes": [
      "Desayuno dominicano.",
      "Wifi.",
      "Bar y restaurant (costo adicional).",
      "Hamacas.",
      "Chaise Lounge.",
      "Juegos de mesa.",
      "Fogata.",
      "Banos y duchas compartidos.",
      "Areas de comedor.",
      "Mesas de picnic.",
      "Cancha de volleyball.",
      "Corriente electrica para celulares."
    ],
    "nearby": [
      "Balneario El Chorro: A 7 minutos de distancia.",
      "Balneario de Boca de Partido: A 7 minutos de distancia.",
      "Confluencia del Rio Yasica: A 14 minutos de distancia.",
      "Ideal para rutas de senderismo, aventuras, bicicletas, kayak, tubing, motocross, 4 wheels y buggies."
    ],
    "pricing": [
      "Horario: De 10:00 am a 6:00 pm."
    ],
    "lodging": [
      "Capacidad maxima: 4 adultos",
      "Precios por noche:",
      "RD$ 4,800.00 por 1 persona.",
      "RD$ 6,600.00 por 2 personas.",
      "RD$ 9,900.00 por 3 personas.",
      "RD$ 12,300.00 por 4 personas.",
      "RD$ 2,400.00 por ninos de 4 a 10 anos."
    ],
    "extraActivities": [],
    "food": [
      "Restaurante y Bar abierto de 8:00 am a 10:00 pm con cargo extra.",
      "Excursiones Guiadas Disponibles:",
      "Las excursiones incluyen chalecos salvavidas y guias expertos.",
      "Lista de Excursiones:",
      "Canyoning Canon de Arroyo Frio: RD$ 1,800.00 p/p.",
      "Canyoning en Cola de Pato: RD$ 1,600.00 p/p.",
      "Senderismo en Los Tinajones: RD$ 1,450.00 p/p.",
      "Senderismo en Las Caobas: RD$ 1,500.00 p/p.",
      "Rapel en Hongo Magico: RD$ 2,300.00 p/p.",
      "Visita a Rio Partido: RD$ 2,300.00 p/p.",
      "Cabalgata: RD$ 1,600.00 p/p.",
      "Tubing: RD$ 1,500.00 p/p."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Toallas.",
      "Linternas.",
      "Abrigo."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "No se permiten armas blancas o de fuego.",
      "Musica moderada, la musica solo para ti. No se permite musica de 9:00 pm a 8:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "Mantener las areas limpias que has utilizado.",
      "No tocar las plantaciones y los animales sin autorizacion. No talar arboles o alterar la flora y fauna.",
      "No tirar colillas de cigarrillos, tapas, servilletas, etc., en las areas.",
      "Parqueos solo en el area especificada.",
      "Nadas bajo tu propio riesgo en el rio, los menores de edad deben estar acompanados de un adulto."
    ],
    "reservation": []
  },
  "jarabacoa": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 600,
    "priceNote": "Costo de adultos: RD$ 600.00 por persona.",
    "distance": "2 horas y 20 minutos desde Santo Domingo",
    "intro": "Jarabacoa combina Pets Friendly: Se permiten mascotas. Parapente con costo adicional. Capacidad maxima dentro del campamento: 50 personas. Distancia desde Santo Domingo: 2 horas y 20 minutos. Banos con ducha. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Parapente con costo adicional.",
      "Capacidad maxima dentro del campamento: 50 personas.",
      "Distancia desde Santo Domingo: 2 horas y 20 minutos."
    ],
    "includes": [
      "Banos con ducha.",
      "Hamaca.",
      "Areas de comedor.",
      "Areas para camping.",
      "Area de fogatas.",
      "Wifi gratis.",
      "Cocina equipada con 2 estufas y una nevera.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Areas de picnic.",
      "Luz en las instalaciones y conectores de electricidad en las areas comunes."
    ],
    "nearby": [
      "Salto Baiguate: A 5 minutos de distancia.",
      "Salto de Jimenoa: A 15 minutos de distancia.",
      "Salto de los Monjes: A 20 minutos de distancia.",
      "Ideal para rutas de senderismo, aventuras, Rutas MTB, bicicletas, motocross, 4 wheels y buggies."
    ],
    "pricing": [
      "Costo de adultos: RD$ 600.00 por persona.",
      "Costo de ninos (3 a 7 anos): RD$ 400.00 por persona.",
      "Check in: 9:00 am hasta las 8:00 pm",
      "Check out: 6:00 pm"
    ],
    "lodging": [
      "Capacidad maxima: 2 personas.",
      "Precio: RD$ 2,500.00 por noche.",
      "Precio: RD$ 1,500.00 por pareja.",
      "Casa de Campana: Para 1 o 2 personas RD$ 1,500."
    ],
    "extraActivities": [],
    "food": [
      "Contamos con BBQ (debes de traer el carbon) y cocina equipada para que puedas preparar tus alimentos.",
      "Hay varios restaurantes cercanos del campamento, los cuales cuentan con delivery.",
      "Servicios diarios bajo reserva previa:",
      "Desayuno: RD$ 300 por persona.",
      "Almuerzo: RD$ 450 por persona.",
      "Parapente: RD$ 3,500.00 por persona (salidas programadas solo cuando hay buen viento)."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Wipes.",
      "Jabon personal.",
      "Ropa fresca y comoda para el dia.",
      "Ropa abrigada para la noche.",
      "Traje de bano.",
      "Toallas.",
      "Ropa de cama."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion; esto podria ocasionar sanciones legales y pagos de multas."
    ],
    "reservation": []
  },
  "montellano": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 900,
    "priceNote": "Adultos desde RD$ 900.00 por noche.",
    "distance": "3 horas y 20 minutos desde Santo Domingo",
    "intro": "Montellano combina No hay acceso en transporte publico. Pets Friendly: Se permiten mascotas. Restaurante dentro del campamento. Rio dentro del campamento. Banos y duchas compartidos. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "No hay acceso en transporte publico.",
      "Pets Friendly: Se permiten mascotas.",
      "Restaurante dentro del campamento.",
      "Rio dentro del campamento.",
      "Area de juegos para ninos.",
      "Capacidad maxima dentro de la propiedad: 50 personas.",
      "Distancia desde Santo Domingo: 3 horas y 20 minutos."
    ],
    "includes": [
      "Banos y duchas compartidos.",
      "Columpios.",
      "Areas de comedor.",
      "Fogones.",
      "Cocina equipada.",
      "Hamacas.",
      "Tubing.",
      "Dominos.",
      "Corriente electrica para celulares.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Pets friendly."
    ],
    "nearby": [
      "Playa Sosua: A 20 minutos de distancia.",
      "Rio Sonador: A 25 minutos de distancia.",
      "Monkey Jungle: A 50 minutos de distancia.",
      "Ideal para rutas de senderismo, aventuras, Rutas MTB, bicicletas, motocross, 4 wheels y buggies."
    ],
    "pricing": [
      "Estos precios incluyen el desayuno",
      "Si traes tus equipos de camping:",
      "Adultos: RD$ 900.00 por noche.",
      "Ninos (6 a 12 anos): RD$ 500.00 por noche.",
      "Si no tienes equipos de camping:",
      "Adultos: RD$ 1,200.00 por noche.",
      "Ninos (6 a 12 anos): RD$ 650.00 por noche (incluye casa de campana y colchonetas instaladas en el campamento).",
      "Check in: 3:30 pm",
      "Check out: 5:00 pm",
      "Cerrado: Lunes",
      "Costo: RD$ 800 por persona, almuerzo incluido."
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [
      "Contamos con restaurante dentro del campamento.",
      "Cocina equipada y fogon disponibles para tu uso.",
      "No cuenta con menu, comida criolla.",
      "Los costos dependeran de la cantidad de personas y la comida elegida.",
      "Venta de miel organica, cosechada de nuestro panal."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Toallas.",
      "Sabanas y colchoneta o sleeping bag.",
      "Casa de campana.",
      "Linternas.",
      "Abrigo.",
      "Como Hacer la Reserva:",
      "Contacta al Staff de Campeach informandole la fecha de tu reserva (minimo 5 dias antes de la entrada), cantidad de personas y plan seleccionado."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti. No se permite musica de 10:00 pm a 6:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion.",
      "Las mascotas deben de tener correa, recoger sus desechos.",
      "No se permiten armas blancas o de fuego.",
      "Mantener las areas limpias que has utilizado.",
      "No esta permitido colocar las casas de campana en los quioscos.",
      "No tirar colillas de cigarrillos, tapas, servilletas, etc., en las areas."
    ],
    "reservation": []
  },
  "los-cacaos": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "distance": "1 hora y 55 minutos desde Santo Domingo",
    "intro": "Los Cacaos combina Campamento \"Todo Incluido\". Rio frente al area de camping. Restaurante y bar dentro del campamento. No se requiere 4x4; cualquier tipo de vehiculo puede llegar al campamento. Banos y duchas compartidos. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Campamento \"Todo Incluido\".",
      "Rio frente al area de camping.",
      "Restaurante y bar dentro del campamento.",
      "No se requiere 4x4; cualquier tipo de vehiculo puede llegar al campamento.",
      "Transporte hacia el campamento disponible por costo extra.",
      "Disponible: 4 wheels y buggies por costo extra.",
      "Capacidad maxima dentro del campamento: 50 personas.",
      "Distancia desde Santo Domingo: 1 hora y 55 minutos."
    ],
    "includes": [
      "Banos y duchas compartidos.",
      "Areas de comedor.",
      "Wifi.",
      "Karaoke y bar.",
      "Hamacas.",
      "Juegos de mesa.",
      "Fogata.",
      "Mesas de picnic.",
      "Chaise Lounge.",
      "Corriente electrica para celulares.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas."
    ],
    "nearby": [
      "Los charcos de Nizao, Cascada La Culebra, El Tabernaculo La Piedra, Arroyo Los Reyitos y Cascada Taina: A 45 minutos de distancia.",
      "Sendero al Valle de Dios y Rio Rojo: A 10 minutos de distancia.",
      "Ideal para rutas de senderismo, aventuras, bicicletas, motocross, 4 wheels y buggies."
    ],
    "pricing": [],
    "lodging": [
      "Capacidad maxima: 2 personas.",
      "Capacidad maxima: 2 adultos + 1 nino por carpa."
    ],
    "extraActivities": [],
    "food": [
      "Menu: Totalmente campesino y preestablecido, no se ofrece servicio a la carta.",
      "Recomendacion: Llevar picaderas y cualquier dieta que ingieran.",
      "Bar abierto: De 10:00 am a 11:00 pm con cargo extra.",
      "Llegadas a las 11:00 am: Incluyen el almuerzo de ese dia RD$ 600.00 extra por persona. Se debe notificar con un minimo de 24 horas.",
      "Menu de alimentos (cocina a lena):",
      "Desayuno (8:20 am a 9:20 am): Pan tostado, queso, huevos hervidos, chocolate y frutas.",
      "Almuerzo (12:20 pm a 2:20 pm): Arroz blanco, habichuelas guisadas, ensalada rusa o pasta, carne de cerdo o pollo guisado, jugos naturales y agua.",
      "Cena (8:20 pm a 9:20 pm): Mangu con huevo, salami frito y cebollitas.",
      "No garantizamos la disponibilidad de alimentos fuera de nuestros horarios establecidos, salvo aviso previo por parte del huesped.",
      "Excursiones Guiadas:",
      "Las excursiones incluyen chalecos salvavidas, seguridad y guias expertos.",
      "Precio: RD$ 800.00 por persona."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Toallas.",
      "Sabanas y almohadas.",
      "Linternas.",
      "Abrigo."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti. No se permite musica de 9:00 pm a 8:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion.",
      "No se permiten armas blancas o de fuego.",
      "Mantener las areas limpias que has utilizado.",
      "No tirar colillas de cigarrillos, tapas, servilletas, etc., en las areas.",
      "Parqueos solo en el area especificada.",
      "No se aceptan mascotas."
    ],
    "reservation": []
  },
  "pinar-del-valle": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 1500,
    "priceNote": "4 a 5 personas: RD$ 1,500 por persona.",
    "distance": "2 horas y 47 minutos desde Santo Domingo",
    "intro": "Pinar del Valle combina Dog-friendly: Se permiten perros. No hay acceso en transporte publico. Listado de restaurantes y colmados que ofrecen delivery. Alquiler exclusivo de la propiedad completa (no es compartido, tendras el lugar solo para tu grupo). 3 banos con inodoro. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Dog-friendly: Se permiten perros.",
      "No hay acceso en transporte publico.",
      "Listado de restaurantes y colmados que ofrecen delivery.",
      "Alquiler exclusivo de la propiedad completa (no es compartido, tendras el lugar solo para tu grupo).",
      "Miradores y senderos escalonados (aprox. 1 km de distancia).",
      "Altura: 1,200 metros sobre el nivel del mar.",
      "Capacidad maxima dentro del campamento: 30 personas.",
      "Distancia desde Santo Domingo: 2 horas y 47 minutos."
    ],
    "includes": [
      "3 banos con inodoro.",
      "2 duchas al aire libre (una con calentador).",
      "4 lavamanos/fregaderos.",
      "Estufa de 4 hornillas con tanque de gas propano.",
      "BBQ de ladrillo techado.",
      "1 botellon de agua potable.",
      "Mesas tipo picnic en diferentes areas.",
      "Areas sociales y recreativas.",
      "Iluminacion nocturna y camaras de seguridad con grabacion las 24 horas.",
      "Verja de seguridad alrededor de la propiedad completa.",
      "Empleado para asistirles cuando sea necesario.",
      "WIFI."
    ],
    "nearby": [
      "Parque Nacional Valle Nuevo: A 1 hora y 20 minutos de distancia.",
      "Salto de Aguas Blancas: A 40 minutos de distancia.",
      "Ideal para rutas de senderismo, aventuras, Rutas MTB, bicicletas, motocross, 4 wheels y buggies."
    ],
    "pricing": [
      "Minimo: 4 personas para la reserva.",
      "Check in: 2:00 pm",
      "Check out: 12:00 pm",
      "Precios:",
      "4 a 5 personas: RD$ 1,500 por persona.",
      "6 personas: RD$ 1,300 por persona.",
      "7 personas: RD$ 1,200 por persona.",
      "8 a 12 personas: RD$ 1,000 por persona.",
      "13 a 30 personas: RD$ 900 por persona.",
      "Los ninos menores de 12 anos no pagan (1 nino gratis por adulto, presentando un documento que verifique la edad).",
      "Paquete Completo para Acampar (Precios por Noche):",
      "Capacidad maxima en carpas: 12 personas."
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [
      "Cocina techada y equipada con:",
      "Estufa de 4 hornillas con tanque de gas propano.",
      "Fregadero y panos.",
      "1 olla, 1 sarten y 1 sarten al grill.",
      "Cuberteria, 1 greca mediana y 1 set de cuberteria para BBQ.",
      "Banco de madera.",
      "Parrilla para BBQ (debes de llevar el carbon).",
      "Como Hacer la Reserva:",
      "Contacta al Staff de Campeach informandole la fecha de tu reserva (minimo 3 dias antes de la entrada), cantidad de personas y plan seleccionado.",
      "Se requiere el pago del 100% para formalizar la reserva del espacio.",
      "Al momento de recibir la factura de los servicios contratados, aceptara la misma como comprobante de constancia de la reserva y responsabilidades dentro de espacios reservado plasmadas en este catalogo.",
      "El titular del alquiler debe de ser mayor de 18 anos, tener documento de identificacion, y sera el responsable de cualquier eventualidad que surja durante su estadia."
    ],
    "whatToBring": [],
    "rules": [],
    "reservation": []
  },
  "punta-cana": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceNote": "Costo de entrada ninos (2 a 9 anos): RD$ 700.00.",
    "distance": "3 horas y 30 minutos desde Santo Domingo",
    "intro": "Punta Cana combina Pets Friendly: Se permiten mascotas. Playa frente al area de camping. Restaurante, bar y coffee shop dentro del campamento. Apreciacion de nacimientos de tortugas y cangrejos. Desayuno continental. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Playa frente al area de camping.",
      "Restaurante, bar y coffee shop dentro del campamento.",
      "Apreciacion de nacimientos de tortugas y cangrejos.",
      "No hay acceso en transporte publico.",
      "No hay delivery.",
      "Suficiente senal de Claro y Altice.",
      "Capacidad maxima dentro del campamento: 50 personas.",
      "Distancia desde Santo Domingo: 3 horas y 30 minutos."
    ],
    "includes": [
      "Desayuno continental.",
      "Agua y cafe ilimitados durante la estancia.",
      "WIFI.",
      "Banos compartidos.",
      "Duchas ecologicas.",
      "Mecedoras.",
      "Columpios.",
      "Areas de comedor.",
      "Areas de picnic frente a la playa.",
      "Area de fogata.",
      "Corriente electrica para celulares.",
      "Campamento completamente ecologico."
    ],
    "nearby": [
      "Montana Redonda: A 1 hora de distancia.",
      "Monkeyland: A 40 minutos de distancia.",
      "Rio desembocadura de Maimon: A 20 minutos de distancia.",
      "Ideal para rutas de senderismo, caminatas y relajacion."
    ],
    "pricing": [
      "Estos costos no incluyen las casas de campanas ni demas equipos.",
      "Costo de entrada ninos (2 a 9 anos): RD$ 700.00.",
      "Ninos menores de 2 anos: Gratis.",
      "Precios de Planes por Dia:",
      "Las carpas se encuentran instaladas en el campamento, no incluyen colchones ni sabanas.",
      "Para 2 personas: RD$ 3,800.00"
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [
      "Contamos con restaurante, bar y coffee shop dentro del campamento.",
      "No hay restaurantes cercanos al campamento.",
      "No esta permitido llevar ningun tipo de comida o bebida.",
      "Descorche de bebidas: RD$ 500 por botella, sin importar el contenido o tamano."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Traje de bano y toallas.",
      "Sabanas y colchoneta o sleeping bag.",
      "Linternas.",
      "Abrigo."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti. No se permite musica de 9:00 pm a 8:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly. Debes llevarte tus desechos inorganicos, evitar llevar plasticos, foam, etc.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion, esto podria ocasionar sanciones legales y pagos de multas.",
      "No tirar colillas de cigarrillos, tapas, servilletas, etc., en la playa.",
      "Reglas adicionales:",
      "No se permiten neveritas de ningun tamano.",
      "Las mascotas deben tener correa y debes recoger sus desechos.",
      "No BBQ.",
      "No estufas portatiles."
    ],
    "reservation": []
  },
  "rincon-samana": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 700,
    "priceNote": "Precio por adultos: RD$ 700.00 por noche, llevando la casa de campana.",
    "distance": "3 horas y 35 minutos desde Santo Domingo",
    "intro": "Samana combina Pets Friendly: Se permiten mascotas. Piscina dentro de la propiedad. Campamento Holistico. Hay acceso en transporte publico. Piscina. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Piscina dentro de la propiedad.",
      "Campamento Holistico.",
      "Hay acceso en transporte publico.",
      "Ideal para rutas de senderismo y bicicletas.",
      "Capacidad maxima dentro del campamento: 50 personas.",
      "Distancia desde Santo Domingo: 3 horas y 35 minutos."
    ],
    "includes": [
      "Piscina.",
      "Banos.",
      "Hamacas.",
      "Area de comedor.",
      "Areas sociales y recreativas.",
      "Areas para camping.",
      "Campamento completamente ecologico.",
      "Areas de fogatas.",
      "Caminos de senderismo.",
      "Parqueos en propiedad privada.",
      "WIFI en las areas comunes.",
      "Nota: La basura se va contigo a casa, favor de no dejarla en la propiedad."
    ],
    "nearby": [
      "Playa Rincon: A 15 minutos de distancia.",
      "Playa Fronton: A 36 minutos de distancia.",
      "Rio Cano Frio: A 11 minutos de distancia.",
      "Cueva Duarte: A 25 minutos de distancia.",
      "Las Terrenas: A 90 minutos de distancia.",
      "Ideal para rutas de senderismo, aventuras, Rutas MTB, bicicletas, motocross, 4 wheels y buggies."
    ],
    "pricing": [
      "Estos costos no incluyen las casas de campanas ni demas equipos.",
      "Precio por adultos: RD$ 700.00 por noche, llevando la casa de campana.",
      "Precio por nino (5 a 15 anos): RD$ 350.00 por noche.",
      "Horario de entrada: Entre 10:00 am a 7:00 pm",
      "Horario de salida: 2:00 pm",
      "Equipos de camping de alquiler con retiro en Santo Domingo disponibles, solicitar catalogo en caso de necesitar.",
      "Cabana Ecologica (Cuyaya):",
      "Desde: RD$ 5,000.00 con capacidad para 4 personas.",
      "Precios:",
      "RD$ 5,000.00 por pareja por noche.",
      "RD$ 6,600.00 para 3 personas por noche.",
      "RD$ 8,200.00 para 4 personas por noche."
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [
      "Desayunos:",
      "Continental: $10 USD por persona.",
      "Dominicano: $12 USD por persona.",
      "Almuerzos: No se ofrecen para que el cliente salga y asi desarrolle el turismo comunitario.",
      "Cenas: El precio varia de acuerdo a la seleccion del menu disponible ese dia.",
      "Cocina de alquiler: Contamos con una cocina de alquiler para que puedas preparar tus propias comidas por RD$ 50.00 por persona por preparacion de alimentos (Ej.: Desayuno para 2 personas RD$ 100.00)."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Botella de agua.",
      "Vasos, platos y cubiertos reusables.",
      "Pasta y cepillo dental.",
      "Papel higienico y/o wipes.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Traje de bano y toallas.",
      "Bolsas de basura.",
      "La basura se va contigo a casa, favor de no dejarla en la propiedad."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion, esto podria ocasionar sanciones legales y pagos de multas."
    ],
    "reservation": [
      "Contacta al Staff de Campeach informandole la fecha de tu reserva (minimo 3 dias antes de la entrada), cantidad de personas y carpas que necesitas, asi como los equipos de camping adicionales que desees.",
      "Se requiere el pago del 100% para formalizar la reserva del espacio.",
      "Al momento de recibir la factura de los servicios contratados, aceptara la misma como comprobante de constancia de la reserva y responsabilidades dentro de campamento plasmadas en este catalogo.",
      "Politicas de cancelacion: No es reembolsable, se modifica la fecha de acuerdo a la disponibilidad del mismo."
    ]
  },
  "san-cristobal": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 1600,
    "priceNote": "Adultos desde RD$ 1,600.00 por persona, incluye plan de alimentos.",
    "distance": "46 minutos desde Santo Domingo",
    "intro": "San Cristobal combina Campamento con opcion de TODO INCLUIDO. Pets Friendly: Se permiten mascotas. Piscina, bar, tienda de snacks y restaurante dentro del campamento. No hay acceso en transporte publico. Banos y duchas compartidos. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Campamento con opcion de TODO INCLUIDO.",
      "Pets Friendly: Se permiten mascotas.",
      "Piscina, bar, tienda de snacks y restaurante dentro del campamento.",
      "No hay acceso en transporte publico.",
      "Capacidad maxima dentro del campamento: 50 personas.",
      "Distancia desde Santo Domingo: 46 minutos."
    ],
    "includes": [
      "Banos y duchas compartidos.",
      "Columpios y pared de escalar.",
      "Cancha de basketball.",
      "Areas de comedor.",
      "Areas de picnic.",
      "Fogata.",
      "Piscina.",
      "Juegos de mesa.",
      "Corriente electrica para celulares.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Piscina dentro de la propiedad."
    ],
    "nearby": [
      "Playa Palenque: A 1 hora de distancia (7 km).",
      "Playa Najayo: A 10 minutos de distancia (7 km).",
      "Ingenio Boca de Nigua: A 25 minutos de distancia.",
      "Casa de Caoba, Balneario La Toma y Cuevas del Pomier: A 35 minutos de distancia.",
      "Las Dunas de Bani: A 1 hora de distancia.",
      "Ideal para rutas de senderismo, aventuras, bicicletas, holisticas, relajacion."
    ],
    "pricing": [
      "Check in: 2:00 PM",
      "Check out: 3:00 PM",
      "Planes llevando tu equipo de camping:",
      "Adultos: RD$ 1,600.00 por persona, incluye plan de alimentos.",
      "Ninos (4 a 10 anos): RD$ 1,300.00 por persona, incluye plan de alimentos.",
      "Planes sin alimentos (llevando tu equipo de camping):",
      "Adultos: RD$ 700.00 por persona.",
      "Ninos (4 a 10 anos): RD$ 500.00 por persona.",
      "Casas de Campanas (por Persona por Noche):",
      "Debes llevar tus sabanas y toalla.",
      "Planes sin alimentos:",
      "Adultos: RD$ 1,000.00."
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [
      "Bufetes: Permanecen abiertos por 30 minutos.",
      "Restaurante, bar y venta de snacks dentro del campamento.",
      "Tienda de gift shop y amenidades dentro del campamento.",
      "Alquiler de uso de cocina: Para grupos de maximo 5 personas, RD$ 500.00 por dia.",
      "Horarios:",
      "Desayuno: 8:00 am a 9:00 am.",
      "Almuerzo: 12:00 pm a 1:30 pm.",
      "Cena: 6:00 pm a 7:30 pm.",
      "Bar: 10:00 am a 10:00 pm."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Traje de bano.",
      "Pasta y cepillo dental.",
      "Jabon (articulos de higiene).",
      "Ropa fresca y comoda.",
      "Toallas y sabanas.",
      "Linternas.",
      "Abrigo.",
      "Termo de agua."
    ],
    "rules": [
      "Musica moderada, la musica solo para ti. No se permite musica de 10:00 pm a 8:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "Mascotas: Si decides traer una, debes informarlo. No se permite dejar las mascotas solas en las cabanas ni que circulen libremente sin su dueno a su lado. Deben llevar collar y no se permite su acceso al area de comedor ni a la piscina. Recoge sus desechos.",
      "Fogata: Disponibilidad para hacer fogata. El cliente debe asumir la responsabilidad de alimentar el fuego y apagarlo antes de dormir. Se ofrece una cantidad suficiente de lena, paquetes adicionales tienen un costo extra.",
      "Vigilancia: Seguridad permanente y personal de apoyo para los huespedes. No somos responsables del cuidado de menores. Cada persona debe ser responsable de sus objetos personales. No somos responsables de objetos perdidos.",
      "Hospedaje: No se permite bajo ninguna circunstancia sacar colchones, almohadas o sabanas de las cabanas al exterior o a las tiendas de campana.",
      "Responsabilidad por danos o perdidas: La administracion NO se hace responsable de objetos dejados en las cabanas o tiendas de campana, tales como prendas, computadoras, camaras fotograficas o de video, celulares, dinero en efectivo, etc.",
      "No se permiten armas blancas o de fuego.",
      "Mantener las areas limpias que has utilizado.",
      "No esta permitido colocar las casas de campana en los quioscos.",
      "No tirar en las areas: colillas de cigarrillos, tapas, servilletas, etc.",
      "Reglas del Uso de la Piscina:"
    ],
    "reservation": [
      "Contacta al Staff de Campeach informandole la fecha de tu reserva (minimo 3 dias antes de la entrada), cantidad de personas y carpas que necesitas, asi como los equipos de camping adicionales que desees.",
      "Se requiere el pago del 100% para formalizar la reserva del espacio.",
      "Al momento de recibir la factura de los servicios contratados, aceptara la misma como comprobante de constancia de la reserva y responsabilidades dentro del campamento plasmadas en este catalogo.",
      "Politicas de cancelacion: No es reembolsable, se modifica la fecha de acuerdo a la disponibilidad del mismo."
    ]
  },
  "santiago": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 900,
    "priceNote": "Adultos desde RD$ 900.00 si llevas tu casa de campana.",
    "distance": "2 horas y 30 minutos desde Santo Domingo",
    "intro": "Santiago combina No hay acceso en transporte publico. Piscina dentro de la propiedad. Area de juegos para ninos. Kayak y botes de pedales con costo adicional. Piscina con vista panoramica. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "No hay acceso en transporte publico.",
      "Piscina dentro de la propiedad.",
      "Area de juegos para ninos.",
      "Kayak y botes de pedales con costo adicional.",
      "Jet ski y lanchas rapidas con costo adicional.",
      "Pets Friendly: Se permiten mascotas.",
      "Capacidad maxima dentro del campamento: 30 personas.",
      "Distancia desde Santo Domingo: 2 horas y 30 minutos."
    ],
    "includes": [
      "Piscina con vista panoramica.",
      "Banos y duchas compartidas.",
      "Hamacas.",
      "Areas de comedor.",
      "Areas de fogatas.",
      "Luz y conectores de electricidad en las areas comunes.",
      "Chaise longue.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Areas de picnic.",
      "Restaurante con costo adicional.",
      "Mesa de billar, tiro al blanco y ajedrez."
    ],
    "nearby": [
      "Bosque de Bambu: A 5 minutos.",
      "Presa de Taveras y actividades acuaticas frente a la propiedad.",
      "Ideal para rutas de bicicletas, motocross, 4 wheels, buggies, y senderismo."
    ],
    "pricing": [
      "Check in: 2:00 pm",
      "Check out: 12:00 pm",
      "Precios llevando tus equipos de camping:",
      "Adultos: RD$ 900.00 si llevas tu casa de campana.",
      "Ninos (5 a 15 anos): RD$ 600.00.",
      "Precios llevando tus equipos con desayuno continental incluido:",
      "Adultos: RD$ 1,300.00.",
      "Ninos (5 a 15 anos): RD$ 900.00.",
      "Desayuno continental incluye:",
      "Cafe o te.",
      "Frutas y tostadas.",
      "Mermelada y mantequilla."
    ],
    "lodging": [
      "Capacidad maxima: 2 personas.",
      "Precio: RD$ 5,000.00.",
      "Capacidad maxima: 4 personas.",
      "Precios:",
      "RD$ 6,500.00 para 1 o 2 personas.",
      "RD$ 8,000.00 para 3 personas.",
      "RD$ 8,800.00 para 4 personas."
    ],
    "extraActivities": [],
    "food": [
      "Menu del restaurante: Servicio de alimentos disponible."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Wipes.",
      "Jabon personal.",
      "Ropa fresca y comoda para el dia.",
      "Ropa abrigada para la noche.",
      "Traje de bano.",
      "Toallas.",
      "Ropa de cama."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti.",
      "Ducharse antes de entrar a la piscina.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion, esto podria ocasionar sanciones legales y pagos de multas."
    ],
    "reservation": [
      "Contacta al Staff de Campeach informandole la fecha de tu reserva (minimo 3 dias antes de la entrada), cantidad de personas y carpas que necesitas, asi como los equipos de camping adicionales que desees.",
      "Se requiere el pago del 100% para formalizar la reserva del espacio.",
      "Al momento de recibir la factura de los servicios contratados, aceptara la misma como comprobante de constancia de la reserva y responsabilidades dentro del campamento plasmadas en este catalogo.",
      "Politicas de cancelacion: No es reembolsable, se modifica la fecha de acuerdo a la disponibilidad del mismo hasta 2 veces."
    ]
  },
  "santo-domingo": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceNote": "Adultos desde RD$ 2,560.00.",
    "capacity": 2,
    "intro": "Santo Domingo combina Pets Friendly: Se permiten mascotas. Cueva con rio natural dentro del campamento. Piscina dentro del campamento. Experiencias con fogon, spa y barro. Piscina (sujeta a disponibilidad). Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Cueva con rio natural dentro del campamento.",
      "Piscina dentro del campamento.",
      "Experiencias con fogon, spa y barro.",
      "Observacion de esculturas del Arte Taino.",
      "Experiencia del campo en la ciudad.",
      "Restaurante y bar dentro del campamento.",
      "No hay acceso en transporte publico.",
      "Capacidad maxima dentro del campamento: 100 personas."
    ],
    "includes": [
      "Piscina (sujeta a disponibilidad).",
      "Banos compartidos.",
      "Duchas.",
      "Columpios.",
      "Areas de comedor.",
      "Cama para reposo.",
      "Areas de picnic.",
      "Area de fogata.",
      "Corriente electrica para celulares.",
      "Parqueos en propiedad privada.",
      "Areas sociales y recreativas.",
      "Check in: 3:00 pm"
    ],
    "nearby": [
      "Aeropuerto de las Americas: A 25 minutos.",
      "Parque Los 3 Ojos: A 17 minutos.",
      "Hipodromo: A 6 minutos.",
      "Playa Boca Chica: A 36 minutos.",
      "Ideal para rutas de senderismo, caminatas y relajacion."
    ],
    "pricing": [
      "Adultos: RD$ 2,560.00.",
      "Ninos (3 a 12 anos): RD$ 1,280.00.",
      "Descolche por botella: RD$ 600.00 mas impuestos (incluye vasos, agua y hielo)."
    ],
    "lodging": [
      "Capacidad: 2 personas.",
      "Precio por pareja: RD$ 7,200.00 (viernes a domingo).",
      "Precio por pareja: RD$ 8,950.00 (viernes a domingo)."
    ],
    "extraActivities": [],
    "food": [],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Traje de bano y toallas.",
      "Sabanas y colchoneta o sleeping bag.",
      "Linternas."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion, esto podria ocasionar sanciones legales y pagos de multas.",
      "No se permiten bocinas, hookahs ni vasos de foam.",
      "Las mascotas deben tener correa, recoja sus desechos.",
      "No se permite ingresar bebidas alcoholicas.",
      "No se permiten armas blancas o de fuego.",
      "Mantener las areas limpias que has utilizado."
    ],
    "reservation": [
      "Contacta al Staff de Campeach informandole la fecha de tu reserva (minimo 3 dias antes de la entrada), cantidad de personas y carpas que necesitas, asi como los equipos de camping adicionales que desees.",
      "Se requiere el pago del 100% para formalizar la reserva del espacio.",
      "Al momento de recibir la factura de los servicios contratados, aceptara la misma como comprobante de constancia de la reserva y responsabilidades dentro del campamento plasmadas en este catalogo.",
      "Politicas de cancelacion: No es reembolsable, se modifica la fecha de acuerdo a la disponibilidad del mismo."
    ]
  },
  "monsenor": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 1000,
    "priceNote": "RD$ 1,000 por persona por noche.",
    "intro": "Monseñor combina campamento rodeado de montañas, frente a la Presa Rincón. Pets Friendly: Se permiten mascotas. Ideal para desconectarse de la monotonía, tener contacto cercano con la naturaleza y lo ecológico. Perfecto para actividades grupales, retiros, excursiones y actividades en pareja. Cocina a leña. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Campamento rodeado de montanas, frente a la Presa Rincon.",
      "Pets Friendly: Se permiten mascotas.",
      "Ideal para desconectarse de la monotonia, contacto cercano con la naturaleza y lo ecologico.",
      "Perfecto para actividades grupales, retiros, excursiones y actividades en pareja.",
      "Temperaturas: Entre 22 a 32 grados.",
      "Seguridad interna: Las 24 horas del dia.",
      "Recomendacion: Vehiculo alto, camino de 1.5 km no asfaltado.",
      "Capacidad maxima: 30 personas.",
      "Equipos de camping de alquiler disponibles con retiro en Santo Domingo (solicitar catalogo)."
    ],
    "includes": [
      "Cocina a lena.",
      "Horno de pizza a lena y BBQ.",
      "Banos y duchas compartidos.",
      "Juegos de mesa.",
      "Hamacas.",
      "Area de comedor.",
      "Pesca.",
      "Uso del Kayak (30 minutos por dia).",
      "Balneario en la presa dentro de la propiedad.",
      "Fogata.",
      "Termo con agua disponible gratis en el area de la cocina.",
      "No cuenta con energia electrica (llevar bateria portatil)."
    ],
    "nearby": [
      "Salto de Jima: A 20 minutos de distancia.",
      "Rancho Guacamayo: A 37 minutos de distancia.",
      "Rio Blanco: A 55 minutos de distancia.",
      "Ideal para rutas de bicicletas, motocross, 4 wheels, buggies, y senderismo."
    ],
    "pricing": [
      "Check in: 3:00 pm",
      "Check out: 3:00 pm",
      "Camping:",
      "RD$ 1,000 por persona por noche.",
      "RD$ 750.00 ninos de 4 a 10 anos.",
      "RV Campers (casas rodantes):",
      "RD$ 900 por persona por noche.",
      "RD$ 675.00 ninos de 4 a 10 anos.",
      "Nota: No incluye la casa rodante.",
      "Ambas opciones incluyen: Uso de areas comunes, agua, cafe y actividades.",
      "No incluye equipos de camping ni comidas. Puedes adquirir tu comida con costo adicional bajo reserva previa.",
      "Precios:"
    ],
    "lodging": [],
    "extraActivities": [
      "Paseo en bote: RD$ 500.00 por persona (30 minutos de recorrido).",
      "Paseo a caballo: RD$ 500.00 por persona (30 minutos de recorrido)."
    ],
    "food": [
      "Cocina a lena (fogon): Horno de pizza a lena y BBQ disponibles.",
      "Nota: En caso de llevar perecederos, deben llevar neveritas con hielo para almacenaje.",
      "Restaurante tipico y colmado: A 20 minutos de la propiedad.",
      "Menu de Alimentos:",
      "Desayuno: RD$ 450 pesos por persona.",
      "Pan, queso, jamon, cafe con leche o jugo natural.",
      "Almuerzo: RD$ 550 pesos por persona.",
      "Moro de habichuelas negras, pescado frito, tostones y jugos naturales.",
      "Cena: RD$ 550 pesos por persona.",
      "Mangu de platano con los 3 golpes y jugo natural.",
      "Bebidas: Chocolate con leche en la fogata RD$ 80."
    ],
    "whatToBring": [
      "Bateria portatil o power bank.",
      "Pasta y cepillo dental.",
      "Toalla y productos de aseo personal.",
      "Ropa fresca y comoda.",
      "Tenis comodos o Crocs.",
      "Colchoneta o sleeping bag, sabana, cubre colchon y almohada.",
      "Casa de campana.",
      "Linternas.",
      "Bulto o mochila.",
      "Repelente y bloqueador solar.",
      "Neverita.",
      "Traje de bano."
    ],
    "rules": [
      "Musica moderada, la musica solo para ti. No se permite musica de 9:00 pm a 7:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion.",
      "Las mascotas deben de tener correa, recoge sus desechos.",
      "No se permiten armas blancas o de fuego.",
      "Mantener las areas limpias que has utilizado.",
      "No esta permitido colocar las casas de campana en los quioscos.",
      "No tirar en las areas: colillas de cigarrillos, tapas, servilletas, etc.",
      "Parqueos solo en el area especificada."
    ],
    "reservation": []
  },
  "ocoa": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 500,
    "priceNote": "Costo de entrada ninos (3 a 11 anos): RD$ 500.00 por persona.",
    "distance": "1 hora y 45 minutos desde Santo Domingo",
    "intro": "Ocoa combina Pets Friendly: Se permiten mascotas. Rio y cascada: frente a la propiedad a 2 minutos por el sendero. Excelente para Overlands. No hay acceso en transporte publico. Banos compartidos. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Rio y cascada: frente a la propiedad a 2 minutos por el sendero.",
      "Excelente para Overlands.",
      "No hay acceso en transporte publico.",
      "No hay delivery."
    ],
    "includes": [
      "Banos compartidos.",
      "Areas de comedor.",
      "Areas para camping.",
      "Area de fogata.",
      "Corriente electrica para celulares.",
      "BBQ, fogon y parrilla de lena.",
      "Caminos de senderismo.",
      "Areas sociales y recreativas.",
      "Parqueos en propiedad privada."
    ],
    "nearby": [
      "Ocoa Bay: A 1 hora y 30 minutos de distancia.",
      "Carretera hacia Las Piramides, Constanza: A 2 horas de distancia.",
      "Presa Jiguey-Aguacate: A 1 hora y 11 minutos de distancia.",
      "Parador Fotografico de Ocoa: A 1 hora de distancia.",
      "Ideal para rutas de senderismo, aventuras, Rutas MTB, bicicletas, motocross, 4 wheels y buggies."
    ],
    "pricing": [
      "Costo de entrada ninos (3 a 11 anos): RD$ 500.00 por persona.",
      "Ninos menores de 2 anos: Gratis.",
      "Check in: 9:00 am",
      "Check out: 5:00 pm",
      "Equipos de camping de alquiler con retiro en Santo Domingo disponibles, solicitar catalogo en caso de necesitar."
    ],
    "lodging": [],
    "extraActivities": [],
    "food": [
      "Parrilla de BBQ y fogon: Disponibles para que puedas preparar tus alimentos. Debes de llevar todo lo que necesites para cocinar, incluyendo el carbon.",
      "No hay restaurantes cercanos del campamento.",
      "No contamos con ventas de comidas ni bebidas, debes de llevar todo lo que vayas a consumir.",
      "Colmado a 5 minutos de distancia con venta de productos limitados."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Papel higienico y/o wipes.",
      "Jabon.",
      "Abrigo para las noches.",
      "Ropa fresca y comoda.",
      "Traje de bano.",
      "Toallas.",
      "Ropa de cama.",
      "Alimentos, bebidas y articulos para cocinar."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada: La musica solo para ti. No se permite musica de 9:00 pm a 7:00 am.",
      "Recoger tus desperdicios: Somos un campamento eco-friendly. Debes de llevarte tus desechos inorganicos, evita llevar plasticos, foam, etc.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion, esto podria ocasionar sanciones legales y pagos de multas.",
      "Mantener las areas limpias que has utilizado.",
      "No electrodomesticos: No se permiten planchas, estufas, grill electricos (electricidad solo para equipos electronicos y bombillas).",
      "No tirar basura en la grama: No tirar colillas de cigarrillos, tapas, servilletas, etc."
    ],
    "reservation": [
      "Contacta al Staff de Campeach informandole la fecha de tu reserva (minimo 3 dias antes de la entrada), cantidad de personas y carpas que necesitas, asi como los equipos de camping adicionales que desees.",
      "Se requiere el pago del 100% para formalizar la reserva del espacio.",
      "Al momento de recibir la factura de los servicios contratados, aceptara la misma como comprobante de constancia de la reserva y responsabilidades dentro del campamento plasmadas en este catalogo.",
      "Politicas de cancelacion de las reservas: En el area del camping, no es reembolsable. Se modifica la fecha como maximo hasta 2 veces de acuerdo a disponibilidad del mismo, luego de la 2da modificacion se pierde el costo de la reserva si no pudo asistir. En caso de lluvias intensas o campamento cerrado por fuerza mayor, se permite un 3er cambio."
    ]
  },
  "villa-altagracia": {
    "source": "Cerebro de Campamentos y Equipos de Camping",
    "priceFrom": 750,
    "priceNote": "Adultos desde RD$ 750.00 por noche.",
    "distance": "50 minutos desde Santo Domingo",
    "intro": "Villa Altagracia (Eco Aldea) combina Pets Friendly: Se permiten mascotas. Salto de los Indios y cascada a 20 minutos por el sendero. Rio con jacuzzi natural al lado del area del camping.- Piscina en medio del area de acampar con agua natural del rio Ideal para Overlands. Bano compartido y duchas ecologicas. Reserva con Campeach RD para confirmar disponibilidad, tarifa final y condiciones del lugar.",
    "important": [
      "Pets Friendly: Se permiten mascotas.",
      "Salto de los Indios y cascada a 20 minutos por el sendero.",
      "Rio con jacuzzi natural al lado del area del camping.- Piscina en medio del area de acampar con agua natural del rio",
      "Ideal para Overlands.",
      "No hay acceso en transporte publico.",
      "Electricidad con paneles solares, solo para celulares.",
      "No hay delivery.",
      "Poca senal de celulares.",
      "Capacidad maxima dentro del campamento: 150 personas.",
      "Distancia desde Santo Domingo: 50 minutos."
    ],
    "includes": [
      "Bano compartido y duchas ecologicas.",
      "Hamacas y columpios.",
      "Areas de comedor, horno y fogon de lena.",
      "Areas de picnic y BBQ.",
      "WIFI.",
      "Piscina para ninos.",
      "Area de fogata.",
      "Areas para camping cerca del rio.",
      "Corriente electrica para celulares.",
      "Caminos de senderismo.",
      "2 parqueos en propiedad privada: Parqueo bajo para vehiculos 4x2, parqueo frente al area del camping para 4x4."
    ],
    "nearby": [
      "Ideal para rutas de senderismo, aventuras, Rutas MTB, bicicletas, motocross, 4 wheels y buggies.",
      "Ideal para entrenamiento para subir al Pico Duarte."
    ],
    "pricing": [
      "Check in: 9:00 am",
      "Check out: 5:00 pm",
      "Precio por adulto: RD$ 750.00 por noche.",
      "Precio por nino (3-12 anos): RD$ 450.00 por noche.",
      "Equipos de camping de alquiler con retiro en Santo Domingo disponibles, solicitar catalogo en caso de necesitar."
    ],
    "lodging": [
      "Check in: 2:00 pm",
      "Check out: 12:00 pm",
      "Precio: RD$ 2,300.00 por noche."
    ],
    "extraActivities": [],
    "food": [
      "Parrillas de BBQ, fogon y horno de lena: Disponibles para que prepares tus alimentos. Debes llevar todo lo que necesites para cocinar. Contamos con lena, si deseas carbon, debes llevarlo.",
      "No hay restaurantes cercanos al campamento.",
      "No contamos con ventas de comidas ni bebidas, debes llevar todo lo que vayas a consumir."
    ],
    "whatToBring": [
      "Bloqueador solar.",
      "Repelente.",
      "Pasta y cepillo dental.",
      "Papel higienico y/o wipes.",
      "Jabon.",
      "Ropa fresca y comoda.",
      "Traje de bano.",
      "Toallas.",
      "Ropa de cama.",
      "Alimentos, bebidas y articulos para cocinar."
    ],
    "rules": [
      "Ser cordial y amable con los demas.",
      "Musica moderada, la musica solo para ti. No se permite musica de 9:00 pm a 7:00 am.",
      "Recoger tus desperdicios (basura), somos un campamento eco-friendly. Debes llevarte tus desechos inorganicos, evitar llevar plasticos, foam, etc.",
      "No talar arboles o alterar la flora y fauna.",
      "No mover las instalaciones de su lugar, romper o maltratar.",
      "No tocar las plantaciones y los animales sin autorizacion, esto podria ocasionar sanciones legales y pagos de multas.",
      "Mantener las areas limpias que has utilizado.",
      "No electrodomesticos: No se permiten planchas, estufas, grill electricos (electricidad solo para equipos electronicos y bombillas).",
      "No tirar basura en la grama: No tirar colillas de cigarrillos, tapas, servilletas, etc."
    ],
    "reservation": [
      "Contacta al Staff de Campeach informandole la fecha de tu reserva (minimo 3 dias antes de la entrada), cantidad de personas y carpas que necesitas, asi como los equipos de camping adicionales que desees.",
      "Se requiere el pago del 100% para formalizar la reserva del espacio.",
      "Al momento de recibir la factura de los servicios contratados, aceptara la misma como comprobante de constancia de la reserva y responsabilidades dentro del campamento plasmadas en este catalogo.",
      "Politicas de cancelacion de las reservas: En el area del camping: no es reembolsable, se modifica la fecha como maximo hasta 2 veces de acuerdo a la disponibilidad del mismo, luego de la 2da modificacion se pierde el costo de la reserva si no se pudo asistir. En caso de lluvias intensas o campamento cerrado por fuerza mayor, se permite un 2do cambio."
    ]
  }
};
