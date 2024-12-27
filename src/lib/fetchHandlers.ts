export type Recipe = {
	id: number;
	name: string;
	ingredients: { name: string; quantity: string; unit: string }[];
	directions: string[];
	imageUrl?: string;
	source?: string;
	notes?: { id: number; content: string }[];
};

export async function getAllRecipes(): Promise<Recipe[]> {
	const response = await fetch('/api/recipes', {
		method: 'GET'
	});

	if (response.ok) {
		const data = await response.json();
		return data.recipesByName;
	} else {
		console.error('Error fetching recipes:', await response.text());
		return [];
	}
}

export async function searchRecipes(
	searchTerm: string
): Promise<{ recipesByName: Recipe[]; recipesByIngredient: Recipe[] }> {
	const response = await fetch(`/api/recipes?searchTerm=${searchTerm}`, {
		method: 'GET'
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		console.error('Error fetching search results:', await response.text());
		return { recipesByName: [], recipesByIngredient: [] };
	}
}

export async function addRecipe(recipe: Recipe): Promise<void> {
	const response = await fetch('/api/recipes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(recipe)
	});

	if (response.ok) {
		console.log('Recipe added successfully');
	} else {
		console.error('Error adding recipe:', await response.text());
	}
}

export async function deleteRecipe(id: number): Promise<void> {
	const response = await fetch(`/api/recipes/${id}`, {
		method: 'DELETE'
	});

	if (response.ok) {
		console.log('Recipe deleted successfully');
	} else {
		console.error('Error deleting recipe:', await response.text());
	}
}

export async function editRecipe(recipe: Recipe): Promise<void> {
	const response = await fetch(`/api/recipes/${recipe.id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(recipe)
	});

	if (response.ok) {
		console.log('Recipe updated successfully');
	} else {
		console.error('Error updating recipe:', await response.text());
	}
}

export async function editNote(noteId: number, content: string): Promise<void> {
	const response = await fetch(`/api/notes/${noteId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ content })
	});

	if (response.ok) {
		console.log('Note updated successfully');
	} else {
		console.error('Error updating note:', await response.text());
	}
}

export async function deleteNote(noteId: number): Promise<void> {
	const response = await fetch(`/api/notes/${noteId}`, {
		method: 'DELETE'
	});

	if (response.ok) {
		console.log('Note deleted successfully');
	} else {
		console.error('Error deleting note:', await response.text());
	}
}

export async function addNote(recipeId: number, content: string): Promise<void> {
	const response = await fetch(`/api/notes`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ recipeId, content })
	});

	if (response.ok) {
		console.log('Note added successfully');
	} else {
		console.error('Error adding note:', await response.text());
	}
}
