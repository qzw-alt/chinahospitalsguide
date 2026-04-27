# Google Sheets operations guide

Use this guide after the webhook is already working.

## Recommended workbook layout

Keep one Google Sheet with these tabs:

### 1. `customer-leads-template`
Main intake log from the website.

### 2. `Daily Queue`
Filtered working view for rows that still need action today.

Suggested filter:
- `lead_status` is not `Closed`
- `next_follow_up_date` is today or earlier

### 3. `Paid Cases`
Filtered working view for paying customers.

Suggested filter:
- `payment_status` contains `Paid`

### 4. `Reference`
Optional admin tab for:
- package names
- allowed status values
- team member names

## Recommended column logic

### Core columns to watch every day

- `payment_status`
- `lead_status`
- `follow_up_stage`
- `assigned_to`
- `next_action`
- `next_follow_up_date`

### Suggested values

#### `payment_status`
- `Not paid yet`
- `Paid - awaiting confirmation`
- `Paid - starter`
- `Paid - standard`
- `Refund requested`
- `Refund completed`

#### `lead_status`
- `New lead`
- `Needs package confirmation`
- `Waiting for reply`
- `Paid client`
- `In progress`
- `Closed`

#### `follow_up_stage`
- `Awaiting review`
- `Awaiting package recommendation`
- `Awaiting payment confirmation`
- `Awaiting records`
- `Awaiting appointment step`
- `Awaiting travel planning`
- `Completed`

#### `priority_level`
- `High`
- `Medium`
- `Low`

## Suggested conditional formatting

Apply these in Google Sheets:

### 1. highlight urgent follow-up
Rule:
- column `next_follow_up_date`
- date is today or earlier
- background: light red

### 2. highlight paid but not moving
Rule:
- text contains `Paid`
- and `follow_up_stage` contains `Awaiting`
- background: light amber

### 3. highlight new leads
Rule:
- `lead_status = New lead`
- background: light blue

### 4. highlight closed rows
Rule:
- `lead_status = Closed`
- background: light gray
- text: muted gray

## Suggested filters you should save

### View 1: `New Leads`
- `lead_status = New lead`

### View 2: `Need Reply`
- `next_follow_up_date` today or earlier
- `lead_status` is not `Closed`

### View 3: `Paid Starter`
- `payment_status = Paid - starter`

### View 4: `Paid Standard`
- `payment_status = Paid - standard`

### View 5: `Waiting for Records`
- `follow_up_stage = Awaiting records`

## Daily workflow

### Morning
1. open `Daily Queue`
2. reply to overdue leads first
3. confirm any new payments

### After each reply
Update:
- `last_contacted_at`
- `next_action`
- `next_follow_up_date`
- `lead_status`
- `follow_up_stage`

### After a PayPal payment
1. confirm payment in PayPal
2. add `paypal_reference`
3. update `payment_amount_usd`
4. change `payment_status`
5. change `lead_status` to `Paid client`

## Suggested first team rule

Never leave these blank after first review:

- `assigned_to`
- `next_action`
- `next_follow_up_date`

If these three are filled, the case is much less likely to be lost.
