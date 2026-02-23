import { useState, useEffect } from 'react';
import { useActor } from '@/hooks/useActor';
import { type Watch } from '@/backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { imageToUrl } from '@/lib/imageUtils';
import { X } from 'lucide-react';

interface EditWatchModalProps {
  watch: Watch;
  open: boolean;
  onClose: () => void;
}

export default function EditWatchModal({ watch, open, onClose }: EditWatchModalProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: watch.name,
    company: watch.company,
    modelNumber: watch.modelNumber,
    price: watch.price.toString(),
    gender: watch.gender,
    description: watch.description,
    isFeatured: watch.isFeatured,
  });
  const [existingImages, setExistingImages] = useState<Uint8Array[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    setFormData({
      name: watch.name,
      company: watch.company,
      modelNumber: watch.modelNumber,
      price: watch.price.toString(),
      gender: watch.gender,
      description: watch.description,
      isFeatured: watch.isFeatured,
    });
    setExistingImages([...watch.images]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
  }, [watch]);

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCount = existingImages.length + newImageFiles.length;
    const availableSlots = 5 - totalCount;
    const newFiles = files.slice(0, availableSlots);

    if (files.length > newFiles.length) {
      toast.error('Maximum 5 images allowed');
    }

    if (newFiles.length > 0) {
      setNewImageFiles([...newImageFiles, ...newFiles]);
      
      // Generate previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error('Backend not initialized');
      return;
    }

    const totalImages = existingImages.length + newImageFiles.length;
    if (totalImages === 0) {
      toast.error('Please keep or add at least one image');
      return;
    }

    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert new images to Uint8Array
      const newImagePromises = newImageFiles.map(file => file.arrayBuffer());
      const newImageBuffers = await Promise.all(newImagePromises);
      const newImageBytes = newImageBuffers.map(buffer => new Uint8Array(buffer));

      // Combine existing and new images
      const allImages = [...existingImages, ...newImageBytes];

      await actor.updateWatch(
        watch.id,
        formData.name,
        formData.company,
        formData.modelNumber,
        BigInt(formData.price),
        formData.gender,
        formData.description,
        allImages,
        formData.isFeatured
      );

      toast.success('Watch updated successfully');
      queryClient.invalidateQueries({ queryKey: ['watches'] });
      onClose();
    } catch (error) {
      console.error('Error updating watch:', error);
      toast.error('Failed to update watch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalImageCount = existingImages.length + newImageFiles.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-luxury-gold/20 bg-luxury-black text-luxury-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-luxury-gold">Edit Watch</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="edit-name" className="text-luxury-white">
                Watch Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-2 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-company" className="text-luxury-white">
                Company *
              </Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                className="mt-2 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-modelNumber" className="text-luxury-white">
                Model Number *
              </Label>
              <Input
                id="edit-modelNumber"
                value={formData.modelNumber}
                onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                required
                className="mt-2 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-price" className="text-luxury-white">
                Price ($) *
              </Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                className="mt-2 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white"
              />
            </div>

            <div>
              <Label htmlFor="edit-gender" className="text-luxury-white">
                Gender *
              </Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="mt-2 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white">
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
              <Label htmlFor="edit-images" className="text-luxury-white">
                Add More Images
              </Label>
              <Input
                id="edit-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImageChange}
                disabled={totalImageCount >= 5}
                className="mt-2 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white file:text-luxury-white"
              />
              <p className="mt-1 text-xs text-luxury-champagne">
                {totalImageCount} of 5 images
              </p>
            </div>
          </div>

          {(existingImages.length > 0 || newImagePreviews.length > 0) && (
            <div>
              <Label className="text-luxury-white">Images</Label>
              <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {existingImages.map((image, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <div className="aspect-square overflow-hidden rounded-lg border border-luxury-gold/20 bg-luxury-ivory">
                      <img
                        src={imageToUrl(image)}
                        alt={`Existing ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
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
                {newImagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative">
                    <div className="aspect-square overflow-hidden rounded-lg border border-luxury-gold/20 bg-luxury-ivory">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-luxury-gold p-1 text-luxury-black transition-all hover:bg-luxury-gold/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 rounded bg-luxury-champagne px-2 py-1 text-xs font-semibold text-luxury-black">
                      New
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="edit-description" className="text-luxury-white">
              Description *
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="mt-2 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked as boolean })}
              className="border-luxury-gold/50 data-[state=checked]:bg-luxury-gold data-[state=checked]:text-luxury-black"
            />
            <Label htmlFor="edit-isFeatured" className="cursor-pointer text-luxury-white">
              Feature this watch on homepage
            </Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white hover:bg-luxury-gold/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-black font-serif font-semibold text-luxury-gold hover:bg-luxury-gold hover:text-black disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
