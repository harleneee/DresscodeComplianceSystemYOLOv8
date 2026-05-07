# Google Cloud Technologies 2026 - 1-Day Conference

A dynamic, single-page web application built to serve as an informational schedule for a 1-day technical conference focusing on Google Cloud Technologies.

## Features
- **Responsive UI:** A premium, dark-themed responsive design featuring Google Cloud's signature colors.
- **Dynamic Content:** Loads talks and schedule data from a backend REST API.
- **Real-time Search:** Effortlessly filter the schedule by talk title, category, or speaker's name.
- **Micro-animations:** Smooth hover effects and transitions for an optimal user experience.

## Tech Stack
- **Backend:** Python + Flask Framework
- **Frontend:** HTML5, modern CSS3 (Variables, Grid, Flexbox), Vanilla JavaScript (ES6+)

---

## Getting Started

### Prerequisites
- Python 3.8+ 

### Installation

1. **Clone or Download the Repository:**
   Ensure you have all the files (`app.py`, `requirements.txt`, `templates/index.html`, `static/style.css`, `static/script.js`).

2. **Create a Virtual Environment (Optional but Recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment:**
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. From the root directory (where `app.py` is located), execute the following command:
   ```bash
   python app.py
   ```
2. The server will start on port `5000`. Open your web browser and navigate to:
   [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## Project Structure
```
/
├── app.py                  # Main Flask application and server logic
├── requirements.txt        # Python dependencies (Flask)
├── README.md               # Project documentation
├── templates/
│   └── index.html          # Main application UI structure
└── static/
    ├── style.css           # Premium styling and design system
    └── script.js           # Frontend logic (Search, Fetching Data, DOM manipulation)
```

## Making Changes
- **Modifying the Schedule Data:** Open `app.py` and modify the `talks` or `speakers` dictionary data structures. The UI will automatically reflect the changes when you refresh the page.
- **Changing Styles/Colors:** The `static/style.css` file uses native CSS variables at the top of the file under `:root`. By changing `--g-blue`, `--g-red`, `--bg-base`, etc., you can easily rebrand the entire application.
- **Modifying Search Logic:** Check the `app.route("/api/schedule")` endpoint inside `app.py` for backend filtering. Frontend debouncing is handled within `static/script.js`.
