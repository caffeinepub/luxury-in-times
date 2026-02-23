import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative mx-auto max-w-2xl">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-gold" />
      <Input
        type="text"
        placeholder="Search by name, company, or model number..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-14 border-luxury-gold/30 bg-luxury-black pl-12 font-serif text-luxury-white placeholder:text-luxury-white/50 focus:border-luxury-gold focus:ring-luxury-gold"
      />
    </div>
  );
}
