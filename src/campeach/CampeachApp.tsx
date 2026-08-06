import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock3,
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
            <a href={whatsappFor(camp, 'availability')} target="_blank" rel="noreferrer">
              <MessageCircle size={19} />
              WhatsApp con contexto listo
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

  useEffect(() => {
    document.title = 'Campeach RD | Campamentos y equipos en RD';
    const params = new URLSearchParams(window.location.search);
    const campId = params.get('camp');
    const equipmentId = params.get('equipment');

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

  return (
    <main className="campeach-page">
      <header className="campeach-header">
        <a className="campeach-logo" href={import.meta.env.BASE_URL} aria-label="Campeach RD">
          <img src={logoImage} alt="Campeach RD" />
        </a>
        <nav aria-label="Secciones">
          <a href="#campamentos">Campamentos</a>
          <a href="#equipos">Equipos</a>
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
