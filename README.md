# ✅ To‑Do List Web Application

A clean, responsive, and feature-rich To‑Do List application built using **HTML**, **CSS**, and **JavaScript**, with **LocalStorage** for persistent data storage.

---

## 🚀 Features

### ✅ Core Functionalities

* **Add Tasks** – Quickly add tasks using the input bar or pressing Enter
* **Edit Tasks Inline** – Edit any task directly by clicking the edit button
* **Mark as Completed** – Toggle completion using a checkbox
* **Delete Tasks** – Remove tasks instantly
* **Drag & Drop Reordering** – Reorder tasks visually
* **Filter Tasks** – View **All**, **Active**, or **Completed** tasks
* **Persistent Storage** – Tasks remain saved using `LocalStorage`
* **Toggle All Tasks** – Mark all tasks complete or incomplete at once
* **Clear Completed Tasks** – Clean your list in one click
* **Task Timestamp** – Shows when each task was added
* **Export Tasks (JSON)** – Download all your tasks in a JSON file

---

## 🧰 Tech Stack

* **HTML5** – Structure
* **CSS3** – Modern UI, dark/light modes, responsive layout
* **Vanilla JavaScript** – Full app logic, task management, drag-and-drop
* **LocalStorage** – Persistent offline storage

---

## 📁 Project Structure

This entire project works from a **single HTML file** that contains:

* `<style>` block for CSS
* `<script>` block for JavaScript
* HTML UI layout

You can run it simply by opening the file in any browser.

---

## ▶️ How to Run

1. Download or copy the `index.html` file
2. Open it in any modern browser (Chrome, Firefox, Edge, Safari)
3. Start adding your tasks — everything is stored automatically

No server or dependencies needed.

---

## 📦 LocalStorage Schema

Tasks are stored under the key:

```
todo.tasks.v1
```

Each task object contains:

```json
{
  "id": "unique-id",
  "text": "Task description",
  "completed": false,
  "createdAt": 1731248600000
}
```

---

## 🎯 Future Enhancements (Optional Ideas)

* Dark/Light mode switch
* Categories/labels for tasks
* Cloud sync
* PWA support (installable app)
* Reminders/notifications

---

## 🌐 Deploy to GitHub Pages

> Works with a single `index.html` in the repo — no build tools needed.

### Option A — Quickest (from GitHub UI)

1. Push this project to a GitHub repo (e.g., `todo-app`).
2. Open **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Select **Branch:** `main` and **Folder:** `/ (root)` → **Save**.
5. Wait ~1–2 minutes. Your site will be live at:

   * `https://<your-username>.github.io/todo-app/`

### Option B — `docs/` folder (keeps root clean)

1. Create a folder named `docs/` and move `index.html` into it.
2. Commit & push: `git add . && git commit -m "move to docs" && git push`.
3. In **Settings → Pages**, set **Branch:** `main`, **Folder:** `/docs`.
4. Open the same URL as above.

### Optional: Custom domain

1. Buy a domain and add a CNAME record pointing to `your-username.github.io`.
2. In **Settings → Pages**, add your domain under **Custom domain**, enable **Enforce HTTPS**.

### Troubleshooting

* If CSS/JS don’t load, use **relative paths** (e.g., `./assets/...`) not absolute `/assets/...`.
* If you renamed `index.html`, Pages won’t find it — keep the name exactly `index.html`.
* Clear cache/Hard refresh if the old version shows.

---

## 👨‍💻 Author

*Developed as a personal project to demonstrate front-end development skills, UI/UX design, and local data persistence.*

If you'd like this README auto‑tailored with your repo URL and username, tell me your **GitHub username** and **repo name**, and I’ll update it here.
