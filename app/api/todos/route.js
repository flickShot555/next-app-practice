import {
  FieldValue,
} from "firebase-admin/firestore";
import { adminDb, hasAdminConfig } from "../../../lib/firebase-server";

export const dynamic = "force-dynamic";

function formatTask(entry) {
  const data = entry.data() ?? {};

  return {
    id: entry.id,
    title: data.title ?? "",
    done: Boolean(data.done),
    createdAt:
      data.createdAt && typeof data.createdAt.toDate === "function"
        ? data.createdAt.toDate().toISOString()
        : null,
  };
}

export async function GET() {
  if (!hasAdminConfig || !adminDb) {
    return Response.json(
      { error: "Firebase server configuration is missing." },
      { status: 500 }
    );
  }

  try {
    const snapshot = await adminDb
      .collection("todos")
      .orderBy("createdAt", "desc")
      .get();
    const tasks = snapshot.docs.map(formatTask);

    return Response.json({ tasks });
  } catch {
    return Response.json({ error: "Failed to get tasks." }, { status: 500 });
  }
}

export async function POST(request) {
  if (!hasAdminConfig || !adminDb) {
    return Response.json(
      { error: "Firebase server configuration is missing." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      return Response.json({ error: "Title is required." }, { status: 400 });
    }

    const created = await adminDb.collection("todos").add({
      title,
      done: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return Response.json({ id: created.id }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create task." }, { status: 500 });
  }
}
