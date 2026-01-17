import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
import { MoreHorizontal, Eye, Pencil, Trash } from 'lucide-react'
import type { Album } from './IAlbums'

type Props = {
  albums: Album[]
  onView: (album: Album) => void
  onEdit: (album: Album) => void
  onDelete: (albumId: string) => Promise<void>
}

export default function AlbumTable({ albums, onView, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-center">Fotos</TableHead>
            <TableHead className="text-right">Atualizado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {albums.map(album => (
            <TableRow key={album.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{album.title}</TableCell>

              <TableCell className="text-muted-foreground line-clamp-1 max-w-xs">
                {album.description}
              </TableCell>

              <TableCell className="text-center">{album.photosCount}</TableCell>

              <TableCell className="text-right text-sm text-muted-foreground">
                {new Date(album.updatedAt).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(album)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onEdit(album)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>

                    {(!album.photosCount || album.photosCount === 0) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={e => e.preventDefault()}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
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
                              onClick={() => onDelete(album.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
