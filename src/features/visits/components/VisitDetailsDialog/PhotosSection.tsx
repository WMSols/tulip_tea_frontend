import { Camera } from "lucide-react";

interface PhotosSectionProps {
  photos: string[];
  label?: string;
}

export function PhotosSection({
  photos,
  label = "Photos",
}: PhotosSectionProps) {
  if (photos.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        <Camera className="w-3 h-3" /> {label} ({photos.length})
      </p>
      <div className="grid grid-cols-2 gap-2">
        {photos.map((_, i) => (
          <div
            key={i}
            className="aspect-video bg-muted rounded-lg flex items-center justify-center"
          >
            <Camera className="w-6 h-6 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
