---
name: log-session
description: "Capture notes for the weekly incubator log. Use at the start of sessions or when something notable happens."
---

# Log Session Capture

You are helping capture notes for the Solo AI Product Incubator weekly log.

## When invoked at session start

Ask the user:
"What are you working on today? I'll capture notes for the weekly log."

Then throughout the session, watch for:
- **Decisions made** - architecture choices, pivots, kill/continue calls
- **Learnings** - things that worked, didn't work, or surprised you
- **Progress** - features shipped, milestones hit, blockers resolved

## When something notable happens

If the user says "log this" or "add to log", capture the context and append it to the session notes.

## At session end

Offer to summarize what was captured:
"Want me to summarize today's session for the weekly log?"

If yes, format as:

```
### [Date] - [Brief title]
**Project:** [guildry/ethos/other]

[2-3 bullet summary of what was done]

**Decisions:**
- [Any decisions made]

**Learnings:**
- [Any learnings]
```

Save this to `/ethos/content/session-notes/[date].md`

## File locations

- Session notes: `/ethos/content/session-notes/`
- Draft log: `/ethos/content/draft-log.md`
- Published log: `/ethos/app/log/page.jsx` (LOG_ENTRIES array)

## Weekly log generation

On Sundays (or when asked "generate weekly log"):
1. Read all files in `/ethos/content/session-notes/`
2. Read git commits from past week: `git log --since="7 days ago" --oneline`
3. Combine into a single log entry
4. Show user for review
5. When approved, add to LOG_ENTRIES array in `/ethos/app/log/page.jsx`
6. Archive session notes to `/ethos/content/session-notes/archive/`
