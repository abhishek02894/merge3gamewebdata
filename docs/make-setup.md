# Make.com Setup Guide

## Overview

Make.com (formerly Integromat) is used as middleware to:
1. Receive GitLab webhooks and push commit/tag data to the web app
2. Schedule Apify PlayStore scrapes and push results to the web app

---

## Scenario 1: GitLab → Web App

### Purpose
When developers push code or create release tags in GitLab, Make.com receives the webhook, processes the data, and sends it to the web app.

### Setup Steps

1. **Create a new Scenario** in Make.com

2. **Add Trigger: Webhooks > Custom Webhook**
   - Click "Add" to create a new webhook
   - Copy the webhook URL (you'll need this for GitLab)
   - Name it: `GitLab Push/Tag Events`

3. **Add Module: Router**
   - Route 1: Tag Push events
   - Route 2: Push events

4. **Route 1 - Tag Push (Filter: `object_kind` = `tag_push`)**

   Add HTTP > Make a Request module:
   - URL: `https://your-app.vercel.app/api/webhooks/ingest`
   - Method: POST
   - Headers:
     - `Authorization`: `Bearer YOUR_API_SECRET`
     - `Content-Type`: `application/json`
   - Body (JSON):
     ```json
     {
       "type": "tag_push",
       "gitlabProjectId": {{project_id}},
       "data": {
         "tagName": "{{replace(ref; 'refs/tags/'; '')}}",
         "commits": []
       }
     }
     ```

5. **Route 2 - Push (Filter: `object_kind` = `push`)**

   Add HTTP > Make a Request module:
   - URL: `https://your-app.vercel.app/api/webhooks/ingest`
   - Method: POST
   - Headers: same as above
   - Body (JSON):
     ```json
     {
       "type": "push",
       "gitlabProjectId": {{project_id}},
       "data": {
         "ref": "{{ref}}",
         "commits": [
           // Map the commits array from the webhook payload
           {
             "id": "{{commits[].id}}",
             "message": "{{commits[].message}}",
             "timestamp": "{{commits[].timestamp}}",
             "url": "{{commits[].url}}",
             "author": {
               "name": "{{commits[].author.name}}",
               "email": "{{commits[].author.email}}"
             }
           }
         ]
       }
     }
     ```

6. **Configure GitLab Webhook** (repeat for each game repo)
   - Go to GitLab repo → Settings → Webhooks
   - URL: Paste the Make.com webhook URL from step 2
   - Trigger events: ✅ Push events, ✅ Tag push events
   - Click "Add webhook"

---

## Scenario 2: Scheduled PlayStore Scrape

### Purpose
Every 6 hours, run Apify to scrape PlayStore data for all 3 games and push results to the web app.

### Setup Steps

1. **Create a new Scenario** in Make.com

2. **Add Trigger: Schedule**
   - Run every 6 hours (or your preferred interval)

3. **Add Module: Iterator**
   - Array:
     ```json
     [
       "com.studio.mergehometown",
       "com.studio.talesanddragon",
       "com.studio.wordofwizard"
     ]
     ```
   (Replace with your actual package names)

4. **Add Module: HTTP > Make a Request (Apify)**
   - URL: `https://api.apify.com/v2/acts/YOUR_ACTOR_ID/runs`
   - Method: POST
   - Headers:
     - `Authorization`: `Bearer YOUR_APIFY_TOKEN`
     - `Content-Type`: `application/json`
   - Body:
     ```json
     {
       "startUrls": [
         {
           "url": "https://play.google.com/store/apps/details?id={{iterator.value}}"
         }
       ]
     }
     ```

5. **Add Module: Sleep** - Wait 30 seconds for Apify to complete

6. **Add Module: HTTP > Make a Request (Get Apify Results)**
   - URL: `https://api.apify.com/v2/acts/YOUR_ACTOR_ID/runs/last/dataset/items?token=YOUR_APIFY_TOKEN`
   - Method: GET

7. **Add Module: HTTP > Make a Request (Push to Web App)**
   - URL: `https://your-app.vercel.app/api/webhooks/playstore`
   - Method: POST
   - Headers:
     - `Authorization`: `Bearer YOUR_API_SECRET`
     - `Content-Type`: `application/json`
   - Body: Map the Apify response to match the schema:
     ```json
     {
       "packageName": "{{iterator.value}}",
       "versionName": "{{apify_result.version}}",
       "rolloutStatus": "completed",
       "track": "production",
       "rating": {{apify_result.score}},
       "installs": "{{apify_result.installs}}"
     }
     ```

---

## Environment Variables

Set these in your Vercel deployment:
- `API_SECRET`: The secret key used in Make.com Authorization headers
- `DATABASE_URL`: Your PostgreSQL connection string

## Testing

1. Trigger a test run of Scenario 1 by pushing a commit to one of your GitLab repos
2. Trigger a test run of Scenario 2 manually in Make.com
3. Check the Settings page in the web app to see webhook events
