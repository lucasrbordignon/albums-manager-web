import ContentWrapper from '@/components/layout/ContentWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPhotosByAlbum } from '@/services/albums'
import { Select } from '@radix-ui/react-select'
import { ChevronLeft, Grid2X2, List, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PhotoThumbnail, { type Photo } from './PhotoThumbnail'
import PhotoTable from './PhotoTable'
import { deletePhoto, uploadPhoto } from '@/services/photos'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { PhotoDialog } from './PhotoDialog'

export default function PhotosList() {
  const { tokens } = useAuth()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('photos_view')
    return saved === 'list' || saved === 'grid' ? saved : 'grid'
  })
  const [sort, setSort] = useState<'recent' | 'title' | 'description'>('recent')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [photosError, setPhotosError] = useState<string | null>(null)

  const { albumId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const album = location.state?.album

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('photos_view', view)
  }, [view])

  useEffect(() => {
    if (!albumId) return
    setPhotosLoading(true)
    setPhotosError(null)
    getPhotosByAlbum(albumId)
      .then(res => {
        setPhotos(res.data?.data || [])
      })
      .catch(err => {
        setPhotosError(err.response.data.message || 'Erro ao buscar fotos')
      })
      .finally(() => setPhotosLoading(false))
  }, [albumId])

  const filteredPhotos = useMemo(() => {
    return photos
      .filter(photo => `${photo.title}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sort === 'recent') {
          return new Date(b.acquiredAt).getTime() - new Date(a.acquiredAt).getTime()
        }
        if (sort === 'title') {
          return a.title.localeCompare(b.title)
        }
        return 0
      })
  }, [photos, search, sort])

  const handleDelete = async (photoId: string) => {
    const response = await deletePhoto(photoId)
    if (!response) {
      toast.error('Erro ao deletar foto')
      return
    }

    toast.success('Foto deletada com sucesso')
    setPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  const handleView = (photo: Photo) => {
    setSelectedPhoto(photo)
    setShowModal(false)
  }

  if (!album) {
    return <div>Álbum não encontrado. ID: {albumId}</div>
  }

  return (
    <ContentWrapper>
      <div className="flex items-center gap-4 mb-6">
        <ChevronLeft onClick={() => navigate(-1)} className="w-5 h-5 text-primary cursor-pointer" />
        <h2 className="text-xl font-semibold text-primary">{album.title}</h2>
      </div>
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou descrição..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-(--color-input) text-(--color-foreground) border-b-2 border-(--color-border) focus:border-(--color-primary)"
              disabled={photosLoading}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={sort}
              onValueChange={(v: 'recent' | 'title' | 'description') => setSort(v)}
              disabled={photosLoading}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="title">Título (A–Z)</SelectItem>
                <SelectItem value="description">Descrição (A–Z)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setView('grid')}
              disabled={photosLoading}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            {!isMobile && (
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                disabled={photosLoading}
              >
                <List className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {photosLoading && <div className="text-muted-foreground">Carregando fotos...</div>}
        {photosError && <div className="text-red-500">{photosError}</div>}
        {!photosLoading && !photosError && filteredPhotos.length === 0 && (
          <div className="text-muted-foreground">Nenhuma foto encontrada.</div>
        )}

        {!photosLoading && !photosError && filteredPhotos.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredPhotos.map(photo => (
              <PhotoThumbnail
                key={photo.id}
                photo={photo}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        )}

        {!photosLoading &&
          !photosError &&
          filteredPhotos.length > 0 &&
          view === 'list' &&
          !isMobile && (
            <PhotoTable photos={filteredPhotos} onView={handleView} onDelete={handleDelete} />
          )}

        <Button
          type="button"
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 font-bold shadow-lg transition-colors"
          style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          aria-label="Adicionar foto"
          variant="default"
          onClick={() => setShowModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nova Foto
        </Button>

        <PhotoDialog
          open={showModal}
          onOpenChange={open => setShowModal(open)}
          creating={creating}
          onSubmit={async ({ title, description, file }) => {
            if (!file || !albumId) return
            setCreating(true)
            try {
              const formData = new FormData()
              formData.append('file', file)
              formData.append('title', title)
              formData.append('albumId', albumId)
              if (description) formData.append('description', description)

              const photo = await uploadPhoto(formData, tokens?.accessToken)
              setPhotos(prev => [photo.data, ...prev])
              toast.success('Foto enviada com sucesso!')
              setShowModal(false)
            } catch (err: any) {
              let errorMsg = 'Erro ao enviar foto'
              if (err?.response?.data?.message) {
                errorMsg = err.response.data.message
              } else if (err?.response?.data?.error) {
                errorMsg = err.response.data.error
              } else if (err?.message) {
                errorMsg = err.message
              }
              toast.error(errorMsg)
            } finally {
              setCreating(false)
            }
          }}
        />

        {/* Modal de visualização de foto */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setSelectedPhoto(null)}
            style={{ cursor: 'zoom-out' }}
          >
            <div
              className="bg-background rounded-lg shadow-lg max-w-full max-h-full p-4 flex flex-col items-center"
              onClick={e => e.stopPropagation()}
              style={{ minWidth: 320, minHeight: 200 }}
            >
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[60vh] max-w-[80vw] rounded mb-4"
                style={{ objectFit: 'contain' }}
              />
              <h3 className="text-lg font-semibold mb-1 text-center">{selectedPhoto.title}</h3>
              <Button variant="secondary" onClick={() => setSelectedPhoto(null)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </section>
    </ContentWrapper>
  )
}
