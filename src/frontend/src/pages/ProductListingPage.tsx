import { useState, useMemo } from 'react';
import { useWatches } from '@/hooks/useWatches';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ProductListingPage() {
  const { allWatches, isLoading, error } = useWatches();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | 'none'>('none');

  const filteredWatches = useMemo(() => {
    if (!allWatches) return [];

    let filtered = [...allWatches];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (watch) =>
          watch.name.toLowerCase().includes(term) ||
          watch.company.toLowerCase().includes(term) ||
          watch.modelNumber.toLowerCase().includes(term)
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (watch) => Number(watch.price) >= priceRange[0] && Number(watch.price) <= priceRange[1]
    );

    // Gender filter
    if (selectedGenders.length > 0) {
      filtered = filtered.filter((watch) => selectedGenders.includes(watch.gender));
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((watch) => selectedBrands.includes(watch.company));
    }

    // Sort by price
    if (sortBy === 'asc') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'desc') {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return filtered;
  }, [allWatches, searchTerm, priceRange, selectedGenders, selectedBrands, sortBy]);

  const availableBrands = useMemo(() => {
    if (!allWatches) return [];
    return Array.from(new Set(allWatches.map((watch) => watch.company))).sort();
  }, [allWatches]);

  const maxPrice = useMemo(() => {
    if (!allWatches || allWatches.length === 0) return 100000;
    return Math.max(...allWatches.map((watch) => Number(watch.price)));
  }, [allWatches]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load products. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-charcoal py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center font-serif text-4xl font-bold text-luxury-white md:text-5xl">
          Our Collection
        </h1>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <FilterSidebar
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedGenders={selectedGenders}
            onGendersChange={setSelectedGenders}
            selectedBrands={selectedBrands}
            onBrandsChange={setSelectedBrands}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            availableBrands={availableBrands}
            maxPrice={maxPrice}
          />

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredWatches.length === 0 ? (
              <div className="rounded-lg bg-luxury-black/50 p-12 text-center">
                <p className="font-serif text-xl text-luxury-white">No watches found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredWatches.map((watch) => (
                  <ProductCard key={watch.id.toString()} watch={watch} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
