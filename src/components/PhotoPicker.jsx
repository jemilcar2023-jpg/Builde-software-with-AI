import { useEffect, useRef, useState } from 'react'
import { MAX_PHOTO_MB, validatePhoto } from '../services/recipes'

// Lets the user choose, preview, change or remove a recipe photo.
// `existingUrl` is the photo already saved (when editing); `file` is a newly chosen one.
export default function PhotoPicker({ existingUrl, file, removed, onSelect, onRemove, onError }) {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  // Show a local preview of a newly chosen file, and free it when it changes.
  useEffect(() => {
    if (!file) return setPreviewUrl(null)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const shownUrl = previewUrl || (removed ? null : existingUrl)

  function handleChange(e) {
    const chosen = e.target.files[0]
    e.target.value = '' // allow picking the same file again later
    if (!chosen) return

    const error = validatePhoto(chosen)
    if (error) return onError(error)
    onError('')
    onSelect(chosen)
  }

  return (
    <div className="photo-picker">
      <span className="field-label">
        Photo <span className="hint">(optional, up to {MAX_PHOTO_MB} MB)</span>
      </span>

      {shownUrl ? (
        <img src={shownUrl} alt="Recipe preview" className="photo-preview" />
      ) : (
        <button type="button" className="photo-empty" onClick={() => inputRef.current.click()}>
          📷 Add a photo
        </button>
      )}

      <div className="photo-actions">
        {shownUrl && (
          <>
            <button type="button" className="btn" onClick={() => inputRef.current.click()}>
              Change photo
            </button>
            <button type="button" className="btn danger" onClick={onRemove}>
              Remove photo
            </button>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        hidden
      />
    </div>
  )
}
