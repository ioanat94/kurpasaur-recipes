import { notes, recipeToNotes } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { db } from '../../../../db';

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;
	const noteId = parseInt(id, 10);

	await db.delete(recipeToNotes).where(eq(recipeToNotes.noteId, noteId)).execute();

	await db.delete(notes).where(eq(notes.id, noteId)).execute();

	return new Response(
		JSON.stringify({
			message: 'Note deleted successfully'
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	const noteId = parseInt(id, 10);

	const updatedNote = await request.json();

	await db
		.update(notes)
		.set({
			content: updatedNote.content
		})
		.where(eq(notes.id, noteId))
		.execute();

	return new Response(
		JSON.stringify({
			message: 'Note updated successfully'
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
