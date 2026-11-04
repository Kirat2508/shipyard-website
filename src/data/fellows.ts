/** Replace with per-fellow URLs when available. */
export const PLACEHOLDER_LINKEDIN =
  "https://in.linkedin.com/in/harkirat-singh-hello";

export type Fellow = {
  id: string;
  name: string;
  /** Product name shown under the fellow's name. */
  role: string;
  /** Live product site; when set, a link icon is shown next to the product name. */
  productUrl?: string;
  imageSrc: string;
  linkedinUrl: string;
  /** Optional 1–3 line bio; omit or empty to hide. */
  bio?: string;
};

const abhimanyu: Fellow = {
  id: "abhimanyu",
  name: "Abhimanyu",
  role: "Zipply",
  productUrl: "https://www.tryzipply.com/",
  imageSrc: "/images/fellows/abhimanyu.png",
  linkedinUrl: "https://www.linkedin.com/in/abhimanyu-dwivedi/",
  bio: "AI job search concierge that tracks roles, scores fit, and applies on your behalf.",
};

const sashank: Fellow = {
  id: "sashank",
  name: "Sashank",
  role: "Earshot",
  productUrl: "https://www.kupsas.com/earshot",
  imageSrc: "/images/fellows/Sashank.jpg",
  linkedinUrl: PLACEHOLDER_LINKEDIN,
  bio: "Human-in-the-loop social media automation to get leads for your business and build brand reputation.",
};

const sankalp: Fellow = {
  id: "sankalp",
  name: "Sankalp",
  role: "MeraTalent",
  productUrl: "https://www.meratalent.com",
  imageSrc: "/images/fellows/sankalp.jpg",
  linkedinUrl: PLACEHOLDER_LINKEDIN,
  bio: "AI powered career intelligence that finds the best-fit roles and helps you position yourself to land them.",
};

const prerna: Fellow = {
  id: "prerna",
  name: "Prerna",
  role: "nomira.in",
  productUrl: "https://travel-app-beta-mauve.vercel.app/",
  imageSrc: "/images/fellows/prerna.png",
  linkedinUrl: "https://www.linkedin.com/in/prernaaagarwal/",
  bio: "Women-first travel app for safety tips, buddies, planning, and real insights.",
};

/** Season 2 fellows (after the four featured cards). */
const season2Fellows: Fellow[] = [
  {
    id: "yasaswini",
    name: "Yasaswini",
    role: "yomnita",
    productUrl: "https://www.yomnita.com",
    imageSrc: "/images/fellows/yasawini.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Grading assistant that evaluates a student's assessment at a conceptual level.",
  },
  {
    id: "gursharan",
    name: "Gursharan",
    role: "Agentagon",
    productUrl: "https://www.agentagon.ai",
    imageSrc: "/images/fellows/Gursharan.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Self-improving production infra to improve your AI agents.",
  },
  {
    id: "karthik",
    name: "Karthik",
    role: "Shop Copilot",
    productUrl: "https://www.copilotverse.io/products/shop-copilot",
    imageSrc: "/images/fellows/karthik.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "The AI that runs your shop: it sells, designs on demand, and markets it for you.",
  },
  {
    id: "renuka",
    name: "Renuka",
    role: "Resquare",
    productUrl: "https://www.resquare.in/",
    imageSrc: "/images/fellows/renuka.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "One place for students to find all tech opportunities.",
  },
  {
    id: "bhuvanesh",
    name: "Bhuvaneswaran P",
    role: "Peach",
    productUrl: "https://www.gotopeach.com/",
    imageSrc: "/images/fellows/bhuvanesh.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Peach tells you if your brand shows up when buyers ask AI and exactly what to do if it doesn't.",
  },
  {
    id: "divyansh",
    name: "Divyansh",
    role: "ITGMS",
    productUrl: "https://itgms.codefane.in/",
    imageSrc: "/images/fellows/divyansh.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Unified IT support, asset tracking, and governance for smarter enterprise operations in one platform.",
  },
  {
    id: "uday",
    name: "Uday",
    role: "ITGMS",
    productUrl: "https://itgms.codefane.in/",
    imageSrc: "/images/fellows/uday.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Unified IT support, asset tracking, and governance for smarter enterprise operations in one platform.",
  },
  {
    id: "kiran",
    name: "Kiran",
    role: "Reality Check AI",
    productUrl: "https://realitycheck.co.in/",
    imageSrc: "/images/fellows/kiran.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "A platform for students and working professionals to gain clarity about what they want to do in their lives.",
  },
  {
    id: "ancy",
    name: "Ancy",
    role: "MyHealthOS",
    productUrl: "https://www.myhealthos.in",
    imageSrc: "/images/fellows/ancy.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Bringing all your healthcare records into one secure, AI-powered platform.",
  },
  {
    id: "chaitanya",
    name: "Chaitanya",
    role: "Mahaul",
    productUrl: "https://kahanilab.com/",
    imageSrc: "/images/fellows/Chaitanya.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Mahaul is a digital card game that takes any conversation beyond small talk via fun and engaging questions.",
  },
  {
    id: "saharsh",
    name: "Saharsh",
    role: "DrawX",
    productUrl: "https://www.getdrawx.com/",
    imageSrc: "/images/fellows/saharsh.jpg",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "DrawX turns a GitHub repo, a PDF, a URL, or a single sentence into a clean, accurate diagram.",
  },
];

/** Season 1 fellows (after Season 2; excludes Abhimanyu and Prerna, shown in featured row). */
const season1Fellows: Fellow[] = [
  {
    id: "kamalika",
    name: "Kamalika",
    role: "Ninja Money",
    imageSrc: "/images/fellows/kamalika.png",
    linkedinUrl: "https://www.linkedin.com/in/kamalika-poddar/",
    bio: "AI-native DPO protecting fintechs from compliance risks and massive fines.",
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

/** Fellows added for the S IV site. */
const season4Additions: Fellow[] = [
  {
    id: "mohammed",
    name: "Mohammed Hidayathulla",
    role: "blute.ai",
    productUrl: "https://www.blute.ai/",
    imageSrc: "/images/fellows/mohammed-hidayathulla.webp",
    linkedinUrl: "https://www.linkedin.com/in/mohammed-hidayathulla-90485a139/",
  },
  {
    id: "guru",
    name: "Guru Sasidhar Pattemru",
    role: "Bloom UPSC",
    productUrl: "https://bloomupsc.com/",
    imageSrc: "/images/fellows/guru-sasidhar.png",
    linkedinUrl: "https://www.linkedin.com/in/gurusasidhar/",
  },
  {
    id: "vineet",
    name: "Vineet Mehta",
    role: "Mizual",
    productUrl: "https://mizual.ai/",
    imageSrc: "/images/fellows/vineet.webp",
    linkedinUrl: "https://www.linkedin.com/in/vinm007/",
  },
  {
    id: "anuj",
    name: "Anuj",
    role: "KahaniLab",
    productUrl: "https://kahanilab.com/",
    imageSrc: "/images/fellows/anuj.png",
    linkedinUrl: "https://www.linkedin.com/in/anuj-khandalikar/",
  },
  {
    id: "sameena",
    name: "Sameena",
    role: "Gossips",
    productUrl: "https://gossips.shop/",
    imageSrc: "/images/fellows/sameena.webp",
    linkedinUrl: "https://www.linkedin.com/in/sameena-tanjum/",
  },
];

/** Featured first, then Season 2, then remaining Season 1. */
export const fellows: Fellow[] = [
  abhimanyu,
  sashank,
  sankalp,
  prerna,
  ...season2Fellows,
  ...season1Fellows,
];

/** The fellows shown on the home page, in display order. */
const FEATURED_IDS = [
  "abhimanyu",
  "sashank",
  "mohammed",
  "guru",
  "kamalika",
  "gursharan",
  "renuka",
  "vineet",
  "chaitanya",
  "anuj",
  "bhuvanesh",
  "prerna",
  "sameena",
];

const allFellows = [...fellows, ...season4Additions];

export const featuredFellows: Fellow[] = FEATURED_IDS.map((id) => {
  const fellow = allFellows.find((f) => f.id === id);
  if (!fellow) throw new Error(`Unknown featured fellow: ${id}`);
  return fellow;
});
