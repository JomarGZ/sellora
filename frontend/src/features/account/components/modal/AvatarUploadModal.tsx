import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { User, Upload, X } from "lucide-react";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSave: (url: string) => void;
}

export function AvatarUploadModal({
  isOpen,
  onClose,
  currentAvatar,
  onSave,
}: AvatarUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSave = async () => {
    if (!preview) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    onSave(preview);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">
            Update Profile Photo
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="relative mb-6 group">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-md">
                <User className="w-12 h-12 text-muted-foreground/50" />
              </div>
            )}

            {preview && preview !== currentAvatar && (
              <button
                onClick={() => setPreview(currentAvatar)}
                className="absolute top-0 right-0 bg-background text-foreground p-1.5 rounded-full shadow-sm border border-border hover:bg-muted"
                title="Reset"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors font-medium text-sm border border-border shadow-sm hover-elevate">
              <Upload className="w-4 h-4" />
              Choose Image
            </div>
          </label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!preview || preview === currentAvatar || isSaving}
            className="rounded-xl px-6"
          >
            {isSaving ? "Saving..." : "Save Photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
