import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  FileText,
  Filter,
  Flame,
  Heart,
  Image as ImageIcon,
  Info,
  MapPin,
  MessageCircle,
  Mountain,
  Route,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  SlidersHorizontal,
  Sparkles,
  Tent,
  Utensils,
  Waves,
  Users,
} from 'lucide-react';
import { brand, camps, equipment, equipmentCatalog, equipmentRules, logoImage, type Camp } from './data';

const formatPrice = (value?: number) =>
  value ? `RD$${value.toLocaleString('es-DO')}` : 'Consultar';

const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

const getCampIntro = (camp: Camp) => {
  if (camp.richInfo?.intro) return camp.richInfo.intro;

  const setting = camp.tags.slice(0, 3).join(', ').toLowerCase();
  const activities = camp.activities.slice(0, 3).join(', ').toLowerCase();
  const stay = camp.stayOptions.slice(0, 2).join(' o ').toLowerCase();
  return `${camp.name} es una opcion ${camp.region.toLowerCase()} para quienes buscan ${setting || 'naturaleza y privacidad'}. Es ideal para ${activities || 'descansar, conectar y vivir una escapada al aire libre'}, con opciones de ${stay || 'camping bajo reserva'} coordinadas por Campeach RD.`;
};

const getPracticalTips = (camp: Camp) => {
  if (camp.richInfo?.whatToBring?.length) return camp.richInfo.whatToBring.slice(0, 8);

  const tips = ['Lleva ropa comoda, repelente y calzado cerrado.', 'Confirma disponibilidad antes de salir.', 'Respeta las areas naturales y las reglas del lugar.'];
  const text = [...camp.rules, ...camp.tags, ...camp.highlights].join(' ').toLowerCase();
  if (text.includes('no restaurantes') || text.includes('llevar alimentos') || text.includes('cocina')) {
    tips.unshift('Planifica tus alimentos y bebidas antes de llegar.');
  }
  if (text.includes('4x4') || text.includes('vehiculo alto')) {
    tips.unshift('Recomendamos vehiculo alto o 4x4 para mayor comodidad.');
  }
  if (text.includes('mascotas')) {
    tips.push('Si llevas mascotas, mantenlas bajo control durante la estadia.');
  }
  if (camp.region === 'Montana') {
    tips.push('Para zonas frescas, lleva abrigo ligero para la noche.');
  }
  return unique(tips).slice(0, 5);
};

const getAmenityIcon = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes('rio') || normalized.includes('playa') || normalized.includes('piscina') || normalized.includes('cascada')) return Waves;
  if (normalized.includes('comida') || normalized.includes('restaurante') || normalized.includes('bar') || normalized.includes('bbq') || normalized.includes('alimentos')) return Utensils;
  if (normalized.includes('fogata') || normalized.includes('fogon')) return Flame;
  if (normalized.includes('camping') || normalized.includes('carpa') || normalized.includes('glamping') || normalized.includes('tiny') || normalized.includes('habitacion')) return BedDouble;
  if (normalized.includes('sender') || normalized.includes('mtb') || normalized.includes('ruta') || normalized.includes('hiking') || normalized.includes('aventura')) return Route;
  return CheckCircle2;
};

type WhatsappIntent = 'availability' | 'quote' | 'equipment';

const whatsappFor = (camp?: Camp, _intent: WhatsappIntent = 'availability', equipmentName?: string) => {
  const campName = camp?.name ?? '(Nombre del campamento)';
  const requestedEquipment = equipmentName ?? '';
  const text = [
    'Hola, Campeach RD. Espero se encuentren bien.',
    '',
    `Me gustaría consultar disponibilidad para el campamento en ${campName}.`,
    '',
    'Fechas:',
    '',
    'Cantidad de adultos y niños con sus edades:',
    '',
    'Tipo de alojamiento deseado:',
    '',
    `Equipos de camping requeridos: ${requestedEquipment}`,
    '',
    '¿Podrían confirmarme disponibilidad, precio total y los pasos para realizar la reserva?',
    '',
    'Quedo atent@, gracias.',
  ].join('\n');
  return `${brand.whatsapp}?text=${encodeURIComponent(text)}`;
};

const shopProducts = [
  {
    id: 'ozark-3',
    name: 'Ozark Trail Clip & Camp para 3 personas',
    price: 5990,
    compareAt: 6490,
    weight: '5.64 lb',
    footprint: "7' × 7'",
    description: 'Compacta, ligera y fácil de montar. Ideal para parejas o escapadas cortas.',
    image: 'https://i5.walmartimages.com/seo/OT-3P-DOME-TENT_6ab1283a-1ed7-4867-83c1-c252d873095e.5b59dc3dfba1a9917f1ccc90fb1aa809.jpeg',
  },
  {
    id: 'ozark-4',
    name: 'Ozark Trail Clip & Camp para 4 personas',
    price: 7490,
    compareAt: 7990,
    weight: '7.87 lb',
    footprint: "8' × 8.5'",
    description: 'Espacio para un colchón queen, ventilación amplia y sobretecho removible.',
    image: 'https://i5.walmartimages.com/seo/Ozark-Trail-4-Person-Clip-Camp-Dome-Tent-8-x-8-5-x-50-7-87-lbs_7610003e-44cc-44bb-8233-f045ff5e08f1.bf2296d5412c648b46e407a584196a54.jpeg',
  },
  {
    id: 'ozark-6',
    name: 'Ozark Trail Clip & Camp para 6 personas',
    price: 12490,
    compareAt: 13490,
    weight: '14 lb',
    footprint: "12' × 8.5'",
    description: 'La favorita de Campeach: cómoda, resistente y con capacidad para dos colchones queen.',
    image: 'https://i5.walmartimages.com/seo/OT-6P-DOME-TENT_49cdd491-f5b5-4983-ac05-69ddc8c5e098.b3d69dd9a8f4eb84b8a5f3d7a7a3662b.jpeg',
    featured: true,
  },
  {
    id: 'ozark-8',
    name: 'Ozark Trail Clip & Camp para 8 personas',
    price: 17990,
    compareAt: 18990,
    weight: '23.81 lb',
    footprint: "16' × 8'",
    description: 'Formato familiar con altura para estar de pie y espacio para tres colchones queen.',
    image: 'https://i5.walmartimages.com/seo/Ozark-Trail-8-Person-Clip-Camp-Family-Tent-16-x-8-x-78-23-81-lbs_610c544e-addf-48dd-94e5-8bdd69a571a1.c10f4531efa861d1409f696e05718c9a.jpeg',
  },
];

const shopWhatsappFor = (productName: string) => {
  const text = [
    'Hola, Campeach RD. Espero se encuentren bien.',
    '',
    `Me interesa comprar: ${productName}.`,
    '',
    'Cantidad:',
    'Nombre:',
    'Sector y ciudad para la entrega:',
    'Método de pago preferido:',
    '',
    '¿Podrían confirmarme disponibilidad, tiempo de entrega y total?',
    '',
    'Quedo atent@, gracias.',
  ].join('\n');
  return `${brand.whatsapp}?text=${encodeURIComponent(text)}`;
};

type ShopProduct = (typeof shopProducts)[number];

function ProductDetail({ product, onBack }: { product: ShopProduct; onBack: () => void }) {
  return (
    <main className="campeach-page product-page">
      <header className="campeach-header">
        <button className="campeach-logo product-logo-button" type="button" onClick={onBack} aria-label="Volver a la tienda">
          <img src={logoImage} alt="Campeach RD" />
        </button>
        <nav aria-label="Producto"><button type="button" onClick={onBack}>← Volver a la tienda</button></nav>
        <a className="header-cta" href={shopWhatsappFor(product.name)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Ayuda</a>
      </header>
      <section className="product-breadcrumb"><button type="button" onClick={onBack}>Tienda</button><span>/</span><span>Casas de campaña</span><span>/</span><strong>{product.name}</strong></section>
      <section className="product-layout">
        <div className="product-gallery">
          {product.featured ? <span className="shop-badge">Favorita de Campeach</span> : null}
          <img src={product.image} alt={product.name} />
          <p>Imagen de referencia del modelo. El color puede variar según inventario.</p>
        </div>
        <div className="product-summary">
          <span className="eyebrow"><Tent size={16} /> Ozark Trail · Clip & Camp</span>
          <h1>{product.name}</h1>
          <div className="shop-rating"><Star size={16} fill="currentColor" /> 4.3 <span>Modelo recomendado por Campeach</span></div>
          <p className="product-description">{product.description}</p>
          <div className="product-price"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.compareAt)}</del></div>
          <p className="product-delivery"><ShieldCheck size={18} /> Delivery estándar incluido hasta RD$500</p>
          <div className="product-key-specs">
            <div><span>Capacidad</span><strong>{product.name.match(/\d+/)?.[0]} personas</strong></div>
            <div><span>Peso empacado</span><strong>{product.weight}</strong></div>
            <div><span>Dimensiones</span><strong>{product.footprint}</strong></div>
          </div>
          <div className="product-buy-box">
            <a className="online-pay-button" href="#pago"><CreditCard size={19} /> Pagar en línea</a>
            <a className="whatsapp-buy-button" href={shopWhatsappFor(product.name)} target="_blank" rel="noreferrer"><WhatsappIcon size={20} /> Comprar por WhatsApp</a>
          </div>
          <small>Confirmaremos existencia y plazo antes de procesar el pago.</small>
        </div>
      </section>
      <section className="product-information">
        <div><h2>Una casa de campaña pensada para disfrutar</h2><p>Montaje con clips, ventilación de malla, sobretecho removible, bolsillos interiores, entrada para cable eléctrico y bolsa de transporte.</p></div>
        <ul><li>Fácil de montar y desmontar</li><li>Sobretecho con costuras selladas</li><li>Ventilación superior y lateral</li><li>Soporte local de Campeach RD</li></ul>
      </section>
      <section id="pago" className="payment-section">
        <div>
          <span className="eyebrow"><CreditCard size={16} /> Pago seguro</span>
          <h2>Checkout de Campeach</h2>
          <p>Tu pago será procesado en la plataforma segura de Pagadito. Campeach no solicitará ni almacenará los datos de tu tarjeta.</p>
        </div>
        <div className="payment-pending"><ShieldCheck size={30} /><strong>Pago seguro con Pagadito</strong><span>Estamos completando la conexión de la cuenta comercial. Mientras se habilita, puedes confirmar el pedido por WhatsApp.</span><a href={shopWhatsappFor(product.name)} target="_blank" rel="noreferrer">Confirmar pedido</a></div>
      </section>
    </main>
  );
}

function WhatsappIcon({ size = 21 }: { size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.3-4.2a8.5 8.5 0 1 1 15.7-4.6Z" fill="currentColor" />
      <path d="M8.1 7.4c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 2c.1.3.1.5-.1.7l-.7.8c-.2.2-.1.5 0 .7.7 1.2 1.7 2.2 3 2.8.3.1.5.2.7-.1l.9-1.1c.2-.3.4-.3.7-.2l2 .9c.3.1.4.3.4.5 0 .3-.2 1.5-.7 2-.5.6-1.3.9-2.2.9-1 0-2.5-.5-4.2-1.5-1.4-.8-2.6-1.9-3.5-3.2-.8-1.1-1.5-2.5-1.4-3.7 0-.7.3-1.2.6-1.5Z" fill="#fff" />
    </svg>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Tent; label: string; value: string }) {
  return (
    <div className="detail-info-card">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FeatureTile({ label }: { label: string }) {
  const Icon = getAmenityIcon(label);
  return (
    <span className="feature-tile">
      <Icon size={17} />
      {label}
    </span>
  );
}

function DetailListSection({ icon: Icon, title, items }: { icon: typeof Tent; title: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <section className="detail-section">
      <div className="detail-section-title">
        <Icon size={18} />
        <h3>{title}</h3>
      </div>
      <ul className="detail-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function CampCarousel({ camp }: { camp: Camp }) {
  const carouselImages = camp.images.slice(0, Math.min(camp.images.length, 8));

  return (
    <div className="camp-carousel" aria-label={`Fotos de ${camp.name}`}>
      <div className="camp-carousel-track" style={{ '--slide-count': carouselImages.length } as CSSProperties}>
        {carouselImages.map((image, index) => (
          <img key={`${camp.id}-${image}`} src={image} alt={`${camp.name} vista ${index + 1}`} loading="lazy" />
        ))}
      </div>
      <div className="camp-carousel-dots" aria-hidden="true">
        {carouselImages.slice(0, 5).map((image) => (
          <span key={image} />
        ))}
      </div>
    </div>
  );
}

function CampCard({ camp, onOpen }: { camp: Camp; onOpen: (camp: Camp) => void }) {
  return (
    <article className="camp-card">
      <button className="camp-photo-button" type="button" onClick={() => onOpen(camp)}>
        <CampCarousel camp={camp} />
        <span className="camp-region">{camp.region}</span>
        <span className="camp-save" aria-label="Guardar">
          <Heart size={17} />
        </span>
      </button>
      <div className="camp-card-body">
        <div className="camp-title-row">
          <div>
            <h3>{camp.name}</h3>
            <p>
              <MapPin size={15} />
              {camp.location}
            </p>
          </div>
          <strong>{formatPrice(camp.priceFrom)}</strong>
        </div>
        <p className="camp-note">{camp.priceNote}</p>
        <div className="camp-tags">
          {camp.tags.slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="camp-actions">
          <button type="button" onClick={() => onOpen(camp)}>
            Ver detalles
          </button>
          <a href={whatsappFor(camp)} target="_blank" rel="noreferrer">
            <MessageCircle size={16} />
            Reservar
          </a>
        </div>
      </div>
    </article>
  );
}

function CampDetail({ camp, onClose }: { camp: Camp; onClose: () => void }) {
  const rich = camp.richInfo;
  const experienceItems = unique([...(rich?.important ?? []), ...camp.highlights, ...camp.tags]).slice(0, 8);
  const includeItems = unique([...(rich?.includes ?? []), ...camp.highlights]).slice(0, 10);
  const pricingItems = unique([...(rich?.pricing ?? []), camp.priceNote]).slice(0, 12);
  const lodgingItems = unique([...(rich?.lodging ?? []), ...camp.stayOptions]).slice(0, 10);
  const activityItems = unique([...(rich?.extraActivities ?? []), ...(rich?.nearby ?? []), ...camp.activities]).slice(0, 10);
  const practicalTips = getPracticalTips(camp);
  const reservationItems = rich?.reservation?.length ? rich.reservation : ['Escribe por WhatsApp con fecha tentativa, cantidad de personas y tipo de alojamiento.', 'Campeach valida disponibilidad, tarifa final y condiciones.', 'Con el pago indicado por el staff se bloquea la reserva y recibes instrucciones finales.'];

  return (
    <div className="detail-backdrop" role="presentation" onClick={onClose}>
      <aside className="camp-detail" role="dialog" aria-modal="true" aria-label={camp.name} onClick={(event) => event.stopPropagation()}>
        <button className="detail-close" type="button" onClick={onClose}>
          <ChevronDown size={20} />
        </button>
        <div className="detail-gallery">
          <CampCarousel camp={camp} />
          <div className="detail-thumbs" aria-label={`Mas fotos de ${camp.name}`}>
            {camp.images.slice(1, 5).map((image, index) => (
              <img key={`${camp.id}-thumb-${index}`} src={image} alt={`${camp.name} detalle ${index + 2}`} loading="lazy" />
            ))}
          </div>
        </div>
        <div className="detail-content">
          <div className="detail-heading">
            <div>
              <p>{camp.region}</p>
              <h2>{camp.name}</h2>
              <span>
                <MapPin size={16} />
                {camp.location}
              </span>
            </div>
            <strong>{formatPrice(camp.priceFrom)}</strong>
          </div>
          <p className="detail-price">{camp.priceNote}</p>

          <div className="detail-priority-actions">
            {camp.pdfUrl ? (
              <a className="pdf-cta" href={camp.pdfUrl} target="_blank" rel="noreferrer">
                <FileText size={20} />
                Ver revista PDF del campamento
              </a>
            ) : (
              <a className="pdf-cta" href={whatsappFor(camp, 'quote')} target="_blank" rel="noreferrer">
                <FileText size={20} />
                Solicitar revista por WhatsApp
              </a>
            )}
            <a className="whatsapp-cta" href={whatsappFor(camp, 'availability')} target="_blank" rel="noreferrer">
              <WhatsappIcon />
              Pedir información por WhatsApp
            </a>
          </div>

          <div className="detail-summary">
            <div>
              <span>
                <Info size={16} />
                Resumen
              </span>
              <p>{getCampIntro(camp)}</p>
            </div>
          </div>

          <div className="detail-info-grid">
            <InfoCard icon={Tent} label="Precio desde" value={formatPrice(camp.priceFrom)} />
            <InfoCard icon={Users} label="Capacidad" value={camp.capacity ? `Hasta ${camp.capacity} personas` : 'Bajo consulta'} />
            <InfoCard icon={Clock3} label="Distancia" value={camp.distance ?? 'Confirmar al reservar'} />
            <InfoCard icon={Camera} label="Galeria" value={`${camp.images.length} fotos del lugar`} />
          </div>

          <section className="detail-section">
            <div className="detail-section-title">
              <ImageIcon size={18} />
              <h3>Galeria completa del campamento</h3>
            </div>
            <div className="full-gallery-grid" aria-label={`Todas las fotos cargadas de ${camp.name}`}>
              {camp.images.map((image, index) => (
                <img key={`${camp.id}-full-${image}`} src={image} alt={`${camp.name} foto ${index + 1}`} loading="lazy" />
              ))}
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section-title">
              <Sparkles size={18} />
              <h3>Lo que lo hace especial</h3>
            </div>
            <div className="feature-grid">
              {experienceItems.map((item) => (
                <FeatureTile key={item} label={item} />
              ))}
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section-title">
              <CheckCircle2 size={18} />
              <h3>Incluye y comodidades</h3>
            </div>
            <div className="feature-grid">
              {includeItems.map((item) => (
                <FeatureTile key={item} label={item} />
              ))}
            </div>
          </section>

          <DetailListSection icon={CalendarDays} title="Precios y horarios" items={pricingItems} />
          <DetailListSection icon={BedDouble} title="Alojamientos disponibles" items={lodgingItems} />

          <section className="detail-section">
            <div className="detail-section-title">
              <Mountain size={18} />
              <h3>Actividades y lugares cercanos</h3>
            </div>
            <div className="feature-grid compact">
              {activityItems.map((item) => (
                <FeatureTile key={item} label={item} />
              ))}
            </div>
          </section>

          <DetailListSection icon={Utensils} title="Alimentacion y cocina" items={rich?.food ?? []} />
          <DetailListSection icon={ShieldCheck} title="Reglas clave del lugar" items={camp.rules} />

          <section className="detail-section split">
            <div>
              <div className="detail-section-title">
                <ShoppingBag size={18} />
                <h3>Antes de ir</h3>
              </div>
              <ul>
                {practicalTips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="booking-steps">
              {reservationItems.slice(0, 4).map((item, index) => (
                <div key={item}>
                  <span>{index + 1}</span>
                  <strong>{index === 0 ? 'Consulta' : index === 1 ? 'Confirmacion' : 'Reserva'}</strong>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="detail-actions">
            <a className="primary-link" href={whatsappFor(camp, 'availability')} target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              Consultar disponibilidad
            </a>
            <a href={whatsappFor(camp, 'quote')} target="_blank" rel="noreferrer">
              <CalendarDays size={18} />
              Cotizar reserva
            </a>
            <a href={whatsappFor(camp, 'equipment')} target="_blank" rel="noreferrer">
              <ShoppingBag size={18} />
              Cotizar con equipos
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function CampeachApp() {
  const [selectedRegion, setSelectedRegion] = useState('Todos');
  const [query, setQuery] = useState('');
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);

  useEffect(() => {
    document.title = 'Campeach RD | Campamentos y equipos en RD';
    const params = new URLSearchParams(window.location.search);
    const campId = params.get('camp');
    const equipmentId = params.get('equipment');
    const productId = params.get('product');

    if (productId) {
      const product = shopProducts.find((item) => item.id === productId);
      if (product) setSelectedProduct(product);
      return;
    }

    if (campId) {
      const matchingCamp = camps.find((camp) => camp.id === campId);
      if (matchingCamp) setSelectedCamp(matchingCamp);
    } else if (equipmentId) {
      window.requestAnimationFrame(() => {
        document.getElementById(`equipo-${equipmentId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, []);

  const openCamp = (camp: Camp) => {
    setSelectedCamp(camp);
    const url = new URL(window.location.href);
    url.searchParams.set('camp', camp.id);
    url.searchParams.delete('equipment');
    window.history.replaceState({}, '', url);
  };

  const closeCamp = () => {
    setSelectedCamp(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('camp');
    window.history.replaceState({}, '', url);
  };

  const regions = useMemo(() => ['Todos', ...Array.from(new Set(camps.map((camp) => camp.region))).sort()], []);
  const filteredCamps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return camps.filter((camp) => {
      const matchesRegion = selectedRegion === 'Todos' || camp.region === selectedRegion;
      const searchable = `${camp.name} ${camp.location} ${camp.tags.join(' ')} ${camp.highlights.join(' ')}`.toLowerCase();
      return matchesRegion && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [query, selectedRegion]);

  const featuredCamp = filteredCamps[0] ?? camps[0];

  const openProduct = (product: ShopProduct) => {
    setSelectedProduct(product);
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('product', product.id);
    url.hash = '';
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    url.hash = 'tienda';
    window.history.pushState({}, '', url);
  };

  if (selectedProduct) return <ProductDetail product={selectedProduct} onBack={closeProduct} />;

  return (
    <main className="campeach-page">
      <header className="campeach-header">
        <a className="campeach-logo" href={import.meta.env.BASE_URL} aria-label="Campeach RD">
          <img src={logoImage} alt="Campeach RD" />
        </a>
        <nav aria-label="Secciones">
          <a href="#campamentos">Campamentos</a>
          <a href="#equipos">Equipos</a>
          <a href="#tienda">Tienda</a>
          <a href={brand.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
        <a className="header-cta" href={whatsappFor()} target="_blank" rel="noreferrer">
          <MessageCircle size={17} />
          WhatsApp
        </a>
      </header>

      <section className="market-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} />
            Red de campamentos privados en RD
          </span>
          <h1>Encuentra tu proximo campamento Campeach</h1>
          <p>Compara destinos, revisa fotos reales y reserva con el equipo de Campeach RD.</p>
        </div>
        <button className="featured-panel" type="button" onClick={() => openCamp(featuredCamp)}>
          <CampCarousel camp={featuredCamp} />
          <span>Destacado ahora</span>
          <strong>{featuredCamp.name}</strong>
          <p>{featuredCamp.priceNote}</p>
        </button>
      </section>

      <section className="search-band" aria-label="Buscar campamentos">
        <label className="search-box">
          <Search size={19} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por playa, rio, piscina, 4x4..." />
        </label>
        <div className="region-filter" aria-label="Filtrar por region">
          <Filter size={18} />
          {regions.map((region) => (
            <button key={region} className={region === selectedRegion ? 'active' : ''} type="button" onClick={() => setSelectedRegion(region)}>
              {region}
            </button>
          ))}
        </div>
      </section>

      <section className="quick-stats" aria-label="Resumen Campeach">
        <div>
          <Tent size={22} />
          <strong>{camps.length}</strong>
          <span>campamentos disponibles</span>
        </div>
        <div>
          <Mountain size={22} />
          <strong>{regions.length - 1}</strong>
          <span>zonas para explorar</span>
        </div>
        <div>
          <ShoppingBag size={22} />
          <strong>{equipment.length}</strong>
          <span>equipos de camping</span>
        </div>
        <div>
          <SlidersHorizontal size={22} />
          <strong>365</strong>
          <span>dias abiertos bajo reserva</span>
        </div>
      </section>

      <section id="campamentos" className="content-section">
        <div className="section-heading">
          <div>
            <p>Campamentos</p>
            <h2>Todos los destinos Campeach</h2>
          </div>
          <span>{filteredCamps.length} resultados</span>
        </div>
        <div className="camp-grid">
          {filteredCamps.map((camp) => (
            <CampCard key={camp.id} camp={camp} onOpen={openCamp} />
          ))}
        </div>
      </section>

      <section id="equipos" className="equipment-section">
        <div className="section-heading">
          <div>
            <p>Alquiler</p>
            <h2>Equipos de camping</h2>
          </div>
          <a href={equipmentCatalog.url} target="_blank" rel="noreferrer">
            <FileText size={16} />
            {equipmentCatalog.title}
          </a>
        </div>
        <div className="equipment-layout">
          <div className="equipment-grid">
            {equipment.map((item) => (
              <article key={item.name} id={`equipo-${item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="equipment-card">
                <div className="equipment-photo">
                  <img src={item.image} alt={`${item.name} en catalogo Campeach`} loading="lazy" />
                </div>
                <span>{item.category}</span>
                <h3>{item.name}</h3>
                <strong>RD${item.price.toLocaleString('es-DO')}</strong>
                <p>{item.detail}</p>
                <a href={whatsappFor(undefined, 'equipment', item.name)} target="_blank" rel="noreferrer">
                  Cotizar equipo
                  <ArrowUpRight size={15} />
                </a>
              </article>
            ))}
          </div>
          <aside className="rental-rules">
            <h3>Como funciona</h3>
            <ol>
              {equipmentRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section id="tienda" className="shop-section">
        <div className="shop-promo-bar">
          <span>Compra segura con Campeach RD</span>
          <strong>Delivery estándar incluido</strong>
          <span>Soporte local por WhatsApp</span>
        </div>
        <div className="shop-hero">
          <div>
            <span className="eyebrow"><ShoppingBag size={16} /> Tienda Campeach</span>
            <h2>Casas de campaña fáciles de armar, escogidas por campistas.</h2>
            <p>Seleccionamos la línea Ozark Trail Clip & Camp por su relación precio-calidad, montaje sencillo y buen aprovechamiento del espacio.</p>
          </div>
          <div className="shop-trust-card">
            <ShieldCheck size={28} />
            <div><strong>Compra acompañada</strong><span>Confirmamos inventario y fecha de entrega antes de recibir tu pago.</span></div>
          </div>
        </div>
        <div className="shop-grid">
          {shopProducts.map((product) => (
            <article className={`shop-card${product.featured ? ' featured' : ''}`} key={product.id} onClick={() => openProduct(product)}>
              {product.featured ? <span className="shop-badge">Favorita de Campeach</span> : null}
              <div className="shop-image"><img src={product.image} alt={product.name} loading="lazy" /></div>
              <div className="shop-rating"><Star size={15} fill="currentColor" /> 4.3 <span>Selección recomendada</span></div>
              <button className="shop-product-link" type="button" onClick={() => openProduct(product)}><h3>{product.name}</h3></button>
              <p>{product.description}</p>
              <div className="shop-specs"><span>{product.weight}</span><span>{product.footprint}</span><span>Sobretecho incluido</span></div>
              <div className="shop-price"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.compareAt)}</del></div>
              <small>Precio con delivery estándar incluido. Disponibilidad sujeta a confirmación.</small>
              <button className="shop-details-button" type="button" onClick={() => openProduct(product)}>Ver producto</button>
              <a href={shopWhatsappFor(product.name)} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}><WhatsappIcon size={19} /> Comprar por WhatsApp</a>
            </article>
          ))}
        </div>
        <div className="shop-conditions">
          <div><strong>Entrega incluida</strong><span>Cobertura estándar de hasta RD$500; zonas especiales se cotizan antes del pago.</span></div>
          <div><strong>Precios protegidos</strong><span>Calculados con importación, publicidad y variación cambiaria para evitar cargos sorpresa.</span></div>
          <div><strong>Pedido confirmado</strong><span>No cobramos hasta validar existencia y plazo estimado de entrega.</span></div>
        </div>
      </section>

      <footer className="campeach-footer">
        <div>
          <strong>Campeach RD</strong>
          <p>Campamentos seguros, privados y abiertos bajo reserva.</p>
        </div>
        <div>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </div>
      </footer>

      {selectedCamp ? <CampDetail camp={selectedCamp} onClose={closeCamp} /> : null}
    </main>
  );
}
