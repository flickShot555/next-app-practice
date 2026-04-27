import { adminDb, hasAdminConfig } from "../../../../lib/firebase-server";

export async function PUT(request, { params }) {
  if (!hasAdminConfig || !adminDb) {
    return Response.json(
      { error: "Firebase server configuration is missing." },
      { status: 500 }
    );
  }

  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Task id is required." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updates = {};

    if (typeof body.title === "string") {
      const title = body.title.trim();

      if (!title) {
        return Response.json({ error: "Title cannot be empty." }, { status: 400 });
      }

      updates.title = title;
    }

    if (typeof body.done === "boolean") {
      updates.done = body.done;
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "No valid fields to update." }, { status: 400 });
    }

    await adminDb.collection("todos").doc(id).update(updates);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to update task." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  if (!hasAdminConfig || !adminDb) {
    return Response.json(
      { error: "Firebase server configuration is missing." },
      { status: 500 }
    );
  }

  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Task id is required." }, { status: 400 });
  }

  try {
    await adminDb.collection("todos").doc(id).delete();

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to delete task." }, { status: 500 });
  }
}
