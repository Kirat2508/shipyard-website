/** Replace with per-fellow URLs when available. */
export const PLACEHOLDER_LINKEDIN =
  "https://in.linkedin.com/in/harkirat-singh-hello";

export type Fellow = {
  id: string;
  name: string;
  /** Tagline under the name (e.g. company, batch). */
  role: string;
  /** Live product site; when set, a link icon is shown next to the product name. */
  productUrl?: string;
  imageSrc: string;
  linkedinUrl: string;
  /** Optional 1–3 line bio; omit or empty to hide. */
  bio?: string;
};

export const fellows: Fellow[] = [
  {
    id: "kamalika",
    name: "Kamalika",
    role: "Ninja Money",
    imageSrc: "/images/fellows/kamalika.png",
    linkedinUrl: "https://www.linkedin.com/in/kamalika-poddar/",
    bio: "AI-native DPO protecting fintechs from compliance risks and massive fines.",
  },
  {
    id: "abhimanyu",
    name: "Abhimanyu",
    role: "Elsa.jobs",
    productUrl: "https://elsa.jobs",
    imageSrc: "/images/fellows/abhimanyu.png",
    linkedinUrl: "https://www.linkedin.com/in/abhimanyu-dwivedi/",
    bio: "AI concierge using autonomous agents to supercharge your job search.",
  },
  {
    id: "prerna",
    name: "Prerna",
    role: "nomira.in",
    productUrl: "https://travel-app-beta-mauve.vercel.app/",
    imageSrc: "/images/fellows/prerna.png",
    linkedinUrl: "https://www.linkedin.com/in/prernaaagarwal/",
    bio: "Women-first travel app for safety tips, buddies, planning, and real insights.",
  },
  {
    id: "sukshita",
    name: "Sukshita",
    role: "CiteIQ",
    productUrl: "https://geo-intel-tau.vercel.app/",
    imageSrc: "/images/fellows/sukshita.png",
    linkedinUrl: "https://www.linkedin.com/in/sukshitha-rao-77356a102/",
    bio: "AI visibility platform showing why AI engines ignore your brand and fixes.",
  },
  {
    id: "suresh",
    name: "Suresh",
    role: "CiteIQ",
    productUrl: "https://geo-intel-tau.vercel.app/",
    imageSrc: "/images/fellows/suresh.png",
    linkedinUrl: "https://www.linkedin.com/in/suresh9043/",
    bio: "AI visibility platform showing why AI engines ignore your brand and fixes.",
  },
  {
    id: "pranjal",
    name: "Pranjal",
    role: "Tinkerers Space",
    productUrl: "https://tinkerers.space",
    imageSrc: "/images/fellows/pranjal.png",
    linkedinUrl: "https://www.linkedin.com/in/pranjal-kitn/",
    bio: "Deployment platform helping vibecoders ship and host projects effortlessly.",
  },
  {
    id: "mohith",
    name: "Mohith",
    role: "Verisolve",
    productUrl: "https://verisolve.sirune.tech",
    imageSrc: "/images/fellows/mohith.png",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "AI-powered UVM scaffolding and seamless SystemVerilog debugging in VS Code.",
  },
  {
    id: "suvrita",
    name: "Suvrita",
    role: "Reflective Therapist Chatbot",
    productUrl: "https://chat.suvrita.com/",
    imageSrc: "/images/fellows/suvrita.png",
    linkedinUrl: "https://www.linkedin.com/in/suvrita-323aa2a7/",
    bio: "AI mentor for therapists handling nuanced business and ethical practice questions.",
  },
  {
    id: "nikita",
    name: "Nikita",
    role: "TravelDoc",
    productUrl: "https://travel-doc-nikitag3103-8332s-projects.vercel.app/",
    imageSrc: "/images/fellows/nikita.png",
    linkedinUrl: "https://www.linkedin.com/in/nikitagupta31/",
    bio: "Connects travellers with verified English-speaking doctors anywhere in minutes.",
  },
];
