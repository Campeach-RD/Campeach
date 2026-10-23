# Campeach editorial rollout — 23 October 2026

This change is prepared on a branch. It does not alter live services until merged and deployed.

## Resulting behavior

- Reels: Monday, Wednesday, Friday and Sunday, preserving the 11:00 AST publication window.
- Carousels: Tuesday and Thursday, preserving the 16:00 AST window.
- Moving footage at the opening instead of the 3.2-second still cover overlay.
- Catalog-backed hooks and rotating budget, experience, access and preparation angles.
- Access claims only where the catalog contains an explicit 4x4 fact.
- Prioritize Ocoa and El Valle while retaining other destinations and avoiding consecutive repeats within each format.
- Six editorial carousel slides and one INFO CTA, preserving existing comment-to-DM routing.
- Preserve the existing Mexican Chatterbox voice and 30–45 second validation.
- Pause the repetitive daily Halloween preparation and Cloudflare publication schedules.

## Deploy in order

1. Run editorial checks. Render a full reel preview using existing Drive credentials and inspect its opening, audio and complete narration. Inspect a six-photo carousel with real source photos.
2. Deploy the paused scheduler: `npx wrangler deploy --config automation/bosque-scheduler/wrangler.jsonc`. Updating GitHub alone cannot stop its already-running Cloudflare cron.
3. Deploy the main Instagram Worker: `npx wrangler deploy`. This enables the optional validated editorial caption in the carousel endpoint.
4. Merge the generator/workflow changes after deploying those services. An old Worker ignores editorial captions and publishes the previous default.
5. Verify actual Instagram receipts on the next scheduled dates. Review the pilot after 14 days using skips, shares, saves, qualified conversations and reservations.

No new recurring review task is created. No Instagram publication is requested by the editorial checks.

## Validation

Local Python syntax/editorial/layout tests, scheduler tests, 46 application tests and Worker type checking passed. CI repeats these checks and the production build. Full TTS/video rendering and live Cloudflare deployments require the connected production credentials and remain pending.
