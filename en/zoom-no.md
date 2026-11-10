---
title: "Recording Zoom Meetings"
---

### Overview

When you connect your Zoom account, the Uninote AI bot joins your Zoom meetings, capturing audio and video, transcribing in real-time, and generating an AI summary after the meeting ends. This page explains how to start recording, the process after the meeting concludes, and how to handle recording consent.

### How to Start Recording

#### Method 1 — Manual Recording

1. Click **“+ New Meeting”** in Uninote AI.
2. Paste the Zoom meeting URL (e.g., `https://zoom.us/j/123456789?pwd=...`).
3. Click **“Start Recording.”**
4. The Uninote AI bot joins the meeting as a participant named **`[Your Organization's Name]'s Uninote AI`.**
5. The bot automatically starts recording and transcribing.

#### Method 2 — Calendar Integration

1. Connect your Google Calendar or Microsoft Outlook Calendar in **Settings > Integrations.**
2. If the calendar event includes a Zoom meeting link, the bot will automatically join at the scheduled start time.

> 💡 [HINT INFO]: For recurring meetings, calendar integration is the most reliable method. There is no need for manual operation for each session.

### Recording Consent

Before starting the recording, it is your responsibility to obtain consent from all meeting participants. Uninote AI automatically performs the following to assist with this task:

1. **The bot joins as a visible participant with a display name ending in “Uninote AI”** — Participants can always see who is recording.
2. **Before audio and video are captured, the bot posts the following exact message in the chat:**
   > _"This meeting is being recorded and transcribed by [Your Organization's Name]'s Uninote AI. By staying in this meeting you acknowledge this."_

   This wording is hardcoded and cannot be changed by users or organizations.
3. **The standard Zoom banner “This meeting is being recorded” will be displayed when recording starts.** Uninote AI does not suppress, auto-approve, or bypass this banner. If the host declines to record, neither audio nor video will be captured.

> ⚠️ [HINT WARNING]: While the above provides clear notification to participants, legal compliance with consent laws in your jurisdiction (e.g., two-party consent states in the U.S., GDPR Article 7 in the EU) is your responsibility.

### If the Host Has Not Granted Recording Permissions to the Bot

When the bot joins, it first checks if recording is already permitted. If recording is not yet allowed, it requests local recording permissions from the host via Zoom's standard in-meeting prompt. The bot will only start capturing audio and video after the host has approved. If the host declines, the bot will remain in the meeting but will not record.

### Conditions for Stopping the Recording

The bot will automatically stop recording and leave the meeting if any of the following occur:

- The host ends the meeting.
- All other participants leave the meeting (the bot waits 60 seconds before leaving).
- No speech is detected for 10 minutes (silence timeout).
- 4 hours have passed since recording began (maximum recording time).

You can also manually stop the recording by removing the bot from the participant list in the Zoom client.

### Process After the Meeting Ends

1. The recording is uploaded to encrypted cloud storage (AES-256 at rest, AWS Tokyo region).
2. A transcription with speaker identification is generated (using Deepgram).
3. An AI summary with action items is created (using OpenAI).
4. The complete meeting record is typically available on the Uninote AI dashboard within 1-2 minutes after the meeting ends.
