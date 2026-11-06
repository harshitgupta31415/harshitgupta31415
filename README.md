<div align="center">

<img src="./assets/profile-header.svg" width="100%" alt="Harshit Gupta — software developer and competitive programmer" />

### 17-year-old full-stack developer building reliable systems · Codeforces Expert · 430+ problems solved

[LinkedIn](https://www.linkedin.com/in/harshit-gupta--) · [Email](mailto:harshitgupta3.1415@gmail.com) · [LeetCode](https://leetcode.com/u/harshitgupta314/) · [Codeforces](https://codeforces.com/profile/HarshitGupta314)

</div>

## About

I am a **17-year-old developer and CTO at [Vedonyx](https://www.vedonyx.com/)**, based in New Delhi, India. I work primarily with TypeScript, Python, React, FastAPI, PostgreSQL, and Flutter. I enjoy taking products beyond the demo stage: defining system boundaries, testing failure cases, documenting trade-offs, and deploying software that other people can evaluate.

## Selected engineering work

| Project | Engineering highlights | Stack |
| --- | --- | --- |
| [RollbackReady](https://github.com/harshitgupta31415/nycr3s1-frontend) · [API](https://github.com/harshitgupta31415/nycr3s1-backend) | Evidence-based Prisma migration review with deterministic checks, disposable PostgreSQL simulations, failure timelines, verified recovery plans, CI, containers, and cloud deployment. | Next.js, TypeScript, FastAPI, PostgreSQL, Docker, Kubernetes |
| [Prisma Schema Visualizer](https://github.com/harshitgupta31415/prisma-visualizer) · [Live](https://prisma-visualizer-six.vercel.app) | Interactive ER diagrams with relationship routing, obstacle avoidance, focus states, zoom, pan, and PNG export. | Next.js, React, TypeScript |
| [Memvora CLI](https://github.com/harshitgupta31415/memvora-cli) | Installable CLI for terminal capture, content hashing, offline queueing, workspace configuration, and authenticated synchronization. | Python, Typer, HTTPX |
| [VectorBridge](https://github.com/harshitgupta31415/cdr_to_svg) | Local-first CDR/SVG conversion interface with engine discovery, temporary-file cleanup, progress feedback, and light/dark themes. | TypeScript, Next.js, Node.js |

## Small tools, sharp boundaries

| Tool | What it solves |
| --- | --- |
| [envproof](https://github.com/harshitgupta31415/envproof) | Finds missing, empty, duplicate, and undocumented environment keys without exposing values. |
| [jsonshape](https://github.com/harshitgupta31415/jsonshape) | Detects breaking structural changes between JSON API payloads. |
| [portpick](https://github.com/harshitgupta31415/portpick) | Finds or safely reserves predictable TCP ports for local tools and test suites. |
| [PR Size Guard](https://github.com/harshitgupta31415/pr-size-guard) | Adds configurable pull-request size feedback without tokens or noisy bot comments. |
| [Stack Trace Sprint](https://github.com/harshitgupta31415/stack-trace-sprint) | Turns realistic failure traces into a keyboard-accessible debugging game. |
| [Repo Radar](https://github.com/harshitgupta31415/repo-radar) | Audits repository health and produces actionable local or CI reports. |
| [API Pulse](https://github.com/harshitgupta31415/api-pulse) | Checks endpoint availability, accepted statuses, and latency targets from a small contract. |
| [Contrast Lab](https://github.com/harshitgupta31415/contrast-lab) | Tests accessible colour pairs with exact WCAG calculations and shareable URLs. |

[Browse the complete project index →](PROJECTS.md)

## Open-source contributions

### Merged pull requests

1. [Hindsight: batch document-tag reads during scoped retain](https://github.com/vectorize-io/hindsight/pull/6402) — supplied the report, benchmark and original patch in [#6327](https://github.com/vectorize-io/hindsight/issues/6327). Merged upstream with maintainer credit; the original local benchmark measured **35.89× faster tag reads and permission checks** for 3,500 documents (3.04 s → 84.82 ms), excluding extraction and writes.
2. [Hindsight: avoid repeated scans when deleting knowledge folders](https://github.com/vectorize-io/hindsight/pull/6398) — reported and supplied the original patch in [#6323](https://github.com/vectorize-io/hindsight/issues/6323). The merged fix keeps rows on the traversal stack. The original local Python-walk benchmark measured up to **393.39× faster** (10.710 s → 27.22 ms; 25,000 bank nodes, 2,000 folder nodes), excluding database operations.
3. Wonderland: [Browser element picker for Component Preview (#74)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/74), [Commit/Sync main action (#68)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/68), [controls in narrow and short panes (#66)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/66), [file browsing and renaming (#59)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/59), [closed-tab recovery and relative paths (#53)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/53), [log copying and shared-view synchronization (#61)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/61), [recent files and keyboard search (#56)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/56), [workspace bounds and tab dragging (#51)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/51), [startup settings preservation (#50)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/50), [safe replace undo and search positions (#48)](https://github.com/TheWonderlandStudio/Idiot_Box/pull/48).
4. [Babel: speed up MO file writing](https://github.com/python-babel/babel/pull/1376) — used bytearray buffers to avoid repeated string-table copying, with byte-for-byte output and error compatibility checks.
5. [tomlkit: speed up array appends](https://github.com/python-poetry/tomlkit/pull/666) — avoided rebuilding the full index on normal array appends, preserving formatting behavior and compatibility fallbacks, with regression coverage.
6. [fsspec: speed up TAR file listing](https://github.com/fsspec/filesystem_spec/pull/2304) — avoided repeated directory-cache scans, with up to **221.795× faster warm TAR listings** in Django-source benchmarks (476.572 ms → 2.149 ms), plus compatibility fallbacks and regression tests.
7. [Babel: speed up PO location lookups](https://github.com/python-babel/babel/pull/1389) — optimized duplicate checks for PO source references while preserving reference order, with regression coverage.
8. [OpenClaw: avoid Doctor backups for unchanged one-shot jobs](https://github.com/openclaw/openclaw/pull/168938) — made cron repair a no-op for canonical schedules while preserving backups for real changes.
9. [OpenClaw: preserve request context in queued operations](https://github.com/openclaw/openclaw/pull/164105) — kept each queued operation's diagnostic context tied to its submitting request, with regression coverage.
10. [OpenClaw: keep distinct mixed-script memories in search results](https://github.com/openclaw/openclaw/pull/164062) — improved Unicode tokenization so distinct Cyrillic, Arabic, and Indic notes are not treated as duplicates.
11. [OpenClaw: find tool parameters inside composed schemas](https://github.com/openclaw/openclaw/pull/164032) — fixed tool discovery for parameter names and descriptions nested in `anyOf`, `oneOf`, and `allOf`, with regression tests.
12. [OpenClaw: seed Discord presence data after startup and reconnect](https://github.com/openclaw/openclaw/pull/141218) — merged with focused regression coverage and runtime-boundary validation.
13. [OpenClaw: clarify replies to buttonless question prompts](https://github.com/openclaw/openclaw/pull/137978) — replaced tap-only guidance with instructions that also work in text-only channels.
14. [OpenClaw: correct node-approval command examples](https://github.com/openclaw/openclaw/pull/153716) — merged documentation fix.
15. [Kubernetes: update the gRPC dependency](https://github.com/kubernetes/kubernetes/pull/141976) — merged upstream contribution.

### Co-authored upstream commits

1. [OpenClaw: localize the Security settings heading](https://github.com/openclaw/openclaw/commit/8618ce35896c66f93523211706ad9ee314273573) — proposed the original fix in [PR #153718](https://github.com/openclaw/openclaw/pull/153718). Maintainers merged replacement [PR #191143](https://github.com/openclaw/openclaw/pull/191143) with co-author credit, making the heading follow language changes while preserving help-text fallbacks.
2. [OpenClaw: handle Windows paths in repository checks](https://github.com/openclaw/openclaw/commit/c9569e415c92416497f25d2352dac69282a852b2) — proposed the original fix in [PR #168956](https://github.com/openclaw/openclaw/pull/168956). Maintainers independently implemented and merged replacement [PR #190069](https://github.com/openclaw/openclaw/pull/190069) with co-author credit, correcting Windows path handling in SQLite and changelog checks.
3. [XlsxWriter: speed up object positioning on uniform-height sheets](https://github.com/jmcnamara/XlsxWriter/commit/a039e83dacf1631d6d19b59f4217c79db8f76160) — reported and benchmarked [issue #1210](https://github.com/jmcnamara/XlsxWriter/issues/1210), then submitted [PR #1211](https://github.com/jmcnamara/XlsxWriter/pull/1211). The maintainer landed a simpler implementation directly on `main` with co-author credit; the PR itself was closed without merging.

## Engineering focus

- **Product engineering:** accessible interfaces, typed APIs, authentication, persistence, and responsive interaction.
- **Backend systems:** Python services, PostgreSQL, migrations, validation, authorization, and failure-safe workflows.
- **Delivery:** automated tests, GitHub Actions, containers, Vercel, Cloud Run, and Kubernetes.
- **Problem solving:** Codeforces Expert with **430+ unique problems solved** across LeetCode and Codeforces—currently 368 on LeetCode and 59 on Codeforces.

## Competitive programming

<div align="center">

[<img src="./assets/codeforces-rating.svg" width="97%" alt="Live HarshitGupta314 Codeforces dashboard" />](https://codeforces.com/profile/HarshitGupta314)

<sub>The Codeforces dashboard is regenerated from the official API every six hours.</sub>

</div>

## Core toolkit

| Area | Tools |
| --- | --- |
| Languages | TypeScript, Python, JavaScript, Dart, SQL |
| Product | Next.js, React, Node.js, Flutter, FastAPI |
| Data | PostgreSQL, Prisma, SQLAlchemy, Pandas, NumPy |
| Delivery | GitHub Actions, Docker, Kubernetes, Vercel, Google Cloud |

<div align="center">

Open to collaborating on developer tools, data products, and reliability-focused web systems.

</div>
