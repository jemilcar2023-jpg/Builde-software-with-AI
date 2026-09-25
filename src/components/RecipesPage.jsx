import { useEffect, useState } from 'react'
import {
  listRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  setFavorite,
} from '../services/recipes'
import { CATEGORIES } from '../constants'
import RecipeCard from './RecipeCard'
import RecipeDetail from './RecipeDetail'
import RecipeForm from './RecipeForm'

// Parse error code for an expired or invalid login session.
const INVALID_SESSION = 209

// Main screen once logged in. `view` decides what is shown:
//   { mode: 'list' } | { mode: 'new' } | { mode: 'view', id } | { mode: 'edit', id }
export default function RecipesPage({ onSessionExpired }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState({ mode: 'list' })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  function handleError(err) {
    if (err.code === INVALID_SESSION) return onSessionExpired()
    setError(err.message)
  }

  useEffect(() => {
    listRecipes()
      .then(setRecipes)
      .catch(handleError)
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selected = recipes.find((r) => r.id === view.id)

  const visible = recipes.filter((r) => {
    const term = search.trim().toLowerCase()
    const matchesSearch =
      !term ||
      r.title.toLowerCase().includes(term) ||
      r.ingredients.some((i) => i.toLowerCase().includes(term))
    const matchesCategory = category === 'All' || r.category === category
    const matchesFavorite = !favoritesOnly || r.favorite
    return matchesSearch && matchesCategory && matchesFavorite
  })

  // Errors from the form are shown inside the form, so these let them propagate.
  async function handleCreate(data) {
    const saved = await createRecipe(data)
    setRecipes((list) => [saved, ...list])
    setView({ mode: 'view', id: saved.id })
  }

  async function handleUpdate(data) {
    const saved = await updateRecipe(view.id, data)
    setRecipes((list) => list.map((r) => (r.id === saved.id ? saved : r)))
    setView({ mode: 'view', id: saved.id })
  }

  async function handleDelete(recipe) {
    if (!window.confirm(`Delete "${recipe.title}"? This can't be undone.`)) return
    try {
      await deleteRecipe(recipe.id)
      setRecipes((list) => list.filter((r) => r.id !== recipe.id))
      setView({ mode: 'list' })
    } catch (err) {
      handleError(err)
    }
  }

  async function handleToggleFavorite(recipe) {
    try {
      const saved = await setFavorite(recipe.id, !recipe.favorite)
      setRecipes((list) => list.map((r) => (r.id === saved.id ? saved : r)))
    } catch (err) {
      handleError(err)
    }
  }

  const backToList = () => {
    setError('')
    setView({ mode: 'list' })
  }

  if (view.mode === 'new') {
    return <RecipeForm onSave={handleCreate} onCancel={backToList} />
  }

  if (view.mode === 'edit' && selected) {
    return (
      <RecipeForm
        initial={selected}
        onSave={handleUpdate}
        onCancel={() => setView({ mode: 'view', id: selected.id })}
      />
    )
  }

  if (view.mode === 'view' && selected) {
    return (
      <>
        <button className="btn ghost back" onClick={backToList}>
          ← All recipes
        </button>
        {error && <p className="error">{error}</p>}
        <RecipeDetail
          recipe={selected}
          onEdit={() => setView({ mode: 'edit', id: selected.id })}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
        />
      </>
    )
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>My recipes</h1>
          {!loading && (
            <span className="muted">
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
            </span>
          )}
        </div>
        <button className="btn primary" onClick={() => setView({ mode: 'new' })}>
          + Add recipe
        </button>
      </div>

      {recipes.length > 0 && (
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search by title or ingredient…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search recipes"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            className={favoritesOnly ? 'btn primary' : 'btn'}
            onClick={() => setFavoritesOnly((v) => !v)}
            aria-pressed={favoritesOnly}
          >
            ★ Favorites
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading your recipes…</p>
      ) : recipes.length === 0 ? (
        <div className="empty">
          <p className="muted">You haven't saved any recipes yet.</p>
          <button className="btn primary" onClick={() => setView({ mode: 'new' })}>
            Add your first recipe
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <p className="muted">No recipes match your search.</p>
        </div>
      ) : (
        <div className="grid">
          {visible.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onOpen={() => setView({ mode: 'view', id: r.id })}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </>
  )
}
