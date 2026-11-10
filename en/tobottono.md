---
title: "Permissions and Bot Identification"
---

### Overview

The Uninote AI Zoom integration requires only the minimum permissions necessary for the bot to join meetings and record on your behalf. This page describes the exact permissions requested, the reasons each permission is needed, and how to identify the bot during meetings.

### Requested Zoom OAuth Scopes

| Scope | Purpose |
| --- | --- |
| `user:read:user` | Retrieve profile to link your Zoom account with Uninote AI |
| `user:read:token` | Obtain access token for bot authentication during meetings |
| `user:read:zak` | Generate ZAK token for the bot to join meetings on your behalf |
| `meeting:read:meeting` | Read meeting details (number, password format) for the bot to join the correct meeting |

> 💡 [HINT INFO]: Uninote AI does **not** request any write, delete, or administrative permissions for your Zoom account. It cannot start, change, or end your meetings, modify account settings, or read data from other users.

### How to Identify the Bot in Meetings

The bot can always be identified as an automated Uninote AI participant. Participants can identify the bot in the following three independent ways.

#### 1. Display Name

The display name of the bot shown in the Zoom participant list always ends with the suffix **"Uninote AI"**. The complete pattern is as follows:

```text
[Your Organization Name]'s Uninote AI
```

This suffix is enforced by the bot's code and **cannot be removed** in your organization's branding or custom name fields.

#### 2. Chat Disclosure Upon Joining

Immediately upon joining, before audio and video are captured, the bot posts a chat message to all participants notifying them that the meeting is being recorded. For the exact wording, please refer to Zoom meetings → Recording → Consent to Record.

#### 3. Zoom Standard Recording Banner

The moment the bot starts recording, the standard Zoom banner "This meeting is being recorded" is displayed to all participants. Uninote AI does **not suppress, auto-approve, or bypass** this banner — for more details, please refer to the recording page.
