---
name: collection-entry
description: Adds or updates this site's movie, TV, and book collection entries, sources matching covers through OpenCLI, processes assets, validates the site, then commits and pushes every completed change. Use when the user asks to add, finish, rate, wishlist, or otherwise update an item in this project's collection.
---

# Collection Entry

Manage entries in `src/data/collections.yaml` and covers in
`public/images/collections/<year>/` without disturbing unrelated work.

## Quick Start

For a request such as `collection 添加铁拳教育，7.8 分`:

1. Resolve the matching subject and cover through OpenCLI.
2. Determine dates and status from the request and current release state.
3. Process the cover to the next three-digit JPEG filename.
4. Append the YAML entry and validate it.
5. Close Chrome containers created by OpenCLI, then commit and push the change.

## Inputs

- Required: item name.
- Optional: media type, rating, status, start date, end date, and target year.
- Treat the supplied rating as the owner's rating; never replace it with the
  source site's rating.
- Use today's date as `start_date` when no date is given.
- Use `completed` only when the user says the item is finished or supplies an
  end date. Use `in_progress` for an ongoing series or current reading/viewing,
  and `wishlist` for future items. Ask only when status cannot be inferred.

## Workflow

### 1. Inspect the Repository

- Read `src/data/collections.yaml`, `script/process-collection-covers.ts`, and
  `package.json` before editing.
- Run `git status --short`; preserve every unrelated tracked, untracked, and
  stashed change.
- Derive the year and next cover number from current data and files. Never
  hardcode either value.

### 2. Resolve the Source

- Load `opencli-usage` and `smart-search` before the first OpenCLI call.
- Run their required live-registry and help preflight. Use the site explicitly
  requested by the user; default to Douban for Chinese movie, TV, and book
  entries.
- Before the first browser-dependent OpenCLI call, snapshot the IDs and URLs of
  existing Chrome windows and tabs. Use this baseline to identify only windows
  created during the workflow.
- Search once with a narrow media type and JSON output. Validate the selected
  result by title, year, type, and synopsis before using its subject ID.
- Record the subject URL, subject ID, cover URL, and image ID from the OpenCLI
  result. Do not add source-only fields to the collection YAML.

### 3. Acquire and Process the Cover

- Prefer the site's OpenCLI download command and request one poster.
- Inspect returned rows as well as the process exit code. A row with
  `status: failed` is a failure even when OpenCLI exits with code 0.
- On failure, run `opencli doctor` and follow `opencli-autofix`. If the adapter
  produced no repair trace, explicitly fall back to the cover URL returned by
  OpenCLI search, send the subject URL as `Referer`, and report that fallback.
- Prefer a large variant derived from the returned image URL when available;
  fall back to the exact returned URL if the large variant is unavailable.
- Before `pnpm covers`, confirm no unrelated non-numbered images would also be
  processed. If there are any, preserve them and process only the new cover
  with Sharp using the script's current size and quality settings.
- `pnpm covers` refreshes `src/data/collection-covers.json`; keep it in sync.
- Confirm the final file is a JPEG, uses the expected three-digit name, has
  sensible portrait dimensions, and visually matches the selected subject.

### 4. Update the YAML

- Keep the existing field order: `name`, `cover`, `start_date`, `end_date`,
  `status`, `rating`; omit fields that do not apply.
- `completed` entries normally require `end_date`. If the user explicitly says
  the completion date is unknown or should be omitted, keep the item completed
  without inventing one. `in_progress` and `wishlist` must not have `end_date`.
- Use `_` in `name` only when an intentional display line break is needed.

### 5. Clean Up OpenCLI Browser

- Clean up after the last OpenCLI call even when search or download failed.
- Release every known named browser session with
  `opencli browser <session> close` before closing its container.
- Snapshot Chrome again and compare it with the pre-OpenCLI baseline. Close only
  new OpenCLI-owned windows, identified by the window ID difference plus a sole
  `about:blank` tab or an `OpenCLI Browser` / `OpenCLI Adapter` tab group.
- OpenCLI may retain both grouped interactive and ungrouped adapter containers
  as blank windows. Prefer Chrome browser control; if another extension blocks
  takeover, use Chrome's native scripting interface with the exact confirmed
  window IDs.
- Never close windows by a global URL-only match, terminate the main Chrome
  process, or disturb any window or tab present in the baseline.
- Verify the OpenCLI-owned windows are gone and the baseline tabs remain.

### 6. Verify and Deliver

- Run targeted ESLint for the YAML, `git diff --check`, and `pnpm build`.
- Confirm the generated collection page contains the name, cover path, date,
  rating, and status. Report unrelated baseline failures without fixing them.
- Stage only files that belong to the current collection task; never stage
  unrelated worktree changes.
- Commit every completed modification using the repository's message style.
  Fetch the remote branch, reconcile any remote commits without losing user
  work, push, and verify local `HEAD` equals the remote branch. If the request
  produces no file changes, do not create an empty commit.
- Report the entry fields, source subject ID, cover dimensions, verification
  results, browser cleanup result, commit hash, push target, and the search
  summary required by `smart-search`.

## Boundaries

- Do not use a search engine or guessed image when an OpenCLI source result is
  available.
- Do not use the source site's public rating as the user's personal rating.
- Do not modify unrelated lint, build, content, or stashed changes.
- Do not claim success until the cover and generated collection page are both
  verified.
