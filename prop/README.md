# FocusFlow

A tiny, local-first focus tracker for tasks and work sessions. It stores data in a lightweight SQLite database under the project folder.

## Quick start

```bash
python app.py init
python app.py task add "Write report" --tags "work,writing"
python app.py task list
python app.py start --task 1 --note "outline"
python app.py status
python app.py stop
python app.py task done 1
python app.py resume --note "follow-up"
python app.py sessions --limit 10
python app.py stats --days 7 --daily
python app.py export --out data/sessions.csv
```

## Commands

- `init` create the database
- `task add <name> [--tags]` add a task
- `task list [--status all|open|done] [--search]` list tasks
- `task edit <id> [--name] [--tags]` update a task
- `task done <id>` mark a task done
- `task reopen <id>` reopen a task
- `start [--task] [--note]` start a session
- `resume [--note]` start a session for the most recent task
- `stop` stop the active session
- `status` show the active session
- `sessions [--limit] [--task] [--days]` list recent sessions
- `export [--out] [--task] [--days]` export sessions to CSV
- `stats [--days] [--task] [--daily]` show basic stats

## Notes

- Data is stored at `data/focusflow.db` in this project.
- This uses only Python standard library modules.

---

# Todo List

A clean, local-first todo list with a desktop UI, priorities, due dates, and CSV export.

## Quick start

```bash
python todo.py
```

## UI features

- Add or update todos with title, notes, priority, and due date.
- Filter by status, search, overdue, or due date range.
- Mark done, reopen, delete, clear completed, and export to CSV.
- Live stats bar for open, done, overdue, and due today.

## Notes

- Data is stored at `data/todo.db` in this project.
- Due date format: `YYYY-MM-DD` or `YYYY-MM-DD HH:MM`.
- The database is created automatically on first run.
