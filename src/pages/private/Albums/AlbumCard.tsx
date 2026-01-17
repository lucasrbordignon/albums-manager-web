import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Album } from './IAlbums'

function AlbumCard({ album }: { album: Album }) {
  return (
    <Card className="transition hover:shadow-md">
      <CardHeader>
        <CardTitle className="line-clamp-1">{album.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="line-clamp-2 text-muted-foreground">{album.description}</p>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{album.photosCount} fotos</span>
          <span>Atualizado em {new Date(album.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default AlbumCard
