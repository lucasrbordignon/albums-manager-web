import { Image, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { Album } from './IAlbums'

type Props = {
  album: Album
  onView?: (album: Album) => void
  onEdit?: (album: Album) => void
  onDelete?: (albumId: string) => void | Promise<void>
}

export default function AlbumThumbnail({ album, onView, onEdit, onDelete }: Props) {
  return (
    <Card
      className="group overflow-hidden transition hover:shadow-md relative cursor-pointer"
      onClick={() => onView && onView(album)}
      tabIndex={0}
      role="button"
      aria-label={`Visualizar álbum ${album.title}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onView && onView(album)
        }
      }}
    >
      <div className="aspect-video bg-muted flex items-center justify-center">
        <Image className="h-10 w-10 text-muted-foreground" />
      </div>

      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <h3 className="font-semibold line-clamp-1 flex-1 pr-2">{album.title}</h3>
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 p-0"
                onClick={e => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    onEdit(album)
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
              )}
              {onDelete && (!album.photosCount || album.photosCount === 0) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={e => e.stopPropagation()}
                      onSelect={e => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir álbum?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação é irreversível. O álbum será removido (soft delete).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={e => {
                          e.stopPropagation()
                          onDelete(album.id)
                        }}
                        tabIndex={0}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="space-y-1 text-sm">
        <p className="text-muted-foreground line-clamp-2">{album.description}</p>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{album.photosCount} fotos</span>
          <span>{new Date(album.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
