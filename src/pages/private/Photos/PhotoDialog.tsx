import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'

type PhotoFormData = {
  title: string
  description: string
  file?: File | null
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PhotoFormData) => Promise<void>
  creating: boolean
}

export default function PhotoDialog({ open, onOpenChange, onSubmit, creating }: Props) {
  const form = useForm<PhotoFormData>({
    defaultValues: {
      title: '',
      description: '',
      file: null,
    },
  })

  const handleSubmit = async (data: PhotoFormData) => {
    await onSubmit(data)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar foto</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Input
            {...form.register('title', { required: true })}
            placeholder="Título da foto"
            disabled={creating}
          />
          <Input {...form.register('description')} placeholder="Descrição" disabled={creating} />
          <Input type="file" accept="image/*" {...form.register('file')} disabled={creating} />
          <Button type="submit" className="w-full" disabled={creating}>
            {creating ? 'Adicionando...' : 'Adicionar foto'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
