#!/usr/bin/env python
import argparse
import csv
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any, List, Optional, Tuple

APP_NAME = "todo"
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
    for fmt in ("%Y-%m-%d", "%Y-%m-%d %H:%M"):
        try:
            return datetime.strptime(value, fmt).isoformat(timespec="minutes")
        except ValueError:
            continue
    raise ValueError("Due date must be YYYY-MM-DD or YYYY-MM-DD HH:MM")


def priority_type(value: str) -> int:
    try:
        parsed = int(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("priority must be an integer") from exc
    if parsed < 1 or parsed > 5:
        raise argparse.ArgumentTypeError("priority must be between 1 and 5")
    return parsed


def get_todo(conn: sqlite3.Connection, todo_id: int) -> Optional[sqlite3.Row]:
    cur = conn.execute(
        "SELECT id, title, notes, priority, is_done, due_at, done_at FROM todos WHERE id = ?",
        (todo_id,),
    )
    return cur.fetchone()


def add_todo(
    conn: sqlite3.Connection,
    title: str,
    notes: str,
    priority: int,
    due: Optional[str],
) -> None:
    due_at = parse_due(due) if due else None
    conn.execute(
        """
        INSERT INTO todos (title, notes, priority, created_at, updated_at, due_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (title, notes, priority, now_iso(), now_iso(), due_at),
    )
    conn.commit()
    print("Todo added.")


def build_list_query(
    status: str,
    search: str,
    overdue: bool,
    due_before: Optional[str],
    due_after: Optional[str],
    limit: Optional[int],
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
    if limit is not None:
        sql += " LIMIT ?"
        params.append(limit)
    return sql, params


def list_todos(
    conn: sqlite3.Connection,
    status: str,
    search: str,
    overdue: bool,
    due_before: Optional[str],
    due_after: Optional[str],
    limit: Optional[int],
) -> None:
    sql, params = build_list_query(
        status, search, overdue, due_before, due_after, limit
    )
    cur = conn.execute(sql, params)
    rows = cur.fetchall()
    if not rows:
        print("No todos yet. Add one with: python todo.py add \"Buy milk\"")
        return
    print("ID  ST  P  DUE               TITLE")
    print("--  --  -  ----------------  ------------------------------")
    for row in rows:
        status_text = "D" if row["is_done"] else "O"
        due = row["due_at"] or "-"
        title = row["title"][:30]
        print(f"{row['id']:<2}  {status_text:<2}  {row['priority']:<1}  {due:<16}  {title}")
        if row["notes"]:
            print(f"    notes: {row['notes']}")


def show_todo(conn: sqlite3.Connection, todo_id: int) -> None:
    todo = get_todo(conn, todo_id)
    if not todo:
        print(f"Todo {todo_id} not found.")
        return
    status_text = "done" if todo["is_done"] else "open"
    print(f"ID: {todo['id']}")
    print(f"Title: {todo['title']}")
    print(f"Status: {status_text}")
    print(f"Priority: {todo['priority']}")
    print(f"Due: {todo['due_at'] or '-'}")
    if todo["done_at"]:
        print(f"Done at: {todo['done_at']}")
    if todo["notes"]:
        print(f"Notes: {todo['notes']}")


def mark_done(conn: sqlite3.Connection, todo_id: int, done: bool) -> None:
    todo = get_todo(conn, todo_id)
    if not todo:
        print(f"Todo {todo_id} not found.")
        return
    done_at = now_iso() if done else None
    conn.execute(
        "UPDATE todos SET is_done = ?, done_at = ?, updated_at = ? WHERE id = ?",
        (1 if done else 0, done_at, now_iso(), todo_id),
    )
    conn.commit()
    print("Todo updated.")


def edit_todo(
    conn: sqlite3.Connection,
    todo_id: int,
    title: Optional[str],
    notes: Optional[str],
    priority: Optional[int],
    due: Optional[str],
    clear_due: bool,
) -> None:
    todo = get_todo(conn, todo_id)
    if not todo:
        print(f"Todo {todo_id} not found.")
        return
    updates = []
    params: List[Any] = []
    if title is not None:
        updates.append("title = ?")
        params.append(title)
    if notes is not None:
        updates.append("notes = ?")
        params.append(notes)
    if priority is not None:
        updates.append("priority = ?")
        params.append(priority)
    if due is not None:
        updates.append("due_at = ?")
        params.append(parse_due(due))
    if clear_due:
        updates.append("due_at = NULL")
    if not updates:
        print("Nothing to update.")
        return
    updates.append("updated_at = ?")
    params.append(now_iso())
    params.append(todo_id)
    conn.execute(f"UPDATE todos SET {', '.join(updates)} WHERE id = ?", params)
    conn.commit()
    print("Todo updated.")


def delete_todo(conn: sqlite3.Connection, todo_id: int) -> None:
    todo = get_todo(conn, todo_id)
    if not todo:
        print(f"Todo {todo_id} not found.")
        return
    conn.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    conn.commit()
    print("Todo deleted.")


def clear_done(conn: sqlite3.Connection, all_items: bool) -> None:
    if all_items:
        conn.execute("DELETE FROM todos")
        conn.commit()
        print("All todos cleared.")
        return
    cur = conn.execute("SELECT COUNT(*) AS count FROM todos WHERE is_done = 1")
    row = cur.fetchone()
    if not row or row["count"] == 0:
        print("No completed todos to clear.")
        return
    conn.execute("DELETE FROM todos WHERE is_done = 1")
    conn.commit()
    print("Completed todos cleared.")


def export_csv(
    conn: sqlite3.Connection,
    out_path: Path,
    status: str,
) -> None:
    sql, params = build_list_query(status, "", False, None, None, None)
    cur = conn.execute(sql, params)
    rows = cur.fetchall()
    if not rows:
        print("No todos to export.")
        return
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            ["id", "title", "notes", "priority", "is_done", "due_at"]
        )
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
    print(f"Exported {len(rows)} todos to {out_path}")


def stats(conn: sqlite3.Connection) -> None:
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
    print(f"Open: {open_count} | Done: {done_count} | Overdue: {overdue} | Due today: {due_today}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog=APP_NAME,
        description="A clean, local-first todo list.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("init", help="Create the local database")

    add = sub.add_parser("add", help="Add a todo")
    add.add_argument("title", help="Todo title")
    add.add_argument("--notes", default="", help="Notes")
    add.add_argument("--priority", type=priority_type, default=2, help="1-5")
    add.add_argument("--due", help="Due date (YYYY-MM-DD or YYYY-MM-DD HH:MM)")

    list_cmd = sub.add_parser("list", help="List todos")
    list_cmd.add_argument(
        "--status", choices=["all", "open", "done"], default="open"
    )
    list_cmd.add_argument("--search", default="", help="Search in title or notes")
    list_cmd.add_argument("--overdue", action="store_true", help="Only overdue")
    list_cmd.add_argument("--due-before", help="Due before date")
    list_cmd.add_argument("--due-after", help="Due after date")
    list_cmd.add_argument("--limit", type=int, default=50, help="Max rows")
    list_cmd.add_argument("--all", action="store_true", help="Ignore limit")

    show = sub.add_parser("show", help="Show a todo")
    show.add_argument("id", type=int, help="Todo id")

    done = sub.add_parser("done", help="Mark a todo done")
    done.add_argument("id", type=int, help="Todo id")

    reopen = sub.add_parser("reopen", help="Reopen a todo")
    reopen.add_argument("id", type=int, help="Todo id")

    edit = sub.add_parser("edit", help="Edit a todo")
    edit.add_argument("id", type=int, help="Todo id")
    edit.add_argument("--title", default=None, help="New title")
    edit.add_argument("--notes", default=None, help="New notes")
    edit.add_argument("--priority", type=priority_type, default=None, help="1-5")
    edit.add_argument("--due", default=None, help="New due date")
    edit.add_argument("--clear-due", action="store_true", help="Remove due date")

    delete = sub.add_parser("delete", help="Delete a todo")
    delete.add_argument("id", type=int, help="Todo id")

    clear_cmd = sub.add_parser("clear", help="Clear completed todos")
    clear_cmd.add_argument("--all", action="store_true", help="Remove all todos")

    export_cmd = sub.add_parser("export", help="Export to CSV")
    export_cmd.add_argument(
        "--out",
        default=str(DATA_DIR / "todos.csv"),
        help="Output path",
    )
    export_cmd.add_argument(
        "--status", choices=["all", "open", "done"], default="all"
    )

    sub.add_parser("stats", help="Show summary counts")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    conn = connect_db()
    init_db(conn)

    if args.command == "init":
        print(f"Database ready at {DB_PATH}")
        return

    if args.command == "add":
        add_todo(conn, args.title, args.notes, args.priority, args.due)
        return

    if args.command == "list":
        limit = None if args.all else args.limit
        list_todos(
            conn,
            args.status,
            args.search,
            args.overdue,
            args.due_before,
            args.due_after,
            limit,
        )
        return

    if args.command == "show":
        show_todo(conn, args.id)
        return

    if args.command == "done":
        mark_done(conn, args.id, True)
        return

    if args.command == "reopen":
        mark_done(conn, args.id, False)
        return

    if args.command == "edit":
        edit_todo(
            conn,
            args.id,
            args.title,
            args.notes,
            args.priority,
            args.due,
            args.clear_due,
        )
        return

    if args.command == "delete":
        delete_todo(conn, args.id)
        return

    if args.command == "clear":
        clear_done(conn, args.all)
        return

    if args.command == "export":
        export_csv(conn, Path(args.out), args.status)
        return

    if args.command == "stats":
        stats(conn)
        return


if __name__ == "__main__":
    main()
