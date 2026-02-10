# Claude.md

## General Instruction
Before writing any code, **always** produce a detailed, step-by-step plan explaining:
1. The overall approach
2. Key decisions and trade-offs
3. Any assumptions made
4. How the code will be structured and tested

Do not write any code until I explicitly approve the plan.  
Once I approve, produce the code with comments mapping back to the plan.

## Style
- Explanations should be clear and concise.
- Code should be clean, modular, and well-commented.
- Prefer clarity over brevity in the plan phase.

## Core Rules

1. **Think in Tasks**  
   Treat every prompt as a miniature project. Before writing any code, mentally decompose the request into the smallest practical tasks.

2. **Break Down & Propose**  
   Immediately return a concise, **numbered list** of tasks required to satisfy the prompt.  
   *Format:*  
```
## Proposed Tasks

1. …
2. …
3. …
```
Do **not** begin coding until the user approves or revises the plan.

3. **Seek Explicit Approval**  
After listing tasks, ask:  
> "✅ *Ready for me to start on Task 1?* (yes / no / edit plan)"  
Proceed only on an explicit "yes."

4. **Create a Task Log Folder**  
For the current conversation, create / update a folder named:  
```
.claude_tasks/YYYY-MM-DD_HH-MM-SS/
```
Inside, add a markdown file for each task:  
`T{n}_{slug}.md`  → description, code snippets, decisions.

5. **Execute Sequentially & Commit Often**  
Work through tasks *one at a time*, committing code after each task. After finishing a task, output a one-line status and ask whether to proceed to the next task.

6. **Guarantee Code Quality**  
- Follow language & framework best practices.  
- Write clean, commented, DRY code.  
- Prefer secure defaults; avoid hard-coding secrets.  
- If uncertain, pause and ask clarifying questions.

7. **Summarize When Done**  
Upon completing all approved tasks, create **SUMMARY.md** in the task folder:  
- Files added / modified  
- High-level overview of changes  
- Next recommended steps / optimizations

---

## Project-Specific Context

### BarrelBook Overview
iOS app for whiskey enthusiasts to catalog bottles using AI-powered image recognition. Uses OpenAI's GPT-4o-mini for bottle detection and metadata extraction.

### Tech Stack
- **Platform**: Native iOS (Swift/SwiftUI)
- **Backend**: Firebase (Auth + Firestore)
- **AI Integration**: OpenAI API for bottle detection
- **Architecture**: MVVM with SwiftData

### Key Project Structure
```
/BarrelBook
  /Models          # Data models (Bottle, BottleFacts, etc.)
  /Views           # SwiftUI views
  /ViewModels      # View models (CameraViewModel, ScanViewModel)
  /Services        # API services, authentication, repositories
  /Camera          # Camera-specific views
/docs              # Comprehensive project documentation
```

### Important Commands
```bash
# Build and run in Xcode
xcodebuild -scheme BarrelBook build
xcodebuild test -scheme BarrelBook

# SwiftLint (if configured)
swiftlint
```

### Key Features
- Camera scanning with bottle detection
- Manual bottle entry
- Catalog management
- Price tracking (MSRP and secondary market)
- Firebase authentication and data sync

### Design System
- Primary colors: #D97843 (bourbon), #1a0f0a (dark)
- Font: SF Pro Display/Text
- See `docs/System tokens.md` for complete design specs

### API Integration
- OpenAI endpoint: POST https://api.openai.com/v1/responses
- Model: gpt-4o-mini-2024-07-18
- See `docs/BarrelBook v1 — OpenAI Integration Technical Specification.md`

### Security Notes
- API keys stored in Keychain
- Firebase security rules in `firestore.rules`
- Never commit GoogleService-Info.plist changes

### UI Consistency Guidelines (Gradual Implementation)

**IMPORTANT**: We're implementing UI consistency gradually to avoid major refactoring. When you modify any bottle-related view (Add, Edit, Extract, Detail), follow these principles:

#### Gradual Consistency Approach
1. **When touching existing code**: Update it to follow consistency patterns
2. **When adding new features**: Use shared components if they exist
3. **When you see duplication**: Consider extracting to a shared component
4. **DO NOT**: Refactor working code just for consistency unless explicitly asked

#### Field Order (Apply when updating views)
All bottle views should follow this hierarchy:
1. Photo Section
2. Basic Information (Brand, Name, Type)
3. Barrel Information (Proof, Age, Batch, Barrel #)
4. Store & Purchase
5. Valuation (MSRP, Secondary)
6. Tags & Categories
7. Notes

#### Shared Components to Use (if they exist)
- `FormSection` - For grouping fields
- `FormTextField` - For text input
- `FormToggleSection` - For toggleable sections
- `DetailSection` - For read-only display

#### When Creating New Shared Components
Only create if you need the same UI in 2+ places:
1. Place in `/Views/Components/`
2. Name as `Form[Type]` or `Detail[Type]`
3. Document usage in the component

#### Consistency Checklist (for modified views only)
- [ ] Field order matches hierarchy above
- [ ] Labels are consistent with other views
- [ ] Using DesignTokens for colors
- [ ] Validation rules match other views
- [ ] Consider extracting if duplicated 3+ times

**Remember**: Perfect consistency is the goal, but gradual improvement is the path. Don't let perfect be the enemy of good.

---

### Ralph Sprint Workflow (Mandatory on Plan Finalization)

When a plan is approved and ready for execution, you **MUST** scaffold a Ralph sprint before writing any implementation code. This is a blocking requirement — no implementation begins until the sprint files exist.

#### Prerequisites

Ensure these files exist in the project (copy from BarrelBook or the ralph-template repo):

```
plans/
  ralph.sh              # Iterative loop runner
  ralph_once.sh         # Single-iteration runner
  ralph_prompt.md       # Default RALPH prompt (generic)
  run_agent.sh          # Agent adapter dispatcher
  prd.schema.json       # PRD JSON schema
  adapters/
    claude_code.sh      # Claude Code CLI adapter
```

#### Step 1: Create the sprint folder

```
plans/sprints/YYYY-MM-DD-{slug}/
```

Use today's date and a short kebab-case slug derived from the task (e.g., `2026-02-08-add-auth`).

#### Step 2: Generate `prd.json`

Follow `plans/prd.schema.json`. Convert each approved task into a PRD item:

```json
{
  "project": {
    "name": "<sprint title>",
    "repoRoot": "."
  },
  "definitionOfDone": {
    "required": ["All items pass", "Project builds", "No regressions"]
  },
  "items": [
    {
      "id": "<PREFIX>-001",
      "priority": 1,
      "title": "...",
      "description": "...",
      "acceptanceCriteria": ["..."],
      "passes": false,
      "tags": ["..."]
    }
  ]
}
```

- IDs use a short prefix derived from the slug (e.g., `AUTH-001`, `PERF-001`)
- All items start with `"passes": false`
- Include `acceptanceCriteria` for every item — this is what RALPH uses to verify completion
- List `files_changed` at the top level if known

#### Step 3: Create `progress.txt`

```
<Sprint Title>
=====================================================

Started: YYYY-MM-DD
Status: In Progress (0/N items)

## Goals
- <goal 1>
- <goal 2>

## Items

### Priority 1
- [ ] PREFIX-001: <title>
- [ ] PREFIX-002: <title>

### Priority 2
- [ ] PREFIX-003: <title>

## Files to Modify
- <file list>

## Deployment
- <deployment notes, if applicable>
```

#### Step 4: Create `prompt.md` (sprint-specific instructions)

Base it on `plans/ralph_prompt.md` but add sprint-specific context:

- **Verification commands** — Replace `./scripts/ci.sh` with whatever applies to this project:
  - iOS: `xcodebuild -scheme <Scheme> build -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' 2>&1 | tail -20`
  - Node/TS: `npm test`
  - Python: `pytest`
  - Go: `go test ./...`
- **Domain-specific guidelines** — e.g., "backwards compatibility required", "do not break the API contract"
- **Constraints** discovered during planning

#### Step 5: Print the launch command

After scaffolding, print the command so the user can launch the sprint:

```bash
# Iterative (runs up to N iterations until all items pass):
RALPH_AGENT_CMD=./plans/adapters/claude_code.sh ./plans/ralph.sh plans/sprints/YYYY-MM-DD-{slug} 25

# Single iteration:
RALPH_AGENT_CMD=./plans/adapters/claude_code.sh ./plans/ralph_once.sh plans/sprints/YYYY-MM-DD-{slug}
```

#### Important

- Do NOT begin implementation until the sprint scaffold is created
- Do NOT skip any of the four files (prd.json, progress.txt, prompt.md, folder)
- If the user says "run it" or "go", scaffold first, then execute interactively

---

### Quick Setup for Ralph in a New Project

```bash
# From the new project root:
mkdir -p plans/adapters plans/sprints

# Copy the ralph infrastructure files:
cp /path/to/barrelbook/plans/ralph.sh         plans/
cp /path/to/barrelbook/plans/ralph_once.sh    plans/
cp /path/to/barrelbook/plans/ralph_prompt.md  plans/
cp /path/to/barrelbook/plans/run_agent.sh     plans/
cp /path/to/barrelbook/plans/prd.schema.json  plans/
cp /path/to/barrelbook/plans/adapters/claude_code.sh plans/adapters/

chmod +x plans/ralph.sh plans/ralph_once.sh plans/run_agent.sh plans/adapters/claude_code.sh

# Then paste the "Ralph Sprint Workflow" section above into your CLAUDE.md
```