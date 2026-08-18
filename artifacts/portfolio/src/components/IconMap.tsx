import {
  SiReact,
  SiNextdotjs,
  SiVite,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiReactquery,
  SiNodedotjs,
  SiExpress,
  SiPrisma,
  SiZod,
  SiJsonwebtokens,
  SiMongodb,
  SiPostgresql,
  SiSupabase,
  SiNeon,
  SiRedis,
  SiGithub,
  SiGithubactions,
  SiVercel,
  SiVitest,
  SiPostman,
  SiOpenaigym
} from 'react-icons/si';

import { VscAzure, VscAzureDevops, VscVscode } from 'react-icons/vsc';
import { TbLetterK } from 'react-icons/tb';
import { FaInfinity, FaBug, FaVial, FaSpaceShuttle, FaHeart, FaMoon, FaLinkedin } from 'react-icons/fa';

export const AntigravityIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 20L12 5L19 20" />
  </svg>
);

export const IconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  SiReact,
  SiNextdotjs,
  SiVite,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiReactquery,
  SiNodedotjs,
  SiExpress,
  SiPrisma,
  SiZod,
  SiJsonwebtokens,
  SiMongodb,
  SiPostgresql,
  SiSupabase,
  SiNeon,
  SiRedis,
  SiGithub,
  SiGithubactions,
  SiVercel,
  SiVitest,
  SiPostman,
  SiOpenaigym,
  FaLinkedin,
  VscAzure,
  VscAzureDevops,
  VscVscode,
  FaInfinity,
  FaBug,
  FaVial,
  FaSpaceShuttle,
  FaHeart,
  FaMoon,
  TbLetterK,
  AntigravityIcon
};
