import type { Album } from './IAlbums'

function AlbumRow({ album }: { album: Album }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-4 transition hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-medium">{album.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{album.description}</p>
      </div>

      <div className="mt-2 flex gap-4 text-xs text-muted-foreground sm:mt-0">
        <span>{album.photosCount || '0'} fotos</span>
        <span>{new Date(album.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export default AlbumRow
