# Google Sheets lead tracking setup

This setup gives you three things at once:

1. email delivery from `contact-new.html`
2. a Google Sheets lead log
3. a simple follow-up pipeline so paid and unpaid cases do not get lost

## Files in this folder

- `customer-leads-template.csv`
  Import this into Google Sheets as your starter lead tracker.
- `../scripts/google-sheets-webhook.gs`
  Copy this into a Google Apps Script project connected to the sheet.
- `../scripts/form-destinations.js`
  Paste your deployed Apps Script web app URL into this file.

## Recommended sheet tabs

### 1. `Leads`
Use the template CSV as the first sheet.

Recommended working statuses:

- `New lead`
- `Needs package confirmation`
- `Awaiting review`
- `Awaiting records`
- `Paid - starter`
- `Paid - standard`
- `In progress`
- `Closed`

### 2. `Payments`
Optional manual tab for PayPal checks:

- payment_date
- customer_name
- email
- package
- amount
- paypal_reference
- payment_confirmed
- notes

## How to connect the website form

1. Create a new Google Sheet.
2. Import `customer-leads-template.csv`.
3. Open `Extensions -> Apps Script`.
4. Paste the contents of `scripts/google-sheets-webhook.gs`.
5. Save the script project.
6. Deploy as a web app:
   - Execute as: `Me`
   - Who has access: `Anyone`
7. Copy the deployed web app URL.
8. Open `scripts/form-destinations.js`.
9. Replace the empty string with your web app URL:

```js
window.CHG_FORM_DESTINATIONS = {
    googleSheetsWebhookUrl: "YOUR_DEPLOYED_WEB_APP_URL"
};
```

10. Publish the site again.

## How the current site flow works

- New visitors fill `contact-new.html`
- Form submission still goes to EmailJS
- If `googleSheetsWebhookUrl` is filled in, the same submission is also sent into Google Sheets
- Pricing page now includes links for paid users to open the intake form with payment context attached

## How to operate this day to day

For each new row in `Leads`:

1. Check `payment_status`
2. Set `assigned_to`
3. Fill `next_action`
4. Fill `next_follow_up_date`
5. Move `lead_status` and `follow_up_stage` as the case progresses

## Recommended first workflow

- unpaid form lead:
  - `lead_status = New lead`
  - `follow_up_stage = Awaiting review`
- paid user from pricing:
  - `payment_status = Paid - awaiting confirmation`
  - confirm PayPal payment manually
  - change to `Paid - starter` or `Paid - standard`

## Important note

PayPal hosted buttons on the current site do not automatically write payment records into Google Sheets.
Right now the practical workflow is:

1. customer pays in PayPal
2. customer opens the intake form from pricing
3. form lands in Email + Google Sheets
4. you confirm payment manually in PayPal and update the row
