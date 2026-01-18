import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import type { Photo } from './PhotoThumbnail'
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

type Props = {
  photos: Photo[]
  onView: (photo: Photo) => void
  onDelete: (photoId: string) => Promise<void>
}

export default function PhotoTable({ photos, onView, onDelete }: Props) {
  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead className="text-center">Data de aquisição</TableHead>
            <TableHead className="text-right">Cor predominante</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {photos.map(photo => (
            <TableRow key={photo.id} className="hover:bg-muted/50">
              <TableCell
                className="font-medium text-primary cursor-pointer hover:underline"
                onClick={() => onView(photo)}
                tabIndex={0}
                role="button"
                aria-label={`Visualizar foto ${photo.title}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onView(photo)
                  }
                }}
              >
                {photo.title}
              </TableCell>
              <TableCell className="text-muted-foreground line-clamp-1 max-w-xs">
                {photo.sizeInBytes} bytes
              </TableCell>
              <TableCell className="text-center">
                {new Date(photo.acquiredAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {photo.dominantColor}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={e => e.preventDefault()}
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
                            onClick={() => onDelete(photo.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
