import { Component } from '@angular/core';
import { Media, MediaService } from '@app/core/services/media.service';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [],
  templateUrl: './media-library.component.html',
  styleUrl: './media-library.component.css'
})
export class MediaLibraryComponent {
    media: Media[] = [];
    loading = false;
    selected?: Media;

    constructor(private mediaService: MediaService) {}

    ngOnInit() {
        this.loadMedia();
    }

    loadMedia() {
        this.loading = true;
        this.mediaService.getAll().subscribe({
            next: (res) => {
                this.media = res as Media[];
                this.loading = false;
            },
            error: () => (this.loading = false),
        });
    }

    onUpload(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        this.mediaService.upload(file, 'products').subscribe(() => {
            this.loadMedia();
        });
    }

    delete(media: Media) {
        if (!confirm('Delete this image?')) return;

        this.mediaService.delete(media.id).subscribe(() => {
            this.loadMedia();
        });
    }

    select(media: Media) {
        this.selected = media;
    }
}
