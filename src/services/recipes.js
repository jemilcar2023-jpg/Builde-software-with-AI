// CRUD operations for the "Recipe" class (table) in Back4App.
// Every recipe is owned by the user who created it, and its ACL
// makes it readable and writable by that user only.
import Parse from '../lib/parse'

const Recipe = Parse.Object.extend('Recipe')

export const MAX_PHOTO_MB = 5
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Returns an error message if the file can't be used as a recipe photo, otherwise null.
export function validatePhoto(file) {
  if (!PHOTO_TYPES.includes(file.type)) return 'Photo must be a JPG, PNG, WebP or GIF image.'
  if (file.size > MAX_PHOTO_MB * 1024 * 1024) return `Photo must be smaller than ${MAX_PHOTO_MB} MB.`
  return null
}

// Upload an image to Back4App file storage and return the saved Parse.File.
async function uploadPhoto(file) {
  const error = validatePhoto(file)
  if (error) throw new Error(error)
  const extension = file.type.split('/')[1]
  const photo = new Parse.File(`recipe.${extension}`, file)
  return photo.save()
}

// Turn a Parse object into a plain JS object the UI can use.
function toPlain(recipe) {
  return {
    id: recipe.id,
    title: recipe.get('title'),
    category: recipe.get('category'),
    prepTime: recipe.get('prepTime'),
    servings: recipe.get('servings'),
    ingredients: recipe.get('ingredients') || [],
    instructions: recipe.get('instructions'),
    favorite: recipe.get('favorite') || false,
    photoUrl: recipe.get('photo')?.url() || null,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
  }
}

// `data.photoFile` (a File from the form) uploads a new photo,
// and `data.removePhoto` clears the existing one.
async function applyFields(recipe, data) {
  recipe.set('title', data.title.trim())
  recipe.set('category', data.category)
  recipe.set('prepTime', Number(data.prepTime) || 0)
  recipe.set('servings', Number(data.servings) || 1)
  recipe.set('ingredients', data.ingredients)
  recipe.set('instructions', data.instructions.trim())
  recipe.set('favorite', Boolean(data.favorite))

  if (data.photoFile) {
    recipe.set('photo', await uploadPhoto(data.photoFile))
  } else if (data.removePhoto) {
    recipe.unset('photo')
  }
}

// READ: all recipes belonging to the logged-in user, newest first.
export async function listRecipes() {
  const query = new Parse.Query(Recipe)
  query.equalTo('owner', Parse.User.current())
  query.descending('createdAt')
  query.limit(1000)
  const results = await query.find()
  return results.map(toPlain)
}

// CREATE
export async function createRecipe(data) {
  const user = Parse.User.current()
  if (!user) throw new Error('You must be logged in to add a recipe.')

  const recipe = new Recipe()
  await applyFields(recipe, data)
  recipe.set('owner', user)
  recipe.setACL(new Parse.ACL(user))
  return toPlain(await recipe.save())
}

// UPDATE
export async function updateRecipe(id, data) {
  const recipe = await new Parse.Query(Recipe).get(id)
  await applyFields(recipe, data)
  return toPlain(await recipe.save())
}

// Quick update used by the favorite star.
export async function setFavorite(id, favorite) {
  const recipe = await new Parse.Query(Recipe).get(id)
  recipe.set('favorite', favorite)
  return toPlain(await recipe.save())
}

// DELETE
export async function deleteRecipe(id) {
  const recipe = await new Parse.Query(Recipe).get(id)
  await recipe.destroy()
}
