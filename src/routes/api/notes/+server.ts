import type { RequestHandler } from './$types';
import { db } from '../../../db';
import { notes, recipeToNotes } from '../../../db/schema';

export const POST: RequestHandler = async ({ request }) => {
	const newNote = await request.json();

	const [note] = await db
		.insert(notes)
		.values({
			content: newNote.content
		})
		.returning({
			id: notes.id,
			content: notes.content
		})
		.execute();

	await db.insert(recipeToNotes).values({
		recipeId: newNote.recipeId,
		noteId: note.id
	});

	return new Response(JSON.stringify(note), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
