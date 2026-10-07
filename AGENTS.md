# Academic Website Repository Instructions

- Treat the CV repository's `evidence/claims.yml` and `evidence/surfaces.yml` as the factual source of truth.
- Inspect `git status` before editing and preserve unrelated user work.
- Every factual content entry must retain valid `claimIds` allowed on its public surface.
- Keep project names, personal roles, dates, metrics, award wording, and public links consistent with the canonical CV.
- Never publish a phone number, student ID, certificate identifier, local filesystem path, private repository URL, or omitted claim.
- Preserve the Astro content-collection architecture, the continuously scrollable homepage, and optional detail routes.
- Synchronize the public Academic Research CV with `npm run sync:cv -- --source <canonical-pdf>`.
- Run `npm run qa` after every website content, code, or downloadable-CV change.
- Show factual diffs and QA results before requesting permission to commit.
- Obtain a separate explicit instruction before any push or deployment.
- Do not run destructive Git commands or delete user files.

## Manager and worker workflow

- The primary coordinating chat acts as manager: it decides goals, scope, priorities, factual judgments, worker models, assignments, acceptance criteria, and final review.
- Delegate implementation, editing, and building to workers. The manager may inspect evidence and artifacts read-only and perform reviews or visual inspection. The human explicitly authorizes subagent delegation and manager-selected supported models.
- Use subagents for bounded implementation; create separate user-visible chats only when the human explicitly asks for a new chat. Honor user-specific model requests and report unavailability instead of silently substituting models.
- Prefer completion callbacks and reports over repeated app-chat polling. Have user-authorized app-chat workers send their completion report back. Subagents report through their normal completion channel. Do not sit waiting on app chats.
- Handoffs include the outcome, changed paths/files, appropriate validation, commit or deployment details when relevant, and blockers. The manager reviews actual artifacts before declaring completion and gives concrete follow-up work when needed.
- This manager policy applies to the coordinating agent. Assigned workers remain implementers and should not recursively delegate solely because of this section.
- User-facing reports and summaries include English and a Chinese translation. Source code and public website content remain in English unless the human requests otherwise.
