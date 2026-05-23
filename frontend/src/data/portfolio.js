import {
  BadgeCheck,
  Boxes,
  BrainCircuit,
  Code2,
  Database,
  Github,
  Instagram,
  Layers3,
  Linkedin,
  MonitorSmartphone,
  Palette,
  Rocket,
  ServerCog,
  Smartphone,
  Workflow,
} from "lucide-react";

import hilmiPortrait from "../assets/hilmi_portrait.png";
import hilmi1 from "../assets/hilmi1.jpg";
import infraschMockup from "../assets/infrasch_mockup.png";
import natureLake from "../assets/nature_lake.png";
import guitarStage from "../assets/guitar_stage.png";
import heroLayer from "../assets/hero.png";

export const navItems = [{ id: "memories" }, { id: "journey" }, { id: "gallery" }, { id: "growth" }, { id: "future" }];

export const profile = {
  name: "Hilmi Abdurrafi Putra Setiawan",
  shortName: "Hilmi Abdurrafi",
  location: "Cimahi, Jawa Barat",
  email: "hilmip637@gmail.com",
  phone: "+62 881-4595-216",
  github: "https://github.com/hilmi-putra",
  linkedin: "https://linkedin.com/in/hilmi-abdurrafi-putra-setiawan-051416367",
};

export const heroVisuals = {
  portrait: hilmi1,
  layer: heroLayer,
};

export const memoryMeta = [{ icon: Code2 }, { icon: MonitorSmartphone }, { icon: BrainCircuit }];

export const galleryMeta = [
  {
    image: hilmiPortrait,
    span: "lg:col-span-5 lg:row-span-2",
  },
  {
    image: infraschMockup,
    span: "lg:col-span-4",
  },
  {
    image: heroLayer,
    span: "lg:col-span-3",
  },
  {
    image: natureLake,
    span: "lg:col-span-4",
  },
  {
    image: guitarStage,
    span: "lg:col-span-3",
  },
];

export const skillGroupMeta = [
  {
    icon: Palette,
    color: "bg-blue-500 text-white",
  },
  {
    icon: ServerCog,
    color: "bg-lime-300 text-slate-950",
  },
  {
    icon: Database,
    color: "bg-slate-950 text-white",
  },
  {
    icon: Workflow,
    color: "bg-emerald-400 text-slate-950",
  },
];

export const growthHighlightMeta = [{ icon: BadgeCheck }, { icon: Boxes }, { icon: Layers3 }];

export const futureProjectMeta = [
  {
    icon: Workflow,
    images: [infraschMockup, heroLayer, hilmiPortrait],
    liveUrl: "#future",
    githubUrl: profile.github,
    caseStudyUrl: "#future",
  },
  {
    icon: Layers3,
    images: [heroLayer, infraschMockup, natureLake],
    liveUrl: "#future",
    githubUrl: profile.github,
    caseStudyUrl: "#future",
  },
  {
    icon: MonitorSmartphone,
    images: [infraschMockup, hilmi1, heroLayer],
    liveUrl: "#future",
    githubUrl: profile.github,
    caseStudyUrl: "#future",
  },
  {
    icon: Rocket,
    images: [natureLake, guitarStage, hilmiPortrait],
    liveUrl: "#future",
    githubUrl: profile.github,
    caseStudyUrl: "#future",
  },
];

export const projectArchiveMeta = [
  {
    icon: Workflow,
    images: [infraschMockup, heroLayer, hilmiPortrait],
    size: "lg:col-span-8 lg:row-span-2",
    accent: "dark",
    liveUrl: "#",
    githubUrl: profile.github,
    figmaUrl: "#",
  },
  {
    icon: Layers3,
    images: [heroLayer, infraschMockup, natureLake],
    size: "lg:col-span-4",
    accent: "light",
    liveUrl: "#",
    githubUrl: profile.github,
    figmaUrl: "#",
  },
  {
    icon: MonitorSmartphone,
    images: [infraschMockup, hilmi1, heroLayer],
    size: "lg:col-span-4",
    accent: "light",
    liveUrl: "#",
    githubUrl: profile.github,
    figmaUrl: "#",
  },
  {
    icon: Rocket,
    images: [natureLake, guitarStage, hilmiPortrait],
    size: "lg:col-span-8",
    accent: "lime",
    liveUrl: "#",
    githubUrl: profile.github,
    figmaUrl: "#",
  },
  {
    icon: Database,
    images: [heroLayer, infraschMockup, hilmiPortrait],
    size: "lg:col-span-6",
    accent: "light",
    liveUrl: "#",
    githubUrl: profile.github,
    figmaUrl: "#",
  },
  {
    icon: Smartphone,
    images: [infraschMockup, natureLake, heroLayer],
    size: "lg:col-span-6",
    accent: "dark",
    liveUrl: "#",
    githubUrl: profile.github,
    figmaUrl: "#",
  },
  {
    icon: Palette,
    images: [hilmiPortrait, guitarStage, natureLake],
    size: "lg:col-span-4",
    accent: "light",
    liveUrl: "#",
    githubUrl: profile.github,
    figmaUrl: "#",
  },
  {
    icon: ServerCog,
    images: [heroLayer, hilmi1, infraschMockup],
    size: "lg:col-span-8",
    accent: "light",
    liveUrl: "#",
    githubUrl: profile.github,
    figmaUrl: "#",
  },
];

export const footerLinks = [
  { icon: Github, label: "GitHub", href: profile.github },
  { icon: Linkedin, label: "LinkedIn", href: profile.linkedin },
  { icon: Instagram, label: "Instagram", href: `https://instagram.com/hilmiabrptra` },
];
