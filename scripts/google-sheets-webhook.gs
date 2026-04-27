function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");
  }

  var data = e && e.parameter ? e.parameter : {};
  var now = new Date();

  var row = [
    Utilities.getUuid(),
    now,
    data.firstname || "",
    data.lastname || "",
    data.email || "",
    data.phone || "",
    data.country || "",
    data.treatment_category || "",
    data.medical_details || "",
    data.source || "",
    data.package || "",
    data.payment_status || "Not paid yet",
    data.lead_status || "New lead",
    data.follow_up_stage || "Awaiting review",
    data.source_page || "",
    "",
    "",
    "",
    ""
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "lead_id",
      "submitted_at",
      "first_name",
      "last_name",
      "email",
      "phone_whatsapp",
      "country",
      "treatment_category",
      "medical_details",
      "lead_source",
      "package_selected",
      "payment_status",
      "lead_status",
      "follow_up_stage",
      "source_page",
      "assigned_to",
      "next_action",
      "next_follow_up_date",
      "internal_notes"
    ]);
  }

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
