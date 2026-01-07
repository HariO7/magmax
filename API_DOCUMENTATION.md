# API Documentation

This document describes the REST API endpoints for the Article Management System.

## Base URL

```
http://localhost:8000/api
```

**Note**: In production, replace `localhost:8000` with your actual domain.

---

## Authentication

Currently, the API uses `AllowAny` permissions, meaning no authentication is required. However, if a user is authenticated, the API will automatically set the article author to the authenticated user when creating articles.

---

## Response Format

All API responses are in JSON format. The API uses pagination for list endpoints.

### Pagination Response Format

List endpoints return paginated results with the following structure:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/articles/?page=2",
  "previous": null,
  "results": [
    // Array of article objects
  ]
}
```

### Error Response Format

Error responses follow this structure:

```json
{
  "field_name": ["Error message for this field"],
  "non_field_errors": ["General error messages"]
}
```

---

## Endpoints

### 1. Health Check

Check if the API is running and accessible.

**Endpoint:** `GET /api/health/`

**Description:** Returns the health status of the API.

**Request:** No parameters required.

**Response:**
```json
{
  "status": "ok"
}
```

**Example Request:**
```bash
curl http://localhost:8000/api/health/
```

**Example Response:**
```json
{
  "status": "ok"
}
```

---

### 2. List Articles

Retrieve a paginated list of articles with optional filtering and searching.

**Endpoint:** `GET /api/articles/`

**Description:** Returns a paginated list of articles. Supports filtering, searching, and ordering.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number for pagination (default: 1) | `?page=2` |
| `published` | boolean | Filter by published status | `?published=true` |
| `author` | integer | Filter by author ID | `?author=1` |
| `author_username` | string | Filter by author username (partial match, case-insensitive) | `?author_username=john` |
| `tag` | string | Filter by tag name | `?tag=django` |
| `publish_date_from` | datetime | Filter articles published from this date (ISO 8601 format) | `?publish_date_from=2024-01-01T00:00:00Z` |
| `publish_date_to` | datetime | Filter articles published until this date (ISO 8601 format) | `?publish_date_to=2024-12-31T23:59:59Z` |
| `search` | string | Search in title, body, and author username | `?search=django` |
| `ordering` | string | Order results. Prefix with `-` for descending | `?ordering=-publish_date` or `?ordering=title` |

**Available Ordering Fields:**
- `publish_date` (default, descending)
- `created_at`
- `title`

**Response:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/articles/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Getting Started with Django",
      "body": "Django is a high-level Python web framework...",
      "image": null,
      "imageUrl": "https://example.com/image.jpg",
      "author": 1,
      "author_username": "john_doe",
      "publish_date": "2024-01-15T10:30:00Z",
      "published": true,
      "tags": ["django", "python", "web"],
      "created_at": "2024-01-10T08:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Example Requests:**
```bash
# Get all articles
curl http://localhost:8000/api/articles/

# Get published articles only
curl http://localhost:8000/api/articles/?published=true

# Search for articles
curl http://localhost:8000/api/articles/?search=django

# Filter by tag
curl http://localhost:8000/api/articles/?tag=python

# Filter by author
curl http://localhost:8000/api/articles/?author=1

# Filter by date range
curl "http://localhost:8000/api/articles/?publish_date_from=2024-01-01T00:00:00Z&publish_date_to=2024-12-31T23:59:59Z"

# Combine filters
curl "http://localhost:8000/api/articles/?published=true&tag=django&ordering=-publish_date"
```

---

### 3. Get Single Article

Retrieve a specific article by its ID.

**Endpoint:** `GET /api/articles/{id}/`

**Description:** Returns a single article with the specified ID.

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Article ID (required) |

**Response:**
```json
{
  "id": 1,
  "title": "Getting Started with Django",
  "body": "Django is a high-level Python web framework...",
  "image": null,
  "imageUrl": "https://example.com/image.jpg",
  "author": 1,
  "author_username": "john_doe",
  "publish_date": "2024-01-15T10:30:00Z",
  "published": true,
  "tags": ["django", "python", "web"],
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Example Request:**
```bash
curl http://localhost:8000/api/articles/1/
```

**Error Responses:**

- **404 Not Found**: Article with the specified ID does not exist
```json
{
  "detail": "Not found."
}
```

---

### 4. Create Article

Create a new article.

**Endpoint:** `POST /api/articles/`

**Description:** Creates a new article. If the user is authenticated, the author is automatically set to the authenticated user. Otherwise, the author must be provided in the request body.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Article title (cannot be empty) |
| `body` | string | Yes | Article content (cannot be empty) |
| `image` | file | No | Image file to upload |
| `imageUrl` | string (URL) | No | External image URL (must start with http:// or https://) |
| `author` | integer | Conditional | Author user ID (required if not authenticated) |
| `publish_date` | datetime | No | Publication date (ISO 8601 format, defaults to current time) |
| `published` | boolean | No | Whether the article is published (default: false) |
| `tags` | array of strings | No | List of tags (default: empty array) |

**Request Body Example:**
```json
{
  "title": "New Article Title",
  "body": "This is the article content...",
  "imageUrl": "https://example.com/image.jpg",
  "author": 1,
  "published": true,
  "tags": ["django", "tutorial"],
  "publish_date": "2024-01-20T12:00:00Z"
}
```

**Response:**
```json
{
  "id": 2,
  "title": "New Article Title",
  "body": "This is the article content...",
  "image": null,
  "imageUrl": "https://example.com/image.jpg",
  "author": 1,
  "author_username": "john_doe",
  "publish_date": "2024-01-20T12:00:00Z",
  "published": true,
  "tags": ["django", "tutorial"],
  "created_at": "2024-01-18T10:00:00Z",
  "updated_at": "2024-01-18T10:00:00Z"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/articles/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Article Title",
    "body": "This is the article content...",
    "imageUrl": "https://example.com/image.jpg",
    "author": 1,
    "published": true,
    "tags": ["django", "tutorial"]
  }'
```

**Error Responses:**

- **400 Bad Request**: Validation errors
```json
{
  "title": ["Title cannot be empty."],
  "body": ["Body cannot be empty."],
  "imageUrl": ["Image URL must start with http:// or https://"],
  "tags": ["Tags must be a list."]
}
```

---

### 5. Update Article (Full Update)

Update an entire article using PUT method.

**Endpoint:** `PUT /api/articles/{id}/`

**Description:** Performs a full update of the article. All fields must be provided (except read-only fields).

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Article ID (required) |

**Request Body:**

Same as Create Article, but all fields are optional (except those that are required for the model).

**Request Body Example:**
```json
{
  "title": "Updated Article Title",
  "body": "Updated article content...",
  "imageUrl": "https://example.com/new-image.jpg",
  "author": 1,
  "published": false,
  "tags": ["updated", "tags"],
  "publish_date": "2024-01-25T15:00:00Z"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Article Title",
  "body": "Updated article content...",
  "image": null,
  "imageUrl": "https://example.com/new-image.jpg",
  "author": 1,
  "author_username": "john_doe",
  "publish_date": "2024-01-25T15:00:00Z",
  "published": false,
  "tags": ["updated", "tags"],
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-01-18T14:30:00Z"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:8000/api/articles/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Article Title",
    "body": "Updated article content...",
    "imageUrl": "https://example.com/new-image.jpg",
    "author": 1,
    "published": false,
    "tags": ["updated", "tags"]
  }'
```

**Error Responses:**

- **404 Not Found**: Article with the specified ID does not exist
- **400 Bad Request**: Validation errors (same format as Create Article)

---

### 6. Update Article (Partial Update)

Partially update an article using PATCH method.

**Endpoint:** `PATCH /api/articles/{id}/`

**Description:** Performs a partial update of the article. Only provided fields will be updated.

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Article ID (required) |

**Request Body:**

Any subset of the article fields. Only include the fields you want to update.

**Request Body Example:**
```json
{
  "published": true,
  "tags": ["new", "tag"]
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Getting Started with Django",
  "body": "Django is a high-level Python web framework...",
  "image": null,
  "imageUrl": "https://example.com/image.jpg",
  "author": 1,
  "author_username": "john_doe",
  "publish_date": "2024-01-15T10:30:00Z",
  "published": true,
  "tags": ["new", "tag"],
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-01-18T14:30:00Z"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:8000/api/articles/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "published": true,
    "tags": ["new", "tag"]
  }'
```

**Error Responses:**

- **404 Not Found**: Article with the specified ID does not exist
- **400 Bad Request**: Validation errors (same format as Create Article)

---

### 7. Delete Article

Delete an article.

**Endpoint:** `DELETE /api/articles/{id}/`

**Description:** Deletes the article with the specified ID.

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Article ID (required) |

**Response:**
```json
{
  "message": "Article 'Article Title' (ID: 1) has been deleted successfully."
}
```

**Example Request:**
```bash
curl -X DELETE http://localhost:8000/api/articles/1/
```

**Error Responses:**

- **404 Not Found**: Article with the specified ID does not exist
```json
{
  "detail": "Not found."
}
```

---

## Data Models

### Article Object

| Field | Type | Description | Read-only |
|-------|------|-------------|-----------|
| `id` | integer | Unique identifier for the article | Yes |
| `title` | string | Article title | No |
| `body` | string | Article content/body | No |
| `image` | string (URL) or null | URL to uploaded image file | No |
| `imageUrl` | string (URL) or null | External image URL | No |
| `author` | integer | ID of the author (User ID) | No |
| `author_username` | string | Username of the author | Yes |
| `publish_date` | datetime (ISO 8601) | Date and time when the article was/will be published | No |
| `published` | boolean | Whether the article is published | No |
| `tags` | array of strings | List of tags associated with the article | No |
| `created_at` | datetime (ISO 8601) | Timestamp when the article was created | Yes |
| `updated_at` | datetime (ISO 8601) | Timestamp when the article was last updated | Yes |

### Example Article Object

```json
{
  "id": 1,
  "title": "Getting Started with Django",
  "body": "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design...",
  "image": null,
  "imageUrl": "https://example.com/django-logo.jpg",
  "author": 1,
  "author_username": "john_doe",
  "publish_date": "2024-01-15T10:30:00Z",
  "published": true,
  "tags": ["django", "python", "web", "framework"],
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## Validation Rules

### Title
- Cannot be empty or whitespace-only
- Automatically trimmed of leading/trailing whitespace

### Body
- Cannot be empty or whitespace-only
- Automatically trimmed of leading/trailing whitespace

### ImageUrl
- Must be a valid URL
- Must start with `http://` or `https://`
- Can be null or empty

### Tags
- Must be an array
- Each tag must be a string
- Empty tags are automatically removed
- Tags are automatically trimmed of whitespace

### Author
- Must be a valid user ID (integer)
- Required when creating an article if the user is not authenticated
- Automatically set to the authenticated user if the user is logged in

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200 OK` | Request successful |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid request data or validation errors |
| `404 Not Found` | Resource not found |
| `500 Internal Server Error` | Server error |

---

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse.

---

## CORS Configuration

The API is configured to allow requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

In development mode (`DEBUG=True`), all origins are allowed. In production, update `CORS_ALLOWED_ORIGINS` in `backend/backend/settings.py`.

---

## Example Usage

### JavaScript/TypeScript (Fetch API)

```javascript
// Get all published articles
const response = await fetch('http://localhost:8000/api/articles/?published=true');
const data = await response.json();
console.log(data.results);

// Create a new article
const newArticle = await fetch('http://localhost:8000/api/articles/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My New Article',
    body: 'Article content here...',
    author: 1,
    published: true,
    tags: ['javascript', 'api']
  })
});
const article = await newArticle.json();
console.log(article);

// Update an article
const updated = await fetch('http://localhost:8000/api/articles/1/', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    published: true
  })
});
const result = await updated.json();
console.log(result);

// Delete an article
await fetch('http://localhost:8000/api/articles/1/', {
  method: 'DELETE'
});
```

### Python (requests library)

```python
import requests

BASE_URL = 'http://localhost:8000/api'

# Get all articles
response = requests.get(f'{BASE_URL}/articles/')
articles = response.json()
print(articles['results'])

# Create a new article
new_article = {
    'title': 'My New Article',
    'body': 'Article content here...',
    'author': 1,
    'published': True,
    'tags': ['python', 'django']
}
response = requests.post(f'{BASE_URL}/articles/', json=new_article)
article = response.json()
print(article)

# Update an article
update_data = {'published': True}
response = requests.patch(f'{BASE_URL}/articles/1/', json=update_data)
result = response.json()
print(result)

# Delete an article
response = requests.delete(f'{BASE_URL}/articles/1/')
print(response.json())
```

---

## Notes

1. **Pagination**: The default page size is 20 articles per page (configurable in `REST_FRAMEWORK` settings).

2. **Default Ordering**: Articles are ordered by `publish_date` in descending order (newest first) by default.

3. **Image Upload**: To upload an image file, use `multipart/form-data` instead of `application/json`:
   ```bash
   curl -X POST http://localhost:8000/api/articles/ \
     -F "title=My Article" \
     -F "body=Content here" \
     -F "author=1" \
     -F "image=@/path/to/image.jpg"
   ```

4. **Date Format**: All datetime fields use ISO 8601 format (e.g., `2024-01-15T10:30:00Z`).

5. **Search**: The search parameter searches across `title`, `body`, and `author__username` fields.

---

## Support

For issues or questions about the API, please refer to:
- Django REST Framework documentation: https://www.django-rest-framework.org/
- Project README: `README.md`

