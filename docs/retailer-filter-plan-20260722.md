# Retailer Directory Update Plan - 2026-07-22

## Goal

Update KC Games demo retailer directory from the provided message/screenshots:

- Default view: all store types.
- Add store-type filters: Hobby Gaming Stores and Retail Only Stores.
- Retail only list includes Box Hunt / Impulse branches marked non-playing.
- Playing Box Hunt locations from the supplied first list remain under Hobby Gaming Stores and keep the Playing Location badge.
- Remove old placeholder playing locations.
- Sort states/regions alphabetically.
- Sort shop rows alphabetically inside each state/region.
- Deploy to demo only.

## Files

- `src/data/retailers.json`
- `src/components/RetailerSearch.tsx`
- `docs/PROJECT_STRUCTURE.md`
- `README.md`
- `AGENTS.md`

## Verification

- JSON parse succeeds.
- Counts match expected records after update.
- Demo workflow completes.
- Demo `/retailers.html` verifies filter counts and sample rows.
