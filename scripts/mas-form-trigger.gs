/**
 * MAS Inventory Form — Response Trigger
 * Paste into: Form linked spreadsheet → Extensions → Apps Script
 * Run installTrigger() once to activate. Runs automatically on every submission.
 *
 * Creates/maintains a "Formatted" sheet tab with clean columns:
 *   timestamp | title | artist | medium | dimensions | condition |
 *   description | estimated_value | source | source_details
 */

var COLUMNS = [
  "timestamp",
  "title",
  "artist",
  "medium",
  "dimensions",
  "condition",
  "description",
  "estimated_value",
  "source",
  "source_details"
];

// Run this ONE TIME to install the submit trigger.
function installTrigger() {
  ScriptApp.newTrigger("onFormResponse")
    .forForm(FormApp.getActiveForm())
    .onFormSubmit()
    .create();
  Logger.log("Trigger installed.");
}

function onFormResponse(e) {
  var ss        = SpreadsheetApp.openById(FormApp.getActiveForm().getDestinationId());
  var formatted = ss.getSheetByName("Formatted") || ss.insertSheet("Formatted");

  if (formatted.getLastRow() === 0) {
    formatted.appendRow(COLUMNS);
    formatted.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }

  // Build lookup by question title
  var ans = {};
  e.response.getItemResponses().forEach(function(ir) {
    ans[ir.getItem().getTitle()] = ir.getResponse() || "";
  });

  formatted.appendRow([
    new Date().toISOString(),
    ans["Title / Name of piece"]  || "",
    ans["Artist name"]            || "",
    ans["Medium"]                 || "",
    ans["Dimensions"]             || "",
    ans["Condition"]              || "",
    ans["Description"]            || "",
    ans["Estimated value"]        || "",
    ans["Source"]                 || "",
    ans["Source details"]         || "",
  ]);
}
