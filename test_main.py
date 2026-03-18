from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_task():
    response = client.post(
        "/tasks/",
        json={"title": "Review Case Files", "description": "Review John Doe's files.", "status": "To Do", "due_date": "2026-12-01T10:00:00"}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Review Case Files"

def test_get_tasks():
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)