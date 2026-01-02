AI Milestone Generator — Usage & Test Steps

Overview
- Feature: "AI Milestone Generator" in teacher Team Details.
- Purpose: Break a project's title into manageable milestone phases using the Gemini model via provided API key.

Quick Usage
1. In Teacher Dashboard, open a team's details (click "View" on a team row).
2. In the "AI Milestone Generator" section:
   - Set number of Phases (1–10).
   - Click "Generate Milestones" to call the AI.
   - Review generated milestones and click "Save to Team" to persist them.

Manual Test Steps
1. Open `TeacherPage.html` in browser (serve via file:// works but use a simple HTTP server for CORS consistency).
2. Ensure sessionStorage has a `currentUser` (login via index.html or manually set in devtools).
3. Open a team details modal and click Generate with default phase count.
   - Expect: "Generate Milestones" button triggers AI call and replaces the placeholder with a list.
4. Click "Save to Team".
   - Expect: A success toast "Milestones saved to team successfully." and the list appears under "Saved Milestones".
5. Edge cases:
   - If no project title or team, you should see an error toast.
   - If AI returns malformed text, the generator will fallback to simple line-based milestones.

New: Project Request Details & Duplicate Check
- In the **Project Requests** view, each request now has a **View Details** button.
  - Click it to open the request modal showing team members and a project description (if provided). The requests list also now displays a short project description preview under the title.
- When approving a request, the provided description is now copied to the created team so it will appear in the Team Details view.

Messaging (Teacher ⇄ Student)
- A new **Messages** item is available in the Teacher sidebar. Click it to view conversations or compose new messages to students.
- From the **Student Roster**, use the **Message** button to start a one-to-one chat with any student.
- A new page `StudentMessages.html` lets students view and send messages (messages are stored in localStorage under the `projx_messages` key for demo purposes).

Notes:
- Messages are stored client-side in `localStorage`. For production-grade messaging, replace with a backend (Firebase/Firestore or your server) to persist and deliver messages reliably.
- The message object structure: { id, from: {id,name,role}, to: {id,name,role}, content, timestamp }.
  - Use **Check Duplicates** to run a quick client-side check against existing teams. Matches (exact or overlapping words) will be shown with a score.
  - Approve or Reject directly from the modal.

Notes for Developers
- API Key is embedded temporarily in `TeacherPage.html` in `handleAiGenerateMilestones()` for convenience.
  Replace or secure with server-side proxy for production.
- The generator expects JSON output but falls back to heuristics when needed.
- To change default milestone count, update `state.milestoneCount` in `TeacherPage.html`.

Contact
- For improvements (editable milestones, user confirmation, or storage persistence), open an issue or request further changes.