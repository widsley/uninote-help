---
title: "Automatically Delete Carrier Recordings"
---

<Note>
  This page is a guide for organization owners and administrators. This setting will not be visible to members.
</Note>

You can automatically delete recordings of calls from specified numbers or internal calls as soon as they are received. The calls themselves will remain in the activity log, where you can check the date, call duration, direction (incoming or outgoing), and number.

---

### Steps to Configure

1. Open the [Organization] in the left menu.
2. In the [Organization Information] tab, click on [Edit Numbers and Rules] under "Automatic Deletion of Carrier Recordings."
3. Enter the phone numbers in the list below and confirm by pressing "Enter." You can add multiple numbers separated by commas.
4. If you want to delete recordings of internal calls as well, turn on "Delete Internal Call Recordings."
5. Click [Save Changes] and verify the changes on the confirmation screen before saving.

| List | Calls Whose Recordings Will Be Deleted |
|---|---|
| Caller Number (From) | Calls made from this number |
| Recipient Number (To) | Calls received by this number |
| Either Outgoing or Incoming (From or To) | Calls made or received by this number |

- You can enter numbers in formats with hyphens or starting with +81. 090-1234-5678, 09012345678, and +819012345678 will be treated as the same number.
- Please enter numbers with 10 to 11 digits.
- "Delete Internal Call Recordings" applies when both the caller and recipient are numbers registered with Uninote for carrier recordings within this organization. There is no need to add numbers to the list.

<Warning>
  Deleted recordings cannot be restored. Matched recordings will be permanently deleted, and no transcriptions or summaries will be created.
  Recordings received before saving the settings will not be affected.
</Warning>

---

### Display of Deleted Call Recordings

- In the activity list, a strikethrough will appear on the microphone icon.
- In the call details, instead of the recording player and summary, it will display "Recording deleted due to automatic deletion settings."
- Calls with deleted recordings will not be synchronized with Salesforce or HubSpot (the CRM sync column will display "Not Syncable").
- If the number is registered in contacts, the name of the call participant will still be displayed.

---

### Frequently Asked Questions

**Q. I want to add or change a number registered for carrier recordings.**

A. You can check the registered numbers in the settings screen under "Registered Numbers." Registration or changes to numbers will be handled by Uninote support, so please contact us.

**Q. Will recordings that are already saved be deleted?**

A. No. Only recordings received after saving the settings will be affected. To delete saved recordings, please remove them individually from the activity log.
