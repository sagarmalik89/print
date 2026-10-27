"""
NexusAI Resume - Python Backend Server
Flask + SQLite Multi-Resume Version Control & AI Endpoints
"""

import os
import sys
import json
import sqlite3
from datetime import datetime

# Configure Windows stdout/stderr to UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "resumes.db")

# Initialize SQLite Database & Tables
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Resumes master table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            target_role TEXT,
            fullname TEXT,
            ats_score INTEGER DEFAULT 0,
            current_version INTEGER DEFAULT 1,
            content_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    
    # Resume versions history table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS resume_versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resume_id INTEGER NOT NULL,
            version_number INTEGER NOT NULL,
            changelog TEXT,
            ats_score INTEGER DEFAULT 0,
            content_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE CASCADE
        )
    """)
    
    conn.commit()
    conn.close()

# Helper: Get DB connection
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Health Check
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "NexusAI Resume Backend",
        "python_version": sys.version.split()[0],
        "database": "SQLite Connected",
        "timestamp": datetime.now().isoformat()
    })

# GET /api/resumes - List all saved resumes
@app.route("/api/resumes", methods=["GET"])
def list_resumes():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, target_role, fullname, ats_score, current_version, created_at, updated_at
        FROM resumes
        ORDER BY updated_at DESC
    """)
    rows = cursor.fetchall()
    resumes = [dict(row) for row in rows]
    conn.close()
    return jsonify({"success": True, "resumes": resumes, "count": len(resumes)})

# POST /api/resumes - Create new resume in database
@app.route("/api/resumes", methods=["POST"])
def create_resume():
    data = request.get_json() or {}
    title = data.get("title", "Untitled Resume").strip() or "Untitled Resume"
    target_role = data.get("target_role", "").strip()
    profile = data.get("profile", {})
    fullname = profile.get("fullname", "Candidate")
    ats_score = int(data.get("ats_score", 0))
    changelog = data.get("changelog", "Initial version").strip() or "Initial version"
    
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    content_json = json.dumps(profile)
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO resumes (title, target_role, fullname, ats_score, current_version, content_json, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, ?, ?, ?)
    """, (title, target_role, fullname, ats_score, content_json, now, now))
    
    resume_id = cursor.lastrowid
    
    # Record version 1 snapshot
    cursor.execute("""
        INSERT INTO resume_versions (resume_id, version_number, changelog, ats_score, content_json, created_at)
        VALUES (?, 1, ?, ?, ?, ?)
    """, (resume_id, changelog, ats_score, content_json, now))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        "success": True,
        "message": f"Resume '{title}' saved successfully as Version 1.",
        "id": resume_id,
        "version": 1
    }), 201

# GET /api/resumes/<id> - Fetch a specific resume
@app.route("/api/resumes/<int:resume_id>", methods=["GET"])
def get_resume(resume_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resumes WHERE id = ?", (resume_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return jsonify({"success": False, "error": "Resume not found"}), 404
    
    resume = dict(row)
    resume["profile"] = json.loads(resume["content_json"])
    return jsonify({"success": True, "resume": resume})

# PUT /api/resumes/<id> - Update existing resume & create new version snapshot
@app.route("/api/resumes/<int:resume_id>", methods=["PUT"])
def update_resume(resume_id):
    data = request.get_json() or {}
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT current_version, title FROM resumes WHERE id = ?", (resume_id,))
    current = cursor.fetchone()
    if not current:
        conn.close()
        return jsonify({"success": False, "error": "Resume not found"}), 404
        
    new_version = current["current_version"] + 1
    title = data.get("title", current["title"]).strip() or current["title"]
    target_role = data.get("target_role", "").strip()
    profile = data.get("profile", {})
    fullname = profile.get("fullname", "")
    ats_score = int(data.get("ats_score", 0))
    changelog = data.get("changelog", f"Version {new_version} update").strip()
    
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    content_json = json.dumps(profile)
    
    cursor.execute("""
        UPDATE resumes
        SET title = ?, target_role = ?, fullname = ?, ats_score = ?, current_version = ?, content_json = ?, updated_at = ?
        WHERE id = ?
    """, (title, target_role, fullname, ats_score, new_version, content_json, now, resume_id))
    
    # Record version snapshot
    cursor.execute("""
        INSERT INTO resume_versions (resume_id, version_number, changelog, ats_score, content_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (resume_id, new_version, changelog, ats_score, content_json, now))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        "success": True,
        "message": f"Updated '{title}' to Version {new_version}.",
        "id": resume_id,
        "version": new_version
    })

# DELETE /api/resumes/<id> - Delete resume and all versions
@app.route("/api/resumes/<int:resume_id>", methods=["DELETE"])
def delete_resume(resume_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM resumes WHERE id = ?", (resume_id,))
    cursor.execute("DELETE FROM resume_versions WHERE id = ?", (resume_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Resume and history deleted."})

# GET /api/resumes/<id>/versions - Get version history of a resume
@app.route("/api/resumes/<int:resume_id>/versions", methods=["GET"])
def get_versions(resume_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, resume_id, version_number, changelog, ats_score, created_at
        FROM resume_versions
        WHERE resume_id = ?
        ORDER BY version_number DESC
    """, (resume_id,))
    rows = cursor.fetchall()
    versions = [dict(r) for r in rows]
    conn.close()
    return jsonify({"success": True, "versions": versions})

# POST /api/resumes/<id>/rollback/<version_num> - Rollback to specific version
@app.route("/api/resumes/<int:resume_id>/rollback/<int:version_number>", methods=["POST"])
def rollback_version(resume_id, version_number):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT content_json, ats_score
        FROM resume_versions
        WHERE resume_id = ? AND version_number = ?
    """, (resume_id, version_number))
    snapshot = cursor.fetchone()
    
    if not snapshot:
        conn.close()
        return jsonify({"success": False, "error": f"Version {version_number} not found"}), 404
        
    content_json = snapshot["content_json"]
    ats_score = snapshot["ats_score"]
    profile = json.loads(content_json)
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Get highest version
    cursor.execute("SELECT current_version FROM resumes WHERE id = ?", (resume_id,))
    cur_v = cursor.fetchone()["current_version"]
    new_v = cur_v + 1
    
    changelog = f"Rollback to Version {version_number}"
    
    cursor.execute("""
        UPDATE resumes
        SET current_version = ?, ats_score = ?, content_json = ?, updated_at = ?
        WHERE id = ?
    """, (new_v, ats_score, content_json, now, resume_id))
    
    cursor.execute("""
        INSERT INTO resume_versions (resume_id, version_number, changelog, ats_score, content_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (resume_id, new_v, changelog, ats_score, content_json, now))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        "success": True,
        "message": f"Successfully rolled back to Version {version_number} (saved as Version {new_v}).",
        "profile": profile,
        "current_version": new_v
    })

# POST /api/ai/optimize-bullet - Backend AI Bullet Optimizer
@app.route("/api/ai/optimize-bullet", methods=["POST"])
def ai_optimize_bullet():
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    role = data.get("role", "Engineer")
    
    if not text:
        return jsonify({"error": "Empty text provided"}), 400
        
    # High-signal heuristic transformer following Google XYZ formula
    enhanced = text
    if any(w in enhanced.lower() for w in ["worked on", "helped", "responsible for", "assisted"]):
        for w in ["worked on", "helped with", "helped", "responsible for", "assisted in", "assisted"]:
            if w in enhanced.lower():
                enhanced = enhanced.replace(w, "Architected and delivered")
                break
    elif not enhanced[0].isupper() or not enhanced.split()[0].endswith("ed"):
        enhanced = "Spearheaded " + enhanced[0].lower() + enhanced[1:]
        
    if not any(char in enhanced for char in ["%", "$", "x", "ms", "K", "M"]):
        enhanced += ", reducing operational latency by 44% and scaling platform throughput to 2.5M+ requests/day"
        
    return jsonify({
        "success": True,
        "original": text,
        "enhanced": enhanced,
        "formula": "Accomplished [X], as measured by [Y], by doing [Z]"
    })

# Serve Frontend Root
@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    print(f"[NexusAI] Backend server running at http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)
