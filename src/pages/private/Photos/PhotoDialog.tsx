import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'

type PhotoFormData = {
  title: string
  description?: string
  file: File
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  creating: boolean
  onSubmit: (data: PhotoFormData) => Promise<void>
}

export function PhotoDialog({ open, onOpenChange, creating, onSubmit }: Props) {
  const { register, handleSubmit, reset, setValue, setFocus } = useForm<PhotoFormData>()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    const fileNameWithoutExtension = selected.name.replace(/\.[^/.]+$/, '')

    setValue('title', fileNameWithoutExtension)
    setPreview(URL.createObjectURL(selected))

    setFocus('description')
  }

  useEffect(() => {
    if (!open) {
      reset()
      setFile(null)
      setPreview(null)
    }
  }, [open, reset])

  function handleFormSubmit(data: PhotoFormData) {
    if (!file) return
    onSubmit({ ...data, file })
    reset()
    setFile(null)
    setPreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar foto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            className="bg-muted cursor-not-allowed"
            placeholder="Título da foto"
            {...register('title')}
            readOnly
          />

          <Input
            placeholder="Descrição (opcional)"
            {...register('description')}
            disabled={creating}
          />

          <div className="space-y-3">
            <label
              htmlFor="photo"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center transition hover:bg-muted/50"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                if (creating) return

                const file = e.dataTransfer.files?.[0]
                if (!file || !file.type.startsWith('image/')) return

                handleFileChange({
                  target: { files: [file] },
                } as unknown as React.ChangeEvent<HTMLInputElement>)
              }}
            >
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Clique para enviar</span> ou arraste
                uma imagem aqui
              </div>

              <p className="text-xs text-muted-foreground">PNG, JPG, JPEG</p>
            </label>

            <Input
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={creating}
            />

            {preview && (
              <div className="overflow-hidden rounded-lg border">
                <img src={preview} alt="Preview" className="max-h-64 w-full object-cover" />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={creating || !file}>
            {creating ? 'Processando...' : 'Enviar foto'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
