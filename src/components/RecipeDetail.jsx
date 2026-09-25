// Full view of one recipe, with edit and delete actions.
export default function RecipeDetail({ recipe, onEdit, onDelete, onToggleFavorite }) {
  return (
    <div className="panel detail">
      <div className="detail-head">
        <div>
          <h2>{recipe.title}</h2>
          <span className="badge">{recipe.category}</span>
        </div>
        <button
          className="star"
          onClick={() => onToggleFavorite(recipe)}
          aria-label={recipe.favorite ? 'Remove from favorites' : 'Add to favorites'}
          title={recipe.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {recipe.favorite ? '★' : '☆'}
        </button>
      </div>

      <div className="meta">
        {recipe.prepTime > 0 && <span>⏱ {recipe.prepTime} min</span>}
        <span>🍽 {recipe.servings} servings</span>
        <span>Updated {recipe.updatedAt.toLocaleDateString()}</span>
      </div>

      <section>
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Instructions</h3>
        <p className="instructions">{recipe.instructions}</p>
      </section>

      <div className="detail-actions">
        <button className="btn primary" onClick={() => onEdit(recipe)}>
          Edit
        </button>
        <button className="btn danger" onClick={() => onDelete(recipe)}>
          Delete
        </button>
      </div>
    </div>
  )
}
