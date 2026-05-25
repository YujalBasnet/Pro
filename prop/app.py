#!/usr/bin/env python
import argparse
import csv
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, List, Optional, Tuple

APP_NAME = "focusflow"
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "focusflow.db"


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def connect_db() -> sqlite3.Connection:
    ensure_data_dir()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_column(
    conn: sqlite3.Connection, table: str, column_name: str, column_def: str
) -> None:
    cur = conn.execute(f"PRAGMA table_info({table})")
    columns = {row["name"] for row in cur.fetchall()}
    if column_name not in columns:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column_def}")


def init_db(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            tags TEXT,
            created_at TEXT NOT NULL
        )
        """
    )
    ensure_column(conn, "tasks", "is_done", "is_done INTEGER NOT NULL DEFAULT 0")
    ensure_column(conn, "tasks", "completed_at", "completed_at TEXT")
    ensure_column(conn, "tasks", "updated_at", "updated_at TEXT")
    conn.execute(
        "UPDATE tasks SET updated_at = COALESCE(updated_at, created_at)"
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            start_at TEXT NOT NULL,
            end_at TEXT,
            duration_min REAL,
            note TEXT,
            FOREIGN KEY (task_id) REFERENCES tasks (id)
        )
        """
    )
    conn.commit()


def get_open_session(conn: sqlite3.Connection) -> Optional[sqlite3.Row]:
    cur = conn.execute(
        "SELECT * FROM sessions WHERE end_at IS NULL ORDER BY start_at DESC LIMIT 1"
    )
    return cur.fetchone()


def get_task(conn: sqlite3.Connection, task_id: int) -> Optional[sqlite3.Row]:
    cur = conn.execute(
        "SELECT id, name, tags, is_done FROM tasks WHERE id = ?", (task_id,)
    )
    return cur.fetchone()


def add_task(conn: sqlite3.Connection, name: str, tags: str) -> None:
    conn.execute(
        "INSERT INTO tasks (name, tags, created_at, updated_at) VALUES (?, ?, ?, ?)",
        (name, tags, now_iso(), now_iso()),
    )
    conn.commit()


def list_tasks(conn: sqlite3.Connection, status: str, search: str) -> None:
    conditions = []
    params = []
    if status == "open":
        conditions.append("is_done = 0")
    elif status == "done":
        conditions.append("is_done = 1")
    if search:
        conditions.append("(name LIKE ? OR tags LIKE ?)")
        pattern = f"%{search}%"
        params.extend([pattern, pattern])
    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    cur = conn.execute(
        f"SELECT id, name, tags, is_done FROM tasks {where_clause} ORDER BY id",
        params,
    )
    rows = cur.fetchall()
    if not rows:
        print("No tasks yet. Add one with: python app.py task add \"My Task\"")
        return
    print("ID  STATUS  NAME                           TAGS")
    print("--  ------  -----------------------------  ------------------------")
    for row in rows:
        name = row["name"][:29]
        tags = (row["tags"] or "")[:24]
        status_text = "DONE" if row["is_done"] else "OPEN"
        print(f"{row['id']:<2}  {status_text:<6}  {name:<29}  {tags:<24}")


def update_task(
    conn: sqlite3.Connection, task_id: int, name: Optional[str], tags: Optional[str]
) -> None:
    task = get_task(conn, task_id)
    if not task:
        print(f"Task {task_id} not found. Use: python app.py task list")
        return
    updates = []
    params = []
    if name is not None:
        updates.append("name = ?")
        params.append(name)
    if tags is not None:
        updates.append("tags = ?")
        params.append(tags)
    if not updates:
        print("Nothing to update.")
        return
    updates.append("updated_at = ?")
    params.append(now_iso())
    params.append(task_id)
    conn.execute(f"UPDATE tasks SET {', '.join(updates)} WHERE id = ?", params)
    conn.commit()
    print("Task updated.")


def set_task_done(conn: sqlite3.Connection, task_id: int, done: bool) -> None:
    task = get_task(conn, task_id)
    if not task:
        print(f"Task {task_id} not found. Use: python app.py task list")
        return
    completed_at = now_iso() if done else None
    conn.execute(
        "UPDATE tasks SET is_done = ?, completed_at = ?, updated_at = ? WHERE id = ?",
        (1 if done else 0, completed_at, now_iso(), task_id),
    )
    conn.commit()
    state = "done" if done else "reopened"
    print(f"Task {task_id} {state}.")


def start_session(conn: sqlite3.Connection, task_id: Optional[int], note: str) -> None:
    if get_open_session(conn):
        print("A session is already running. Stop it first with: python app.py stop")
        return
    if task_id is not None:
        task = get_task(conn, task_id)
        if not task:
            print(f"Task {task_id} not found. Use: python app.py task list")
            return
        if task["is_done"]:
            print("Note: task is marked done; starting session anyway.")
    conn.execute(
        "INSERT INTO sessions (task_id, start_at, note) VALUES (?, ?, ?)",
        (task_id, now_iso(), note),
    )
    if task_id is not None:
        conn.execute(
            "UPDATE tasks SET updated_at = ? WHERE id = ?",
            (now_iso(), task_id),
        )
    conn.commit()
    if task_id:
        print(f"Started session for task {task_id}.")
    else:
        print("Started session.")


def stop_session(conn: sqlite3.Connection) -> None:
    open_session = get_open_session(conn)
    if not open_session:
        print("No active session.")
        return
    start_at = datetime.fromisoformat(open_session["start_at"])
    end_at = datetime.now()
    duration_min = round((end_at - start_at).total_seconds() / 60.0, 2)
    conn.execute(
        "UPDATE sessions SET end_at = ?, duration_min = ? WHERE id = ?",
        (end_at.isoformat(timespec="seconds"), duration_min, open_session["id"]),
    )
    conn.commit()
    print(f"Stopped session {open_session['id']} ({duration_min} min).")


def status(conn: sqlite3.Connection) -> None:
    open_session = get_open_session(conn)
    if not open_session:
        print("No active session.")
        return
    start_at = datetime.fromisoformat(open_session["start_at"])
    elapsed_min = round((datetime.now() - start_at).total_seconds() / 60.0, 2)
    print(f"Active session {open_session['id']} for {elapsed_min} min.")
    if open_session["task_id"]:
        task = get_task(conn, open_session["task_id"])
        if task:
            state = "done" if task["is_done"] else "open"
            print(f"Task: {task['name']} ({state})")
    if open_session["note"]:
        print(f"Note: {open_session['note']}")


def build_sessions_query(
    task_id: Optional[int], days: Optional[int], limit: Optional[int]
) -> Tuple[str, list]:
    conditions: List[str] = []
    params: List[Any] = []
    if task_id is not None:
        conditions.append("s.task_id = ?")
        params.append(task_id)
    if days is not None:
        since = datetime.now() - timedelta(days=days)
        conditions.append("s.start_at >= ?")
        params.append(since.isoformat(timespec="seconds"))
    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    sql = (
        "SELECT s.id, s.task_id, s.start_at, s.end_at, s.duration_min, "
        "s.note, t.name AS task_name "
        "FROM sessions s "
        "LEFT JOIN tasks t ON t.id = s.task_id "
        f"{where_clause} "
        "ORDER BY s.start_at DESC"
    )
    if limit is not None:
        sql += " LIMIT ?"
        params.append(limit)
    return sql, params


def list_sessions(conn: sqlite3.Connection, limit: int, task_id: Optional[int], days: Optional[int]) -> None:
    sql, params = build_sessions_query(task_id, days, limit)
    cur = conn.execute(sql, params)
    rows = cur.fetchall()
    if not rows:
        print("No sessions yet. Start one with: python app.py start")
        return
    print("ID  START                END                  MIN   TASK")
    print("--  -------------------  -------------------  ----  --------------------")
    for row in rows:
        start_at = row["start_at"]
        end_at = row["end_at"] or "-"
        mins = row["duration_min"]
        mins_text = f"{mins:.2f}" if mins is not None else "-"
        task = (row["task_name"] or "-")[:20]
        print(f"{row['id']:<2}  {start_at:<19}  {end_at:<19}  {mins_text:<4}  {task}")
        if row["note"]:
            print(f"    note: {row['note']}")


def stats(conn: sqlite3.Connection, days: int, task_id: Optional[int], daily: bool) -> None:
    since = datetime.now() - timedelta(days=days)
    if daily:
        sql = (
            "SELECT substr(start_at, 1, 10) AS day, "
            "COUNT(*) AS count, SUM(duration_min) AS total_min "
            "FROM sessions "
            "WHERE end_at IS NOT NULL AND start_at >= ?"
        )
        params: List[Any] = [since.isoformat(timespec="seconds")]
        if task_id is not None:
            sql += " AND task_id = ?"
            params.append(task_id)
        sql += " GROUP BY day ORDER BY day DESC"
        cur = conn.execute(sql, params)
        rows = cur.fetchall()
        if not rows:
            print("No sessions yet.")
            return
        print("DAY         COUNT  MIN")
        print("----------  -----  ------")
        for row in rows:
            total_min = row["total_min"] or 0
            print(f"{row['day']:<10}  {row['count']:<5}  {round(total_min, 2):<6}")
        return

    sql = (
        "SELECT COUNT(*) AS count, SUM(duration_min) AS total_min "
        "FROM sessions "
        "WHERE end_at IS NOT NULL AND start_at >= ?"
    )
    params: List[Any] = [since.isoformat(timespec="seconds")]
    if task_id is not None:
        sql += " AND task_id = ?"
        params.append(task_id)
    cur = conn.execute(sql, params)
    row = cur.fetchone()
    total_min = row["total_min"] or 0
    count = row["count"] or 0
    avg = round(total_min / count, 2) if count else 0
    print(
        f"Last {days} days: {count} sessions, {round(total_min, 2)} min total, {avg} min avg"
    )


def export_sessions(
    conn: sqlite3.Connection,
    out_path: Path,
    task_id: Optional[int],
    days: Optional[int],
) -> None:
    sql, params = build_sessions_query(task_id, days, None)
    cur = conn.execute(sql, params)
    rows = cur.fetchall()
    if not rows:
        print("No sessions to export.")
        return
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                "id",
                "task_id",
                "task_name",
                "start_at",
                "end_at",
                "duration_min",
                "note",
            ]
        )
        for row in rows:
            writer.writerow(
                [
                    row["id"],
                    row["task_id"],
                    row["task_name"],
                    row["start_at"],
                    row["end_at"],
                    row["duration_min"],
                    row["note"],
                ]
            )
    print(f"Exported {len(rows)} sessions to {out_path}")


def resume_session(conn: sqlite3.Connection, note: str) -> None:
    cur = conn.execute(
        "SELECT task_id FROM sessions WHERE task_id IS NOT NULL ORDER BY start_at DESC LIMIT 1"
    )
    row = cur.fetchone()
    if not row:
        print("No previous task found. Start one with: python app.py start --task <id>")
        return
    start_session(conn, row["task_id"], note)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog=APP_NAME,
        description="A tiny focus tracker for tasks and sessions.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("init", help="Create the local database")

    task = sub.add_parser("task", help="Task operations")
    task_sub = task.add_subparsers(dest="task_cmd", required=True)
    task_add = task_sub.add_parser("add", help="Add a task")
    task_add.add_argument("name", help="Task name")
    task_add.add_argument("--tags", default="", help="Comma-separated tags")
    task_list = task_sub.add_parser("list", help="List tasks")
    task_list.add_argument(
        "--status",
        choices=["all", "open", "done"],
        default="all",
        help="Filter by status",
    )
    task_list.add_argument("--search", default="", help="Search in name or tags")
    task_edit = task_sub.add_parser("edit", help="Edit a task")
    task_edit.add_argument("id", type=int, help="Task id")
    task_edit.add_argument("--name", default=None, help="New name")
    task_edit.add_argument("--tags", default=None, help="Comma-separated tags")
    task_done = task_sub.add_parser("done", help="Mark a task done")
    task_done.add_argument("id", type=int, help="Task id")
    task_reopen = task_sub.add_parser("reopen", help="Reopen a task")
    task_reopen.add_argument("id", type=int, help="Task id")

    start = sub.add_parser("start", help="Start a session")
    start.add_argument("--task", type=int, help="Task id")
    start.add_argument("--note", default="", help="Session note")

    resume = sub.add_parser("resume", help="Resume the most recent task")
    resume.add_argument("--note", default="", help="Session note")

    sub.add_parser("stop", help="Stop the active session")
    sub.add_parser("status", help="Show active session")

    sessions = sub.add_parser("sessions", help="List recent sessions")
    sessions.add_argument("--limit", type=int, default=20, help="Max rows")
    sessions.add_argument("--task", type=int, help="Filter by task id")
    sessions.add_argument("--days", type=int, help="Lookback window in days")

    export_cmd = sub.add_parser("export", help="Export sessions to CSV")
    export_cmd.add_argument(
        "--out",
        default=str(DATA_DIR / "sessions.csv"),
        help="Output path",
    )
    export_cmd.add_argument("--task", type=int, help="Filter by task id")
    export_cmd.add_argument("--days", type=int, help="Lookback window in days")

    stats_cmd = sub.add_parser("stats", help="Show basic stats")
    stats_cmd.add_argument("--days", type=int, default=7, help="Lookback window")
    stats_cmd.add_argument("--task", type=int, help="Filter by task id")
    stats_cmd.add_argument("--daily", action="store_true", help="Show daily totals")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    conn = connect_db()
    init_db(conn)

    if args.command == "init":
        print(f"Database ready at {DB_PATH}")
        return

    if args.command == "task":
        if args.task_cmd == "add":
            add_task(conn, args.name, args.tags)
            print("Task added.")
        elif args.task_cmd == "list":
            list_tasks(conn, args.status, args.search)
        elif args.task_cmd == "edit":
            update_task(conn, args.id, args.name, args.tags)
        elif args.task_cmd == "done":
            set_task_done(conn, args.id, True)
        elif args.task_cmd == "reopen":
            set_task_done(conn, args.id, False)
        return

    if args.command == "start":
        start_session(conn, args.task, args.note)
        return

    if args.command == "resume":
        resume_session(conn, args.note)
        return

    if args.command == "stop":
        stop_session(conn)
        return

    if args.command == "status":
        status(conn)
        return

    if args.command == "sessions":
        list_sessions(conn, args.limit, args.task, args.days)
        return

    if args.command == "export":
        export_sessions(conn, Path(args.out), args.task, args.days)
        return

    if args.command == "stats":
        stats(conn, args.days, args.task, args.daily)
        return


if __name__ == "__main__":
    main()
