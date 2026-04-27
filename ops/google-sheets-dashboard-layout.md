# Google Sheets dashboard layout

Use this when you want your Google Sheet to feel less like raw data and more like a small CRM.

## Recommended tab order

1. `Dashboard`
2. `customer-leads-template`
3. `Daily Queue`
4. `Paid Cases`
5. `Reference`

## Dashboard tab

Build a simple summary at the top of the workbook.

### Section 1: Today

Place these as large summary numbers:

- `New leads today`
- `Need reply today`
- `Paid but awaiting action`
- `Waiting for records`

### Section 2: This week

Show:

- total new leads
- total paid starter
- total paid standard
- total closed

### Section 3: Priority box

List rows where:

- `priority_level = High`
- and `lead_status` is not `Closed`

Suggested columns in this box:

- full_name
- country
- treatment_category
- payment_status
- next_action
- next_follow_up_date

## Daily Queue tab

Make this your first working tab after Dashboard.

Suggested visible columns:

- submitted_at
- full_name
- country
- treatment_category
- package_selected
- payment_status
- lead_status
- follow_up_stage
- next_action
- next_follow_up_date

Suggested filter:

- `lead_status` is not `Closed`
- `next_follow_up_date` is today or earlier

Sort order:

1. `priority_level` descending
2. `next_follow_up_date` ascending
3. `submitted_at` ascending

## Paid Cases tab

This tab should only show paying customers.

Suggested filter:

- `payment_status` contains `Paid`

Suggested visible columns:

- submitted_at
- full_name
- package_selected
- payment_status
- paypal_reference
- payment_amount_usd
- follow_up_stage
- assigned_to
- next_action
- next_follow_up_date

## Reference tab

Put clean lists here for data validation:

- payment_status values
- lead_status values
- follow_up_stage values
- priority_level values
- package names
- team names

## Recommended colors

- `New lead`: light blue
- `Waiting for reply`: light yellow
- `Paid client`: light green
- `High priority`: light red
- `Closed`: gray

## Best habit

Keep the Dashboard simple.
If a number does not help you decide what to do next, do not put it on the first page.
