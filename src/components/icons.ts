
import {ArrowRight, Check, ChevronsUpDown, Circle, Copy, Edit, ExternalLink, File, HelpCircle, Home, Loader2, Mail, MessageSquare, Moon, Plus, PlusCircle, Search, Server, Settings, Share2, Shield, Sun, Trash, User, X, Workflow, Terminal} from 'lucide-react'; // Added Terminal & Loader2
import { Logo } from './icons/logo';

const Icons = {
  logo: Logo,
  arrowRight: ArrowRight,
  check: Check,
  chevronDown: ChevronsUpDown, // Corrected: Use ChevronsUpDown instead of ChevronDown
  circle: Circle,
  workflow: Workflow,
  close: X,
  copy: Copy,
  dark: Moon,
  edit: Edit,
  externalLink: ExternalLink,
  file: File,
  help: HelpCircle,
  home: Home,
  light: Sun,
  loader: Loader2, // Keep original loader if used elsewhere
  mail: Mail,
  messageSquare: MessageSquare,
  plus: Plus,
  plusCircle: PlusCircle,
  search: Search,
  server: Server,
  settings: Settings,
  share: Share2,
  shield: Shield,
  spinner: Loader2, // Use Loader2 for spinner as well
  terminal: Terminal,
  trash: Trash,
  user: User,
};

export {Icons};
