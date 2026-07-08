export const demo = {
  bedrijf: "De Zonmeester",
  tagline: "Zonwering & kozijnen op maat",
  regio: "Utrecht en omgeving",
  telefoon: "030 - 123 45 67",
  telefoonTel: "0301234567",
  whatsapp: "31612345678",
  email: "info@dezonmeester.nl",
  kleur: "#0d9488",
  kleurDonker: "#0f766e",
  sinds: "2010",
  stats: [
    { value: "15+", label: "Jaar ervaring" },
    { value: "1.200+", label: "Klanten" },
    { value: "4.9", label: "Google" },
    { value: "24u", label: "Offerte" },
  ],
  diensten: [
    {
      titel: "Screens",
      tekst: "Zonwering met behoud van uitzicht. Inmeten en monteren door eigen team.",
      vanaf: "€340",
      icon: "▣",
    },
    {
      titel: "Rolluiken",
      tekst: "Veiligheid, isolatie en comfort. Elektrisch of handbediend.",
      vanaf: "€372",
      icon: "▤",
    },
    {
      titel: "Knikarm",
      tekst: "Terras en tuin. Windbestendige doeken, strak design.",
      vanaf: "€955",
      icon: "◫",
    },
    {
      titel: "Kozijnen",
      tekst: "Vervanging, onderhoud en advies. Kunststof en hout.",
      vanaf: "Offerte",
      icon: "⌂",
    },
  ],
  reviews: [
    {
      naam: "Jan de Boer",
      plaats: "Utrecht",
      tekst: "Snelle offerte, nette montage. Aanrader!",
      sterren: 5,
    },
    {
      naam: "Maria Visser",
      plaats: "Zeist",
      tekst: "Screens op alle ramen. Precies wat we zochten.",
      sterren: 5,
    },
    {
      naam: "Tom Bakker",
      plaats: "Amersfoort",
      tekst: "Eerlijk advies, geen gedoe. Top vakmannen.",
      sterren: 5,
    },
  ],
  usps: [
    "Gratis advies aan huis",
    "Offerte binnen 24 uur",
    "Eigen monteurs",
    "5 jaar garantie",
  ],
  stappen: [
    { stap: "1", titel: "Bel of app", tekst: "Vertel kort wat u zoekt — wij denken mee." },
    { stap: "2", titel: "Advies & offerte", tekst: "Vaak binnen 24 uur een vaste prijs, geen verrassingen." },
    { stap: "3", titel: "Montage", tekst: "Eigen vakmensen, netjes opgeleverd en uitgelegd." },
  ],
  werkgebied: ["Utrecht", "Zeist", "Amersfoort", "Houten", "Nieuwegein", "De Bilt"],
  over: "De Zonmeester is een familiebedrijf uit de regio Utrecht. Wij meten, adviseren en monteren zelf — geen onderaannemers, wel één aanspreekpunt van offerte tot oplevering.",
  faq: [
    {
      v: "Hoe snel kan ik een offerte krijgen?",
      a: "Meestal binnen 24 uur na uw bericht of korte intake aan de telefoon.",
    },
    {
      v: "Komen jullie gratis langs voor advies?",
      a: "Ja, in ons werkgebied plannen we vrijblijvend een adviesgesprek aan huis.",
    },
    {
      v: "Wat kost een screen gemiddeld?",
      a: "Vanaf circa €340 per raam, afhankelijk van maat en bediening. U krijgt altijd een vaste offerte vooraf.",
    },
  ],
} as const;