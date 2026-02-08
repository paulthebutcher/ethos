# Ethos Content

This folder holds content that feeds into the weekly log.

## Structure

```
content/
├── session-notes/          # Daily session captures
│   ├── 2026-02-06.md       # Today's notes
│   ├── 2026-02-07.md       # Tomorrow's notes
│   └── archive/            # Past weeks' notes after publishing
├── draft-log.md            # Weekly draft before publishing
└── README.md               # This file
```

## Workflow

1. **During sessions**: Notes captured to `session-notes/[date].md`
2. **Sunday**: All notes + git commits compiled into `draft-log.md`
3. **Review**: User reviews and tunes the draft
4. **Publish**: Entry added to `/app/log/page.jsx`
5. **Archive**: Session notes moved to `archive/`

## Commands

- Start of session: "log check" or just describe what you're working on
- During session: "log this: [note]" to capture something specific
- End of session: "summarize session" to see what was captured
- Sunday: "generate weekly log" to compile the week
