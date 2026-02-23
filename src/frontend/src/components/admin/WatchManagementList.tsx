import { useState } from 'react';
import { useWatches } from '@/hooks/useWatches';
import { useActor } from '@/hooks/useActor';
import { type Watch } from '@/backend';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Edit, Trash2 } from 'lucide-react';
import EditWatchModal from './EditWatchModal';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { imageToUrl } from '@/lib/imageUtils';

export default function WatchManagementList() {
  const { allWatches, isLoading, error } = useWatches();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null);
  const [deletingWatchId, setDeletingWatchId] = useState<bigint | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!actor || !deletingWatchId) return;

    setIsDeleting(true);
    try {
      await actor.deleteWatch(deletingWatchId);
      toast.success('Watch deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['watches'] });
      setDeletingWatchId(null);
    } catch (error) {
      console.error('Error deleting watch:', error);
      toast.error('Failed to delete watch');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 rounded-lg border border-luxury-gold/20 bg-luxury-black/50 p-4">
            <Skeleton className="h-24 w-24" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load watches. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!allWatches || allWatches.length === 0) {
    return (
      <div className="rounded-lg border border-luxury-gold/20 bg-luxury-black/50 p-8 text-center">
        <p className="text-luxury-white">No watches added yet. Add your first watch above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {allWatches.map((watch) => {
          const mainImage = watch.images && watch.images.length > 0 ? watch.images[0] : null;
          return (
            <div
              key={watch.id.toString()}
              className="flex flex-col gap-4 rounded-lg border border-luxury-gold/20 bg-luxury-black/50 p-4 sm:flex-row"
            >
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-luxury-ivory">
                {mainImage ? (
                  <img
                    src={imageToUrl(mainImage)}
                    alt={watch.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-luxury-charcoal text-xs text-luxury-white/50">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-serif text-lg font-semibold text-luxury-white">
                  {watch.name}
                </h3>
                <p className="mb-1 text-sm text-luxury-champagne">
                  {watch.company} - {watch.modelNumber}
                </p>
                <p className="mb-1 text-sm text-luxury-white/60">{watch.gender}</p>
                <p className="font-serif text-lg font-bold text-luxury-gold">
                  ${Number(watch.price).toLocaleString()}
                </p>
                {watch.isFeatured && (
                  <span className="mt-2 inline-block rounded bg-luxury-gold px-2 py-1 text-xs font-semibold text-luxury-black">
                    Featured
                  </span>
                )}
                {watch.images && watch.images.length > 1 && (
                  <span className="ml-2 mt-2 inline-block rounded bg-luxury-champagne px-2 py-1 text-xs font-semibold text-luxury-black">
                    {watch.images.length} images
                  </span>
                )}
              </div>
              <div className="flex flex-row gap-2 sm:flex-col">
                <Button
                  onClick={() => setEditingWatch(watch)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white hover:bg-luxury-gold/10 sm:flex-none"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => setDeletingWatchId(watch.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white hover:bg-red-900/20 sm:flex-none"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {editingWatch && (
        <EditWatchModal
          watch={editingWatch}
          open={!!editingWatch}
          onClose={() => setEditingWatch(null)}
        />
      )}

      <DeleteConfirmationDialog
        open={!!deletingWatchId}
        onClose={() => setDeletingWatchId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
