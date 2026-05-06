#!/usr/bin/env python
import csv
import sqlite3
import tkinter as tk
from datetime import datetime
from pathlib import Path
from tkinter import filedialog, messagebox, ttk
from typing import Any, List, Optional, Tuple

APP_NAME = "Todo List"
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "todo.db"


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def connect_db() -> sqlite3.Connection:
    ensure_data_dir()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            notes TEXT,
            priority INTEGER NOT NULL DEFAULT 2,
            is_done INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            due_at TEXT,
            done_at TEXT
        )
        """
    )
    conn.execute("CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(is_done)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_todos_due ON todos(due_at)")
    conn.commit()


def parse_due(value: str) -> str:
    for fmt in (
        "%Y-%m-%d",
        "%Y-%m-%d %H:%M",
        "%Y-%m-%dT%H:%M",
        "%Y-%m-%dT%H:%M:%S",
    ):
        try:
            return datetime.strptime(value, fmt).isoformat(timespec="minutes")
        except ValueError:
            continue
    raise ValueError("Due date must be YYYY-MM-DD or YYYY-MM-DD HH:MM")


def parse_due_input(value: str) -> Optional[str]:
    cleaned = value.strip()
    if not cleaned:
        return None
    return parse_due(cleaned)


def format_due(value: Optional[str]) -> str:
    if not value:
        return "-"
    try:
        parsed = datetime.fromisoformat(value)
        return parsed.strftime("%Y-%m-%d %H:%M")
    except ValueError:
        return value


def build_list_query(
    status: str,
    search: str,
    overdue: bool,
    due_before: Optional[str],
    due_after: Optional[str],
) -> Tuple[str, List[Any]]:
    conditions: List[str] = []
    params: List[Any] = []
    if status == "open":
        conditions.append("is_done = 0")
    elif status == "done":
        conditions.append("is_done = 1")
    if search:
        conditions.append("(title LIKE ? OR notes LIKE ?)")
        pattern = f"%{search}%"
        params.extend([pattern, pattern])
    if overdue:
        conditions.append("due_at IS NOT NULL AND due_at < ? AND is_done = 0")
        params.append(now_iso())
    if due_before:
        conditions.append("due_at IS NOT NULL AND due_at <= ?")
        params.append(parse_due(due_before))
    if due_after:
        conditions.append("due_at IS NOT NULL AND due_at >= ?")
        params.append(parse_due(due_after))

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    sql = (
        "SELECT id, title, notes, priority, is_done, due_at "
        "FROM todos "
        f"{where_clause} "
        "ORDER BY is_done ASC, COALESCE(due_at, '9999-12-31'), priority ASC, created_at DESC"
    )
    return sql, params


def fetch_todos(
    conn: sqlite3.Connection,
    status: str,
    search: str,
    overdue: bool,
    due_before: Optional[str],
    due_after: Optional[str],
) -> List[sqlite3.Row]:
    sql, params = build_list_query(status, search, overdue, due_before, due_after)
    cur = conn.execute(sql, params)
    return cur.fetchall()


def fetch_todo(conn: sqlite3.Connection, todo_id: int) -> Optional[sqlite3.Row]:
    cur = conn.execute(
        "SELECT id, title, notes, priority, is_done, due_at FROM todos WHERE id = ?",
        (todo_id,),
    )
    return cur.fetchone()


def add_todo(
    conn: sqlite3.Connection,
    title: str,
    notes: str,
    priority: int,
    due_at: Optional[str],
) -> None:
    conn.execute(
        """
        INSERT INTO todos (title, notes, priority, created_at, updated_at, due_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (title, notes, priority, now_iso(), now_iso(), due_at),
    )
    conn.commit()


def update_todo(
    conn: sqlite3.Connection,
    todo_id: int,
    title: str,
    notes: str,
    priority: int,
    due_at: Optional[str],
) -> None:
    conn.execute(
        """
        UPDATE todos
        SET title = ?, notes = ?, priority = ?, due_at = ?, updated_at = ?
        WHERE id = ?
        """,
        (title, notes, priority, due_at, now_iso(), todo_id),
    )
    conn.commit()


def mark_done(conn: sqlite3.Connection, todo_id: int, done: bool) -> None:
    done_at = now_iso() if done else None
    conn.execute(
        "UPDATE todos SET is_done = ?, done_at = ?, updated_at = ? WHERE id = ?",
        (1 if done else 0, done_at, now_iso(), todo_id),
    )
    conn.commit()


def delete_todo(conn: sqlite3.Connection, todo_id: int) -> None:
    conn.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    conn.commit()


def clear_done(conn: sqlite3.Connection, all_items: bool) -> None:
    if all_items:
        conn.execute("DELETE FROM todos")
    else:
        conn.execute("DELETE FROM todos WHERE is_done = 1")
    conn.commit()


def export_csv(
    conn: sqlite3.Connection,
    out_path: Path,
    status: str,
    search: str,
    overdue: bool,
    due_before: Optional[str],
    due_after: Optional[str],
) -> int:
    sql, params = build_list_query(status, search, overdue, due_before, due_after)
    cur = conn.execute(sql, params)
    rows = cur.fetchall()
    if not rows:
        return 0
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["id", "title", "notes", "priority", "is_done", "due_at"])
        for row in rows:
            writer.writerow(
                [
                    row["id"],
                    row["title"],
                    row["notes"],
                    row["priority"],
                    row["is_done"],
                    row["due_at"],
                ]
            )
    return len(rows)


def get_stats(conn: sqlite3.Connection) -> Tuple[int, int, int, int]:
    cur = conn.execute(
        "SELECT SUM(is_done = 0) AS open_count, SUM(is_done = 1) AS done_count FROM todos"
    )
    row = cur.fetchone()
    open_count = row["open_count"] or 0
    done_count = row["done_count"] or 0
    overdue_cur = conn.execute(
        """
        SELECT COUNT(*) AS overdue_count
        FROM todos
        WHERE is_done = 0 AND due_at IS NOT NULL AND due_at < ?
        """,
        (now_iso(),),
    )
    overdue = overdue_cur.fetchone()["overdue_count"]
    today = datetime.now().strftime("%Y-%m-%d")
    due_today_cur = conn.execute(
        """
        SELECT COUNT(*) AS due_today
        FROM todos
        WHERE is_done = 0 AND due_at IS NOT NULL AND substr(due_at, 1, 10) = ?
        """,
        (today,),
    )
    due_today = due_today_cur.fetchone()["due_today"]
    return open_count, done_count, overdue, due_today


class TodoApp:
    def __init__(self, root: tk.Tk, conn: sqlite3.Connection) -> None:
        self.root = root
        self.conn = conn
        self.selected_id: Optional[int] = None

        self.title_var = tk.StringVar()
        self.priority_var = tk.StringVar(value="2")
        self.due_var = tk.StringVar()
        self.status_var = tk.StringVar(value="open")
        self.search_var = tk.StringVar()
        self.overdue_var = tk.BooleanVar()
        self.due_before_var = tk.StringVar()
        self.due_after_var = tk.StringVar()
        self.stats_var = tk.StringVar()

        self._build_ui()
        self.refresh_list()

    def _build_ui(self) -> None:
        self.root.title(APP_NAME)
        self.root.geometry("980x640")
        self.root.minsize(900, 600)

        style = ttk.Style(self.root)
        if "clam" in style.theme_names():
            style.theme_use("clam")

        main = ttk.Frame(self.root, padding=12)
        main.grid(row=0, column=0, sticky="nsew")
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main.columnconfigure(0, weight=1)
        main.rowconfigure(2, weight=1)

        form = ttk.LabelFrame(main, text="Todo")
        form.grid(row=0, column=0, sticky="ew", pady=(0, 10))
        form.columnconfigure(1, weight=1)
        form.columnconfigure(3, weight=1)

        ttk.Label(form, text="Title").grid(row=0, column=0, sticky="w")
        self.title_entry = ttk.Entry(form, textvariable=self.title_var)
        self.title_entry.grid(row=0, column=1, columnspan=3, sticky="ew")

        ttk.Label(form, text="Priority").grid(row=1, column=0, sticky="w", pady=(6, 0))
        self.priority_combo = ttk.Combobox(
            form,
            textvariable=self.priority_var,
            values=["1", "2", "3", "4", "5"],
            state="readonly",
            width=6,
        )
        self.priority_combo.grid(row=1, column=1, sticky="w", pady=(6, 0))

        ttk.Label(form, text="Due (YYYY-MM-DD or YYYY-MM-DD HH:MM)").grid(
            row=1, column=2, sticky="w", padx=(10, 0), pady=(6, 0)
        )
        self.due_entry = ttk.Entry(form, textvariable=self.due_var)
        self.due_entry.grid(row=1, column=3, sticky="ew", pady=(6, 0))

        ttk.Label(form, text="Notes").grid(row=2, column=0, sticky="nw", pady=(6, 0))
        notes_frame = ttk.Frame(form)
        notes_frame.grid(row=2, column=1, columnspan=3, sticky="ew", pady=(6, 0))
        notes_frame.columnconfigure(0, weight=1)
        self.notes_text = tk.Text(notes_frame, height=3, wrap="word")
        self.notes_text.grid(row=0, column=0, sticky="ew")
        notes_scroll = ttk.Scrollbar(notes_frame, orient="vertical", command=self.notes_text.yview)
        notes_scroll.grid(row=0, column=1, sticky="ns")
        self.notes_text.configure(yscrollcommand=notes_scroll.set)

        button_frame = ttk.Frame(form)
        button_frame.grid(row=3, column=0, columnspan=4, sticky="ew", pady=(8, 0))
        ttk.Button(button_frame, text="Add", command=self.add_todo).grid(row=0, column=0, padx=(0, 6))
        ttk.Button(button_frame, text="Update", command=self.update_todo).grid(row=0, column=1, padx=(0, 6))
        ttk.Button(button_frame, text="Clear", command=self.clear_form).grid(row=0, column=2)

        filter_frame = ttk.LabelFrame(main, text="Filters")
        filter_frame.grid(row=1, column=0, sticky="ew", pady=(0, 10))
        filter_frame.columnconfigure(3, weight=1)

        ttk.Label(filter_frame, text="Status").grid(row=0, column=0, sticky="w")
        status_combo = ttk.Combobox(
            filter_frame,
            textvariable=self.status_var,
            values=["all", "open", "done"],
            state="readonly",
            width=8,
        )
        status_combo.grid(row=0, column=1, sticky="w")

        ttk.Label(filter_frame, text="Search").grid(row=0, column=2, sticky="w", padx=(10, 0))
        search_entry = ttk.Entry(filter_frame, textvariable=self.search_var)
        search_entry.grid(row=0, column=3, columnspan=3, sticky="ew")
        search_entry.bind("<Return>", lambda _event: self.refresh_list())

        ttk.Checkbutton(filter_frame, text="Overdue", variable=self.overdue_var).grid(
            row=1, column=0, sticky="w", pady=(6, 0)
        )
        ttk.Label(filter_frame, text="Due before").grid(row=1, column=1, sticky="e", pady=(6, 0))
        ttk.Entry(filter_frame, textvariable=self.due_before_var, width=16).grid(
            row=1, column=2, sticky="w", pady=(6, 0)
        )
        ttk.Label(filter_frame, text="Due after").grid(row=1, column=3, sticky="w", pady=(6, 0))
        ttk.Entry(filter_frame, textvariable=self.due_after_var, width=16).grid(
            row=1, column=4, sticky="w", pady=(6, 0)
        )

        filter_buttons = ttk.Frame(filter_frame)
        filter_buttons.grid(row=1, column=5, sticky="e", pady=(6, 0))
        ttk.Button(filter_buttons, text="Apply", command=self.refresh_list).grid(row=0, column=0, padx=(0, 6))
        ttk.Button(filter_buttons, text="Reset", command=self.reset_filters).grid(row=0, column=1)

        tree_frame = ttk.Frame(main)
        tree_frame.grid(row=2, column=0, sticky="nsew")
        tree_frame.columnconfigure(0, weight=1)
        tree_frame.rowconfigure(0, weight=1)

        columns = ("id", "status", "priority", "due", "title")
        self.tree = ttk.Treeview(tree_frame, columns=columns, show="headings", height=12)
        self.tree.heading("id", text="ID")
        self.tree.heading("status", text="Status")
        self.tree.heading("priority", text="P")
        self.tree.heading("due", text="Due")
        self.tree.heading("title", text="Title")

        self.tree.column("id", width=50, anchor="center")
        self.tree.column("status", width=90, anchor="center")
        self.tree.column("priority", width=40, anchor="center")
        self.tree.column("due", width=160, anchor="center")
        self.tree.column("title", width=480, anchor="w")

        self.tree.bind("<<TreeviewSelect>>", self.on_select)

        tree_scroll = ttk.Scrollbar(tree_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=tree_scroll.set)

        self.tree.grid(row=0, column=0, sticky="nsew")
        tree_scroll.grid(row=0, column=1, sticky="ns")

        actions = ttk.Frame(main)
        actions.grid(row=3, column=0, sticky="ew", pady=(10, 0))
        ttk.Button(actions, text="Mark Done", command=self.mark_done).grid(row=0, column=0, padx=(0, 6))
        ttk.Button(actions, text="Reopen", command=self.reopen).grid(row=0, column=1, padx=(0, 6))
        ttk.Button(actions, text="Delete", command=self.delete_todo).grid(row=0, column=2, padx=(0, 6))
        ttk.Button(actions, text="Clear Completed", command=self.clear_completed).grid(row=0, column=3, padx=(0, 6))
        ttk.Button(actions, text="Export CSV", command=self.export_csv).grid(row=0, column=4, padx=(0, 6))
        ttk.Button(actions, text="Refresh", command=self.refresh_list).grid(row=0, column=5)

        status_frame = ttk.Frame(main)
        status_frame.grid(row=4, column=0, sticky="ew", pady=(6, 0))
        self.status_label = ttk.Label(status_frame, textvariable=self.stats_var, anchor="w")
        self.status_label.pack(fill="x")

        self.title_entry.focus()

    def current_filters(self) -> Tuple[str, str, bool, Optional[str], Optional[str]]:
        return (
            self.status_var.get(),
            self.search_var.get().strip(),
            self.overdue_var.get(),
            self.due_before_var.get().strip() or None,
            self.due_after_var.get().strip() or None,
        )

    def refresh_list(self) -> None:
        status, search, overdue, due_before, due_after = self.current_filters()
        try:
            rows = fetch_todos(
                self.conn, status, search, overdue, due_before, due_after
            )
        except ValueError as exc:
            messagebox.showerror("Invalid date", str(exc))
            return

        for item in self.tree.get_children():
            self.tree.delete(item)
        for row in rows:
            status_text = "Done" if row["is_done"] else "Open"
            due_text = format_due(row["due_at"])
            self.tree.insert(
                "",
                "end",
                values=(row["id"], status_text, row["priority"], due_text, row["title"]),
            )

        self.update_stats()

    def update_stats(self) -> None:
        open_count, done_count, overdue, due_today = get_stats(self.conn)
        self.stats_var.set(
            f"Open: {open_count} | Done: {done_count} | Overdue: {overdue} | Due today: {due_today}"
        )

    def on_select(self, _event: tk.Event) -> None:
        selected = self.tree.selection()
        if not selected:
            return
        item = self.tree.item(selected[0])
        todo_id = int(item["values"][0])
        todo = fetch_todo(self.conn, todo_id)
        if not todo:
            return
        self.selected_id = todo_id
        self.title_var.set(todo["title"])
        self.priority_var.set(str(todo["priority"]))
        self.due_var.set(format_due(todo["due_at"]) if todo["due_at"] else "")
        self.notes_text.delete("1.0", "end")
        if todo["notes"]:
            self.notes_text.insert("1.0", todo["notes"])

    def clear_form(self) -> None:
        self.selected_id = None
        self.title_var.set("")
        self.priority_var.set("2")
        self.due_var.set("")
        self.notes_text.delete("1.0", "end")
        self.tree.selection_remove(self.tree.selection())

    def add_todo(self) -> None:
        title = self.title_var.get().strip()
        if not title:
            messagebox.showwarning("Missing title", "Please enter a title.")
            return
        try:
            due_at = parse_due_input(self.due_var.get())
        except ValueError as exc:
            messagebox.showerror("Invalid due date", str(exc))
            return
        notes = self.notes_text.get("1.0", "end").strip()
        priority = int(self.priority_var.get())
        add_todo(self.conn, title, notes, priority, due_at)
        self.clear_form()
        self.refresh_list()

    def update_todo(self) -> None:
        if self.selected_id is None:
            messagebox.showwarning("Select a todo", "Select a todo to update.")
            return
        title = self.title_var.get().strip()
        if not title:
            messagebox.showwarning("Missing title", "Please enter a title.")
            return
        try:
            due_at = parse_due_input(self.due_var.get())
        except ValueError as exc:
            messagebox.showerror("Invalid due date", str(exc))
            return
        notes = self.notes_text.get("1.0", "end").strip()
        priority = int(self.priority_var.get())
        update_todo(self.conn, self.selected_id, title, notes, priority, due_at)
        self.refresh_list()

    def mark_done(self) -> None:
        if self.selected_id is None:
            messagebox.showwarning("Select a todo", "Select a todo to mark done.")
            return
        mark_done(self.conn, self.selected_id, True)
        self.refresh_list()

    def reopen(self) -> None:
        if self.selected_id is None:
            messagebox.showwarning("Select a todo", "Select a todo to reopen.")
            return
        mark_done(self.conn, self.selected_id, False)
        self.refresh_list()

    def delete_todo(self) -> None:
        if self.selected_id is None:
            messagebox.showwarning("Select a todo", "Select a todo to delete.")
            return
        if not messagebox.askyesno("Delete todo", "Delete the selected todo?"):
            return
        delete_todo(self.conn, self.selected_id)
        self.clear_form()
        self.refresh_list()

    def clear_completed(self) -> None:
        if not messagebox.askyesno("Clear completed", "Delete all completed todos?"):
            return
        clear_done(self.conn, False)
        self.refresh_list()

    def export_csv(self) -> None:
        status, search, overdue, due_before, due_after = self.current_filters()
        initial_path = DATA_DIR / "todos.csv"
        path = filedialog.asksaveasfilename(
            title="Export todos",
            defaultextension=".csv",
            initialdir=str(DATA_DIR),
            initialfile=initial_path.name,
            filetypes=[("CSV files", "*.csv")],
        )
        if not path:
            return
        try:
            count = export_csv(
                self.conn,
                Path(path),
                status,
                search,
                overdue,
                due_before,
                due_after,
            )
        except ValueError as exc:
            messagebox.showerror("Invalid date", str(exc))
            return
        if count == 0:
            messagebox.showinfo("Export", "No todos to export.")
            return
        messagebox.showinfo("Export", f"Exported {count} todos.")

    def reset_filters(self) -> None:
        self.status_var.set("open")
        self.search_var.set("")
        self.overdue_var.set(False)
        self.due_before_var.set("")
        self.due_after_var.set("")
        self.refresh_list()


def main() -> None:
    conn = connect_db()
    init_db(conn)

    root = tk.Tk()
    TodoApp(root, conn)
    root.mainloop()


if __name__ == "__main__":
    main()
