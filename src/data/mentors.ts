export type Mentor = {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
};

/** Co-founders shown first in the mentors grid; Rishabh leads the row. */
const founderMentors: Mentor[] = [
  {
    id: "rishabh",
    name: "Rishabh Goel",
    role: "Co-Founder, Dodo Payments",
    imageSrc: "/images/mentors/rishabh-dodo.jpeg",
  },
  {
    id: "ashutosh",
    name: "Ashutosh Singh",
    role: "Co-Founder, RevRag.AI",
    imageSrc: "/images/mentors/ashutosh_Co-Founder_Revrag_ai.png",
  },
  {
    id: "ayushi",
    name: "Ayushi",
    role: "Co-Founder, Magicroll.ai",
    imageSrc: "/images/mentors/ayushi_Co-Founder_Magicroll_ai.png",
  },
  {
    id: "prajwal",
    name: "Prajwal",
    role: "Co-Founder, Clueso",
    imageSrc: "/images/mentors/prajwal-clueso.jpg",
  },
];

const otherMentors: Mentor[] = [
  {
    id: "aaditya",
    name: "Aaditya Ramakrishnan",
    role: "Product Marketing Manager, Stripe",
    imageSrc: "/images/mentors/aaditya-ramakrishnan.jpeg",
  },
  {
    id: "karan",
    name: "Karan Bhargav",
    role: "Lead, Strategic Alliances, Venture Catalysts++",
    imageSrc: "/images/mentors/karan.png",
  },
  {
    id: "vivek",
    name: "Vivek Raju",
    role: "Narrative Consultant, Kathasys",
    imageSrc: "/images/mentors/vivek-raju.jpg",
  },
  {
    id: "anshul",
    name: "Anshul Tibrewala",
    role: "Marketing Director, Antler",
    imageSrc: "/images/mentors/anshul_Marketing_Director_Antler.png",
  },
  {
    id: "narendran",
    name: "Narendran Sivakumar",
    role: "Head of Marketing, Mela Ventures",
    imageSrc: "/images/mentors/narendran_Head_of_Marketing_Mela_Ventures.png",
  },
];

export const mentors = [...founderMentors, ...otherMentors];
