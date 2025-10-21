import { HeartIcon, EyeIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Photo } from '../lib/types'
import { useState } from 'react'

interface PhotoGridProps {
  photos: Photo[];
  onFavorite?: (photo: Photo) => void;
  favoritedPhotos?: Set<string>;
}

interface PhotoModalProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: (photo: Photo) => void;
  isFavorited?: boolean;
}

function PhotoModal({ photo, isOpen, onClose, onFavorite, isFavorited = false }: PhotoModalProps) {
  if (!isOpen) return null

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(photo)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <img
          src={photo.urls.full}
          alt={photo.alt_description || 'City photo'}
          className="w-full h-auto max-h-[80vh] object-contain"
        />

        <div className="p-4 bg-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Photo by{' '}
                <a
                  href={`https://unsplash.com/@${photo.user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {photo.user.name}
                </a>
                {' '}on Unsplash
              </p>
              {photo.alt_description && (
                <p className="text-sm text-gray-800">
                  {photo.alt_description}
                </p>
              )}
            </div>

            {onFavorite && (
              <button
                onClick={handleFavorite}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorited ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <HeartIcon className="h-4 w-4 mr-1" />
              <span>{photo.likes} likes</span>
            </div>

            <a
              href={photo.urls.full}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View Full Size
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PhotoGrid({ photos, onFavorite, favoritedPhotos = new Set() }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  if (photos.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Photos Available</h3>
          <p className="text-gray-600">We couldn't find any photos for this destination.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Destination Photos
          </h3>
          <p className="text-sm text-gray-600">
            Beautiful images from {photos.length} photographer{photos.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description || 'City photo'}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                  <div className="p-2 bg-white bg-opacity-90 rounded-full">
                    <EyeIcon className="h-4 w-4 text-gray-700" />
                  </div>
                  
                  {onFavorite && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFavorite(photo)
                      }}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                      aria-label={favoritedPhotos.has(photo.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {favoritedPhotos.has(photo.id) ? (
                        <HeartIconSolid className="h-4 w-4 text-red-500" />
                      ) : (
                        <HeartIcon className="h-4 w-4 text-gray-700" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Favorite indicator */}
              {favoritedPhotos.has(photo.id) && (
                <div className="absolute top-2 right-2">
                  <div className="p-1 bg-red-500 rounded-full">
                    <HeartIconSolid className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Click on any photo to view it in full size
          </p>
        </div>
      </div>

      {/* Photo Modal */}
      <PhotoModal
        photo={selectedPhoto!}
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        onFavorite={onFavorite}
        isFavorited={selectedPhoto ? favoritedPhotos.has(selectedPhoto.id) : false}
      />
    </>
  )
}
