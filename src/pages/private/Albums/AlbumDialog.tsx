import { useForm } from 'react-hook-form'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { Album } from './IAlbums'

type FormData = {
  title: string
  description: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  creating: boolean
  onSubmit: (data: FormData) => Promise<void>
  mode?: 'create' | 'edit'
  album?: Album
}

import { useEffect } from 'react'

export default function AlbumDialog({
  open,
  onOpenChange,
  creating,
  onSubmit,
  mode = 'create',
  album,
}: Props) {
  const form = useForm<FormData>({
    defaultValues: {
      title: album?.title || '',
      description: album?.description || '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: album?.title || '',
        description: album?.description || '',
      })
    }
  }, [open, album, form])

  const handleClose = () => {
    form.reset({
      title: album?.title || '',
      description: album?.description || '',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Editar Álbum' : 'Novo Álbum'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: 'Título é obrigatório' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Viagem 2024" disabled={creating} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do álbum"
                      rows={3}
                      disabled={creating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={handleClose} disabled={creating}>
                Cancelar
              </Button>

              <Button type="submit" disabled={creating}>
                {creating
                  ? mode === 'edit'
                    ? 'Salvando...'
                    : 'Criando...'
                  : mode === 'edit'
                    ? 'Salvar'
                    : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
