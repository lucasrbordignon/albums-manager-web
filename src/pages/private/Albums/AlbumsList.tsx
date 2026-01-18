import { useEffect, useMemo, useState } from 'react'
import { Grid2X2, List, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AlbumThumbnail from './AlbumThumbnail'
import { useNavigate } from 'react-router-dom'
import AlbumTable from './AlbumTable'
import { createAlbum, deleteAlbum, updateAlbum } from '@/services/albums'
import { toast } from 'sonner'
import { findAlbumsByUser } from '@/services/user'
import type { Album } from './IAlbums'
import { useAuth } from '@/contexts/AuthContext'
import ContentWrapper from '@/components/layout/ContentWrapper'
import AlbumDialog from './AlbumDialog'

function AlbumsList() {
  const [view, setView] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('albums_view')
    return saved === 'list' || saved === 'grid' ? saved : 'grid'
  })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'recent' | 'title' | 'description'>('recent')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767)

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')

  const [albums, setAlbums] = useState<Album[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const { user, tokens, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return logout()
    setStatus('loading')
    setError(null)
    findAlbumsByUser(user.id)
      .then(albumsData => {
        setAlbums(albumsData.data)
        setStatus('success')
      })
      .catch(e => {
        setError(e.message || 'Erro ao buscar álbuns')
        setStatus('error')
      })
  }, [user, tokens, logout])

  useEffect(() => {
    setSearch('')
  }, [sort])

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
    if (isMobile && view === 'list') {
      setView('grid')
    }
  }, [isMobile, view])

  useEffect(() => {
    localStorage.setItem('albums_view', view)
  }, [view])

  const filteredAlbums = useMemo(() => {
    return albums
      .filter(album =>
        `${album.title} ${album.description}`.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sort === 'recent') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        }

        if (sort === 'title') {
          return a.title.localeCompare(b.title)
        }

        return a.description.localeCompare(b.description)
      })
  }, [albums, search, sort])

  const handleEdit = (album: Album) => {
    setSelectedAlbum(album)
    setDialogMode('edit')
    setShowModal(true)
  }

  const handleDelete = async (albumId: string) => {
    try {
      await deleteAlbum(albumId)
      setAlbums(prev => prev.filter(a => a.id !== albumId))
      toast.success('Álbum excluído com sucesso!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir álbum')
    }
  }

  const handleCreate = () => {
    setSelectedAlbum(null)
    setDialogMode('create')
    setShowModal(true)
  }

  return (
    <>
      <ContentWrapper>
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou descrição..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-(--color-input) text-(--color-foreground) border-b-2 border-(--color-border) focus:border-(--color-primary)"
                disabled={status === 'loading'}
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={sort}
                onValueChange={(v: 'recent' | 'title' | 'description') => setSort(v)}
                disabled={status === 'loading'}
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
                disabled={status === 'loading'}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>

              {!isMobile && (
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setView('list')}
                  disabled={status === 'loading'}
                >
                  <List className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {status === 'loading' && (
            <div>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-40 animate-pulse rounded"
                      style={{ background: 'var(--color-muted)' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded"
                      style={{ background: 'var(--color-muted)' }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {status === 'error' && (
            <p className="text-center text-sm text-red-500">{error || 'Erro ao buscar álbuns.'}</p>
          )}

          {status === 'success' && filteredAlbums.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">Nenhum álbum encontrado.</p>
          )}

          {status === 'success' && filteredAlbums.length > 0 && view === 'grid' && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filteredAlbums.map(album => (
                <AlbumThumbnail
                  key={album.id}
                  album={album}
                  onDelete={async (albumId: string) => {
                    await handleDelete(albumId)
                  }}
                  onEdit={handleEdit}
                  onView={album =>
                    navigate(`/auth/albums/${album.id}/photos`, { state: { album } })
                  }
                />
              ))}
            </div>
          )}

          {status === 'success' && filteredAlbums.length > 0 && view === 'list' && !isMobile && (
            <AlbumTable
              albums={filteredAlbums}
              onView={album => navigate(`/auth/albums/${album.id}/photos`, { state: { album } })}
              onEdit={handleEdit}
              onDelete={async (albumId: string) => {
                await handleDelete(albumId)
              }}
            />
          )}

          <Button
            type="button"
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 font-bold shadow-lg transition-colors"
            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
            aria-label="Adicionar álbum"
            variant="default"
            onClick={handleCreate}
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
            Novo Álbum
          </Button>

          <AlbumDialog
            open={showModal}
            onOpenChange={open => {
              setShowModal(open)
              if (!open) {
                setSelectedAlbum(null)
                setDialogMode('create')
              }
            }}
            creating={creating}
            album={selectedAlbum || undefined}
            mode={dialogMode}
            onSubmit={async data => {
              setCreating(true)
              try {
                if (dialogMode === 'edit' && selectedAlbum) {
                  const result = await updateAlbum(selectedAlbum.id, {
                    title: data.title,
                    description: data.description,
                  }).catch(err => {
                    throw new Error(err.response?.data?.message || 'Erro ao atualizar álbum')
                  })
                  setAlbums(albs =>
                    albs.map(a => (a.id === selectedAlbum.id ? { ...a, ...result.data } : a))
                  )
                  toast.success('Álbum atualizado com sucesso!')
                } else {
                  const result = await createAlbum({
                    title: data.title,
                    description: data.description,
                    userId: user?.id || '',
                  }).catch(err => {
                    throw new Error(err.response?.data?.message || 'Erro ao criar álbum')
                  })
                  setAlbums(albs => [result.data, ...albs])
                  toast.success('Álbum criado com sucesso!')
                }
                setShowModal(false)
                setSelectedAlbum(null)
                setDialogMode('create')
              } catch (err: any) {
                toast.error(err.message || 'Erro ao salvar álbum')
              } finally {
                setCreating(false)
              }
            }}
          />
        </section>
      </ContentWrapper>
    </>
  )
}

export default AlbumsList
