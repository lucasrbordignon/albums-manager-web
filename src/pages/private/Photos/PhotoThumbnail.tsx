import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export type Photo = {
  id: string
  title: string
  acquiredAt: string
  sizeInBytes: number
  mimeType: string
  imageUrl: string
  thumbnailUrl: string
  dominantColor: string
}

type Props = {
  photo: Photo
  onView?: (photo: Photo) => void
  onDelete?: (photoId: string) => void | Promise<void>
}

export default function PhotoThumbnail({ photo, onView, onDelete }: Props) {
  return (
    <Card
      className="group overflow-hidden transition hover:shadow-md relative cursor-pointer"
      onClick={() => onView && onView(photo)}
      tabIndex={0}
      role="button"
      aria-label={`Visualizar foto ${photo.title}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onView && onView(photo)
        }
      }}
    >
      <div className="aspect-video bg-muted flex items-center justify-center">
        <img
          src={photo.thumbnailUrl}
          alt={photo.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <h3 className="font-semibold line-clamp-1 flex-1 pr-2">{photo.title}</h3>
        {onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 p-0"
                onClick={e => e.stopPropagation()}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={e => {e.stopPropagation(); e.preventDefault()}}
                    onClick={e => e.stopPropagation()}
                  >
                    <Trash className="mr-2 h-4 w-4" /> Excluir
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir foto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação é irreversível. A foto será removida (soft delete).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={e => { e.stopPropagation(); onDelete(photo.id) }}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{photo.mimeType}</span>
          <span>{new Date(photo.acquiredAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
