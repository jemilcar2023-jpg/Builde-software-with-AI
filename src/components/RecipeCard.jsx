// A single recipe tile in the grid.
export default function RecipeCard({ recipe, onOpen, onToggleFavorite }) {
  function handleStar(e) {
    e.stopPropagation() // don't open the recipe when clicking the star
    onToggleFavorite(recipe)
  }

  return (
    <article
      className="card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(recipe)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(recipe)}
    >
      <div className="card-top">
        <h3>{recipe.title}</h3>
        <button
          className="star"
          onClick={handleStar}
          aria-label={recipe.favorite ? 'Remove from favorites' : 'Add to favorites'}
          title={recipe.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {recipe.favorite ? '★' : '☆'}
        </button>
      </div>
      <span className="badge">{recipe.category}</span>
      <div className="meta">
        {recipe.prepTime > 0 && <span>⏱ {recipe.prepTime} min</span>}
        <span>🍽 {recipe.servings} servings</span>
        <span>🧂 {recipe.ingredients.length} ingredients</span>
      </div>
    </article>
  )
}
