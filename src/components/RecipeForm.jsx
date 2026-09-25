import { useState } from 'react'
import { CATEGORIES } from '../constants'

const EMPTY = {
  title: '',
  category: CATEGORIES[0],
  prepTime: '',
  servings: '',
  ingredients: [],
  instructions: '',
  favorite: false,
}

// Used for both adding a new recipe and editing an existing one.
export default function RecipeForm({ initial, onSave, onCancel }) {
  const start = initial || EMPTY
  const [form, setForm] = useState({
    ...start,
    // Ingredients are stored as an array but edited one per line.
    ingredientsText: start.ingredients.join('\n'),
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const ingredients = form.ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (!form.title.trim()) return setError('Please give your recipe a title.')
    if (ingredients.length === 0) return setError('Add at least one ingredient.')
    if (!form.instructions.trim()) return setError('Please add the instructions.')

    setSaving(true)
    try {
      await onSave({ ...form, ingredients })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="panel">
      <h2>{initial ? 'Edit recipe' : 'New recipe'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Title
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Grandma's banana bread"
            autoFocus
            required
          />
        </label>

        <div className="form-row">
          <label>
            Category
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Prep time (min)
            <input
              type="number"
              min="0"
              value={form.prepTime}
              onChange={(e) => update('prepTime', e.target.value)}
              placeholder="30"
            />
          </label>
          <label>
            Servings
            <input
              type="number"
              min="1"
              value={form.servings}
              onChange={(e) => update('servings', e.target.value)}
              placeholder="4"
            />
          </label>
        </div>

        <label>
          <span>
            Ingredients <span className="hint">(one per line)</span>
          </span>
          <textarea
            rows={6}
            value={form.ingredientsText}
            onChange={(e) => update('ingredientsText', e.target.value)}
            placeholder={'3 ripe bananas\n2 cups flour\n1 tsp baking soda'}
          />
        </label>

        <label>
          Instructions
          <textarea
            rows={8}
            value={form.instructions}
            onChange={(e) => update('instructions', e.target.value)}
            placeholder={'1. Preheat the oven to 350°F.\n2. Mash the bananas…'}
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.favorite}
            onChange={(e) => update('favorite', e.target.checked)}
          />
          Mark as favorite
        </label>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving…' : initial ? 'Save changes' : 'Add recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}
