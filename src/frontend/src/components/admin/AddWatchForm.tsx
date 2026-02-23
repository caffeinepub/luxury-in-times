import { useState } from 'react';
import { useActor } from '@/hooks/useActor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

export default function AddWatchForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    modelNumber: '',
    price: '',
    gender: 'Men',
    description: '',
    isFeatured: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = imageFiles.length;
    const newFiles = files.slice(0, 5 - currentCount);

    if (files.length > newFiles.length) {
      toast.error('Maximum 5 images allowed');
    }

    if (newFiles.length > 0) {
      setImageFiles([...imageFiles, ...newFiles]);
      
      // Generate previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error('Backend not initialized');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert all images to Uint8Array
      const imagePromises = imageFiles.map(file => file.arrayBuffer());
      const imageBuffers = await Promise.all(imagePromises);
      const imageBytes = imageBuffers.map(buffer => new Uint8Array(buffer));

      await actor.addWatch(
        formData.name,
        formData.company,
        formData.modelNumber,
        BigInt(formData.price),
        formData.gender,
        formData.description,
        imageBytes,
        formData.isFeatured
      );

      toast.success('Watch added successfully');
      setFormData({
        name: '',
        company: '',
        modelNumber: '',
        price: '',
        gender: 'Men',
        description: '',
        isFeatured: false,
      });
      setImageFiles([]);
      setImagePreviews([]);
      queryClient.invalidateQueries({ queryKey: ['watches'] });
    } catch (error) {
      console.error('Error adding watch:', error);
      toast.error('Failed to add watch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="name" className="text-luxury-white">
            Watch Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-2 border-luxury-gold/30 bg-luxury-black text-luxury-white"
          />
        </div>

        <div>
          <Label htmlFor="company" className="text-luxury-white">
            Company *
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
            className="mt-2 border-luxury-gold/30 bg-luxury-black text-luxury-white"
          />
        </div>

        <div>
          <Label htmlFor="modelNumber" className="text-luxury-white">
            Model Number *
          </Label>
          <Input
            id="modelNumber"
            value={formData.modelNumber}
            onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
            required
            className="mt-2 border-luxury-gold/30 bg-luxury-black text-luxury-white"
          />
        </div>

        <div>
          <Label htmlFor="price" className="text-luxury-white">
            Price ($) *
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            min="0"
            className="mt-2 border-luxury-gold/30 bg-luxury-black text-luxury-white"
          />
        </div>

        <div>
          <Label htmlFor="gender" className="text-luxury-white">
            Gender *
          </Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger className="mt-2 border-luxury-gold/30 bg-luxury-black text-luxury-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-luxury-gold/30 bg-luxury-black text-luxury-white">
              <SelectItem value="Men">Men</SelectItem>
              <SelectItem value="Women">Women</SelectItem>
              <SelectItem value="Unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="images" className="text-luxury-white">
            Images * (1-5 images)
          </Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={imageFiles.length >= 5}
            className="mt-2 border-luxury-gold/30 bg-luxury-black text-luxury-white file:text-luxury-white"
          />
          <p className="mt-1 text-xs text-luxury-champagne">
            {imageFiles.length} of 5 images selected
          </p>
        </div>
      </div>

      {imagePreviews.length > 0 && (
        <div>
          <Label className="text-luxury-white">Image Previews</Label>
          <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <div className="aspect-square overflow-hidden rounded-lg border border-luxury-gold/20 bg-luxury-ivory">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-luxury-gold p-1 text-luxury-black transition-all hover:bg-luxury-gold/80"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 rounded bg-luxury-gold px-2 py-1 text-xs font-semibold text-luxury-black">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="description" className="text-luxury-white">
          Description *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
          className="mt-2 border-luxury-gold/30 bg-luxury-black text-luxury-white"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isFeatured"
          checked={formData.isFeatured}
          onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked as boolean })}
          className="border-luxury-gold/50 data-[state=checked]:bg-luxury-gold data-[state=checked]:text-luxury-black"
        />
        <Label htmlFor="isFeatured" className="cursor-pointer text-luxury-white">
          Feature this watch on homepage
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black font-serif text-lg font-semibold text-luxury-gold hover:bg-luxury-gold hover:text-black disabled:opacity-50"
      >
        {isSubmitting ? 'Adding Watch...' : 'Add Watch'}
      </Button>
    </form>
  );
}
