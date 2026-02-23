import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedGenders: string[];
  onGendersChange: (genders: string[]) => void;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  sortBy: 'asc' | 'desc' | 'none';
  onSortByChange: (sort: 'asc' | 'desc' | 'none') => void;
  availableBrands: string[];
  maxPrice: number;
}

function FilterContent({
  priceRange,
  onPriceRangeChange,
  selectedGenders,
  onGendersChange,
  selectedBrands,
  onBrandsChange,
  sortBy,
  onSortByChange,
  availableBrands,
  maxPrice,
}: FilterSidebarProps) {
  const genders = ['Men', 'Women', 'Unisex'];

  const handleGenderToggle = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      onGendersChange(selectedGenders.filter((g) => g !== gender));
    } else {
      onGendersChange([...selectedGenders, gender]);
    }
  };

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Sort By Price */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-luxury-gold" />
          <h3 className="font-serif text-xl font-bold text-luxury-gold">Sort By Price</h3>
        </div>
        <div className="space-y-3">
          <Button
            onClick={() => onSortByChange('none')}
            className={`w-full justify-start font-serif text-base transition-all ${
              sortBy === 'none'
                ? 'bg-luxury-gold text-black hover:bg-luxury-champagne'
                : 'bg-black text-luxury-gold hover:bg-luxury-gold hover:text-black'
            }`}
          >
            Default Order
          </Button>
          <Button
            onClick={() => onSortByChange('asc')}
            className={`w-full justify-start font-serif text-base transition-all ${
              sortBy === 'asc'
                ? 'bg-luxury-gold text-black hover:bg-luxury-champagne'
                : 'bg-black text-luxury-gold hover:bg-luxury-gold hover:text-black'
            }`}
          >
            Price: Low to High
          </Button>
          <Button
            onClick={() => onSortByChange('desc')}
            className={`w-full justify-start font-serif text-base transition-all ${
              sortBy === 'desc'
                ? 'bg-luxury-gold text-black hover:bg-luxury-champagne'
                : 'bg-black text-luxury-gold hover:bg-luxury-gold hover:text-black'
            }`}
          >
            Price: High to Low
          </Button>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold text-luxury-gold">Price Range</h3>
        <Slider
          min={0}
          max={maxPrice}
          step={100}
          value={priceRange}
          onValueChange={(value) => onPriceRangeChange(value as [number, number])}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-luxury-white">
          <span>${priceRange[0].toLocaleString()}</span>
          <span>${priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Gender Filter */}
      <div>
        <h3 className="mb-4 font-serif text-lg font-semibold text-luxury-gold">Gender</h3>
        <div className="space-y-3">
          {genders.map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={selectedGenders.includes(gender)}
                onCheckedChange={() => handleGenderToggle(gender)}
                className="border-luxury-gold/50 data-[state=checked]:bg-luxury-gold data-[state=checked]:text-luxury-black"
              />
              <Label
                htmlFor={`gender-${gender}`}
                className="cursor-pointer text-sm text-luxury-white"
              >
                {gender}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      {availableBrands.length > 0 && (
        <div>
          <h3 className="mb-4 font-serif text-lg font-semibold text-luxury-gold">Brand</h3>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {availableBrands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                  className="border-luxury-gold/50 data-[state=checked]:bg-luxury-gold data-[state=checked]:text-luxury-black"
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="cursor-pointer text-sm text-luxury-white"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar(props: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-80 rounded-lg bg-luxury-black/50 p-6 lg:block">
        <h2 className="mb-6 font-serif text-2xl font-bold text-luxury-white">Filters</h2>
        <FilterContent {...props} />
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-luxury-gold/30 bg-black text-luxury-gold hover:bg-luxury-gold hover:text-black"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters & Sort
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 border-luxury-gold/20 bg-luxury-black">
            <h2 className="mb-6 font-serif text-2xl font-bold text-luxury-white">Filters</h2>
            <FilterContent {...props} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
