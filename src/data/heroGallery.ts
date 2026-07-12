import { interleave } from "./interleave";

export type GallerySlide = {
  src: string;
  alt: string;
};

const season1Gallery: GallerySlide[] = [
  { src: "/images/gallery/shipyard_audience.png", alt: "Shipyard audience at a session" },
  { src: "/images/gallery/kamalika_demo.jpeg", alt: "Kamalika presenting a builder demo" },
  { src: "/images/gallery/demo-day_1.jpeg", alt: "Demo day celebration" },
  { src: "/images/gallery/pranjal_demo.jpeg", alt: "Pranjal presenting a cohort demo" },
  { src: "/images/gallery/aayushi_session.jpeg", alt: "Workshop session with the community" },
  { src: "/images/gallery/abhimanyu_demo.jpeg", alt: "Abhimanyu sharing a product demo" },
  { src: "/images/gallery/shipyard_dinner.jpeg", alt: "Shipyard community dinner" },
  { src: "/images/gallery/nikita_demo.jpeg", alt: "Nikita presenting at Shipyard" },
  { src: "/images/gallery/suvrita_demo.jpeg", alt: "Suvrita builder demo" },
  { src: "/images/gallery/harkirat_demo_day.png", alt: "Demo day on stage" },
  { src: "/images/gallery/aayushi_session_2.jpeg", alt: "Community workshop session" },
  { src: "/images/gallery/ani_harkirat.jpeg", alt: "Shipyard hosts and attendees" },
  { src: "/images/gallery/anshul_session.jpeg", alt: "Session with Anshul" },
  { src: "/images/gallery/bhawana_demo_day.png", alt: "Demo day with Bhawana" },
  { src: "/images/gallery/ritesh_demo.jpeg", alt: "Ritesh presenting a builder demo" },
];

const season2Gallery: GallerySlide[] = [
  { src: "/images/gallery/IMG_8073.JPG", alt: "Project Shipyard Season 2 cohort" },
  { src: "/images/gallery/IMG_8078.JPG", alt: "Builders at a Shipyard session" },
  { src: "/images/gallery/aditya-session.jpeg", alt: "Aditya leading a Shipyard session" },
  { src: "/images/gallery/aditya-session-audience.jpeg", alt: "Audience at Aditya's session" },
  { src: "/images/gallery/rishabh-session.png", alt: "Rishabh session at Shipyard" },
  { src: "/images/gallery/vivek-session.png", alt: "Vivek Raju session at Shipyard" },
  { src: "/images/gallery/vivek-card.jpeg", alt: "Vivek Raju at Shipyard" },
  { src: "/images/gallery/vivek-bhuva.jpeg", alt: "Vivek and Bhuvanesh at Shipyard" },
  { src: "/images/gallery/shipyard_lunch.jpeg", alt: "Shipyard cohort lunch" },
  { src: "/images/gallery/kapoor-cafe.jpeg", alt: "Shipyard builders at Kapoor Cafe" },
  { src: "/images/gallery/dinner-dhanushya.jpeg", alt: "Cohort dinner" },
  { src: "/images/gallery/chaitanya-demo.jpeg", alt: "Chaitanya presenting a demo" },
  { src: "/images/gallery/ancy-demo.jpeg", alt: "Ancy presenting a demo" },
  { src: "/images/gallery/bindya-demo.jpeg", alt: "Bindya presenting a demo" },
  { src: "/images/gallery/kiran-demo.jpeg", alt: "Kiran presenting a demo" },
  { src: "/images/gallery/renuka-demo.jpeg", alt: "Renuka presenting a demo" },
  { src: "/images/gallery/saharsh-demo.jpeg", alt: "Saharsh presenting a demo" },
  { src: "/images/gallery/sankalp-image.jpeg", alt: "Sankalp at Shipyard" },
  { src: "/images/gallery/sankalp-demo.jpeg", alt: "Sankalp presenting a demo" },
  { src: "/images/gallery/gursharan.jpeg", alt: "Gursharan at Shipyard" },
  { src: "/images/gallery/abhimanyu-image.jpeg", alt: "Abhimanyu at Shipyard Season 2" },
];

export const heroGallerySlides = interleave(season1Gallery, season2Gallery);
