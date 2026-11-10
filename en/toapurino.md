---
title: "Disconnecting and Deleting the App"
---

### Overview

The Uninote AI Zoom integration is registered in two locations: **within your Uninote AI account** (where OAuth tokens and bot launch settings are stored) and **within Zoom** (where the app is installed on your Zoom account).

To completely remove the integration, you must follow both steps below in order.

### Step 1 — Disconnect within Uninote AI

This step performs cleanup on our side.

1. Sign in to [Uninote AI](https://app.uninote.ai).
2. Navigate to **Settings > Integrations > Zoom**.
3. Click **"Disconnect"**.

When you click "Disconnect," Uninote AI will immediately perform the following actions:

- Remove the OAuth token from our database.
- Call the Zoom `POST /oauth/revoke` endpoint to invalidate authorization on the Zoom side.
- Stop any scheduled bot launches associated with your account.

### Step 2 — Remove the App from the Zoom App Marketplace

This step performs cleanup on the Zoom side.

1. Go to the [Zoom App Marketplace](https://marketplace.zoom.us).
2. Click **"Manage" > "Installed Apps"**.
3. Find **Uninote AI** and click **"Remove"**.
4. Confirm the removal.

### Reason Both Steps are Necessary

> ⚠️ [HINT WARNING]: If you only perform Step 2 (removal from the Marketplace) without executing Step 1 (disconnecting within the app), the OAuth token we hold will naturally expire — the Zoom access token expires in about 1 hour, and the refresh token expires within 90 days. During this time, the bot will fail authentication in new meetings. To immediately stop the bot and delete our token copy, be sure to execute Step 1.

### Deleting Existing Recordings

Disconnecting or deleting the app will not delete any recordings or transcriptions that have already been created. To delete this data, please do one of the following:

- Sign in and use **Settings > Account > Delete Account** — this will delete your entire Uninote AI account and all associated data.
- Send an email to [**dev@widsley.com**](mailto:dev@widsley.com) with the subject `Data deletion request — [your account email address]` — we will delete the requested data and confirm via email.

### Rights of Data Subjects in the EU / UK

Customers residing in the EU or UK have the following additional rights under GDPR / UK-GDPR:

- The right to **access** personal data we hold.
- The right to **rectify** inaccurate personal data.
- The right to **delete** personal data (the "right to be forgotten").
- The right to **restrict** or **object** to specific processing of personal data.
- The right to **transfer** personal data to other services in a structured, machine-readable format.

To exercise these rights, please send an email to [**dev@widsley.com**](mailto:dev@widsley.com) with the subject `GDPR request — [your account email address]`. We will respond within 30 days as required by GDPR Article 12(3).
