import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isDeleting: boolean;
}

export default function DeleteConfirmationDialog({ open, onClose, onConfirm, isDeleting }: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="border-luxury-gold/20 bg-luxury-black text-luxury-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-2xl text-luxury-gold">
            Delete Watch
          </AlertDialogTitle>
          <AlertDialogDescription className="text-luxury-white/80">
            Are you sure you want to delete this watch? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-luxury-gold/30 text-luxury-white hover:bg-luxury-charcoal"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-black font-serif font-semibold text-luxury-gold hover:bg-luxury-gold hover:text-black disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
