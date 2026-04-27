"use client";

import { useEffect, useMemo, useState } from "react";

const FILTERS = ["all", "active", "done"];

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async (isInitialLoad = false) => {
    try {
      if (!isInitialLoad) {
        setLoading(true);
      }
      const response = await fetch("/api/todos", { cache: "no-store" });

      if (!response.ok) {
        throw new Error();
      }

      const payload = await response.json();
      setTasks(payload.tasks ?? []);
      setError("");
    } catch {
      setError("Could not load tasks from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchTasks(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const visibleTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.done);
    }

    if (filter === "done") {
      return tasks.filter((task) => task.done);
    }

    return tasks;
  }, [tasks, filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.done).length;
    const remaining = total - completed;

    return { total, completed, remaining };
  }, [tasks]);

  const createTask = async (event) => {
    event.preventDefault();
    const title = newTask.trim();

    if (!title) {
      return;
    }

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setNewTask("");
      setError("");
      await fetchTasks();
    } catch {
      setError("Could not add task.");
    }
  };

  const toggleDone = async (taskId, done) => {
    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: !done }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setError("");
      await fetchTasks();
    } catch {
      setError("Could not update task status.");
    }
  };

  const removeTask = async (taskId) => {
    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error();
      }

      setError("");
      await fetchTasks();
    } catch {
      setError("Could not delete task.");
    }
  };

  const saveEdit = async (taskId) => {
    const title = editingText.trim();

    if (!title) {
      return;
    }

    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setEditingTaskId(null);
      setEditingText("");
      setError("");
      await fetchTasks();
    } catch {
      setError("Could not save changes.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#fff7cf_0%,#fffaf0_25%,#f5f4ff_60%,#ecf6ff_100%)] px-5 py-12 text-slate-900 sm:px-8">
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#ff6b35]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-[#00b0b9]/20 blur-3xl" />

      <main className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b35]">
            Beginner Firebase ToDo
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            Plan your day,
            <span className="block text-[#0077b6]">ship one task at a time.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            ToDo app built with React and Next.js API routes. Backend CRUD is handled on the server and persisted in Firebase Firestore.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total" value={stats.total} accent="bg-[#ffe9df] text-[#9a3412]" />
          <StatCard label="Active" value={stats.remaining} accent="bg-[#dff8ff] text-[#0c4a6e]" />
          <StatCard label="Done" value={stats.completed} accent="bg-[#e8fceb] text-[#166534]" />
        </section>

        <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-6">
          <form onSubmit={createTask} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="What is your next task?"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0077b6] focus:ring-2 focus:ring-[#90e0ef]"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[#0077b6] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#005f92]"
            >
              Add Task
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  filter === item
                    ? "bg-[#ff6b35] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {error}
            </p>
          ) : null}

          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Loading tasks...</p>
            ) : visibleTasks.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                No tasks in this view yet.
              </p>
            ) : (
              visibleTasks.map((task) => (
                <article
                  key={task.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 sm:flex-row sm:items-center"
                >
                  <button
                    onClick={() => toggleDone(task.id, task.done)}
                    className={`h-6 w-6 shrink-0 rounded-full border-2 transition ${
                      task.done
                        ? "border-emerald-600 bg-emerald-500"
                        : "border-slate-300 bg-white hover:border-slate-500"
                    }`}
                    aria-label={task.done ? "Mark as not done" : "Mark as done"}
                    title={task.done ? "Mark as not done" : "Mark as done"}
                  />

                  <div className="flex-1">
                    {editingTaskId === task.id ? (
                      <input
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0077b6]"
                      />
                    ) : (
                      <p
                        className={`text-sm sm:text-base ${
                          task.done ? "text-slate-400 line-through" : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingTaskId === task.id ? (
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="rounded-xl bg-[#0077b6] px-3 py-2 text-xs font-semibold text-white hover:bg-[#005f92]"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditingText(task.title);
                        }}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => removeTask(task.id)}
                      className="rounded-xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-2xl font-extrabold ${accent}`}>
        {value}
      </p>
    </div>
  );
}