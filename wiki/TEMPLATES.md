# Wiki templates & conventions

Every note type has a **starter file** under [`templates/`](../templates/) in the repo root. Copy the template, move it into the right `wiki/…` folder, rename the file, fill frontmatter and body.

## Quick map: folder → template

| Wiki folder | Template file | What goes here |
|-------------|---------------|----------------|
| `wiki/meta/` | [`meta-source-note.md`](../templates/meta-source-note.md) | Vault rules, lint, how *you* run the system |
| `wiki/concepts/` | [`concept.md`](../templates/concept.md) | Definitions, mental models, frameworks |
| `wiki/people/` | [`person.md`](../templates/person.md) | Individuals |
| `wiki/people/organizations/` | [`organization.md`](../templates/organization.md) | Companies, teams, communities |
| `wiki/projects/` | [`project.md`](../templates/project.md) | Bounded initiatives with outcomes |
| `wiki/areas/` | [`area.md`](../templates/area.md) | Ongoing responsibilities (PARA “areas”) |
| `wiki/playbooks/` | [`playbook.md`](../templates/playbook.md) | Repeatable workflows, SOPs, prompt chains |
| `wiki/references/books/` | [`reference-book.md`](../templates/reference-book.md) | Books |
| `wiki/references/papers/` | [`reference-paper.md`](../templates/reference-paper.md) | Academic / preprint papers |
| `wiki/references/articles/` | [`reference-article.md`](../templates/reference-article.md) | Blog posts, newsletters, news |
| `wiki/references/courses/` | [`reference-course.md`](../templates/reference-course.md) | Courses, cohort programs |
| `wiki/journal/YYYY/` | [`journal-entry.md`](../templates/journal-entry.md) | Dated reflections (`YYYY-MM-DD-title.md`) |
| `wiki/meetings/` | [`meeting.md`](../templates/meeting.md) | 1:1s, standups, workshops |
| `wiki/decisions/` | [`decision-adr.md`](../templates/decision-adr.md) | ADRs and irreversible choices |
| `wiki/resources/tools/` | [`resource-tool.md`](../templates/resource-tool.md) | Stack, apps, CLI tools |
| `wiki/resources/` (link lists) | [`resource-link-collection.md`](../templates/resource-link-collection.md) | Curated URLs on a theme |
| `wiki/questions/` | [`question-research.md`](../templates/question-research.md) | Open research / life questions |
| `wiki/reviews/` | [`review-weekly.md`](../templates/review-weekly.md), [`review-quarterly.md`](../templates/review-quarterly.md) | Reviews |
| `wiki/moc/` | [`moc.md`](../templates/moc.md) | Maps of content (hub pages) |

Full template index: [`templates/README.md`](../templates/README.md).

## Naming files

| Pattern | Example |
|---------|---------|
| People | `firstname-lastname.md` or handle |
| Organizations | `org-name.md` |
| Projects | `short-slug.md` |
| Concepts | `kebab-case.md` |
| Journal | `YYYY-MM-DD-optional-topic.md` |
| Meetings | `YYYY-MM-DD-topic-or-participants.md` |
| ADRs | `adr-0001-short-title.md` |
| Reviews | `weekly-YYYY-Www.md`, `quarterly-YYYY-Qn.md` |

## Frontmatter

- **Recommended:** `title`, `type`, `created`, `last_updated`, `tags`.
- **Optional:** links to related pages in arrays (`related_concepts`, etc.) for future Dataview-style queries.

## Wikilinks

Use `[[Page Title]]` or `[visible text](./path/to/file.md)` — both work in plain text search; your Obsidian or viewer may resolve wikilinks graphically.

## Lint (periodic)

See [meta/lint-checklist.md](./meta/lint-checklist.md).
