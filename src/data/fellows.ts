/** Replace with per-fellow URLs when available. */
export const PLACEHOLDER_LINKEDIN =
  "https://in.linkedin.com/in/harkirat-singh-hello";

export type Fellow = {
  id: string;
  name: string;
  /** Tagline under the name (e.g. company, batch). */
  role: string;
  imageSrc: string;
  linkedinUrl: string;
  /** Optional 1–3 line bio; omit or empty to hide. */
  bio?: string;
};

export const fellows: Fellow[] = [
  {
    id: "kamalika",
    name: "Kamalika",
    role: "AI Learn Circle fellow",
    imageSrc: "/images/fellows/kamalika.png",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Shipping real products with the community; focused on learning in public.",
  },
  {
    id: "abhimanyu",
    name: "Abhimanyu",
    role: "AI Learn Circle fellow",
    imageSrc: "/images/fellows/abhimanyu.png",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Building end-to-end flows and turning workshops into shipped software.",
  },
  {
    id: "prerna",
    name: "Prerna",
    role: "AI Learn Circle fellow",
    imageSrc: "/images/fellows/prerna.png",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Presenting and refining ideas with peers who care about execution.",
  },
  {
    id: "sukshita",
    name: "Sukshita",
    role: "AI Learn Circle fellow",
    imageSrc: "/images/fellows/sukshita.png",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Pairing product clarity with hands-on AI builds.",
  },
  {
    id: "suresh",
    name: "Suresh",
    role: "AI Learn Circle fellow",
    imageSrc: "/images/fellows/suresh.png",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "From first user conversations to launches—with the cohort as a sounding board.",
  },
  {
    id: "pranjal",
    name: "Pranjal",
    role: "AI Learn Circle fellow",
    imageSrc: "/images/fellows/pranjal.png",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Iterating fast with mentors and builders in the room.",
  },
  {
    id: "mohith",
    name: "Mohith",
    role: "AI Learn Circle fellow",
    imageSrc: "/images/fellows/mohith.png",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Shipping MVPs and tightening loops with honest critique.",
  },
  {
    id: "suvrita",
    name: "Suvrita",
    role: "AI Learn Circle fellow",
    imageSrc: "/images/fellows/suvrita.png",
    linkedinUrl: PLACEHOLDER_LINKEDIN,
    bio: "Growing with Project Shipyard—from ideation through GTM.",
  },
];
