# Apify Setup Guide

## Overview

Apify is used to scrape Google PlayStore pages for your games to get:
- Current version name and version code
- Rating and review counts
- Install counts
- Last updated date

## Setup Steps

### 1. Create an Apify Account
- Go to [apify.com](https://apify.com) and sign up
- Free tier includes 100 actor runs/month (plenty for 3 games every 6 hours)

### 2. Choose a PlayStore Scraper Actor

Recommended: **Google Play Scraper** by Apify team
- Search for "Google Play Scraper" in the Apify Store
- Or use actor ID: `nFJndFXA5OrgE2BQCE` (verify this is current)

### 3. Get Your API Token
- Go to Settings → Integrations → API
- Copy your API token
- You'll use this in Make.com

### 4. Test the Actor

Run it manually first with this input:
```json
{
  "startUrls": [
    { "url": "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME" }
  ],
  "maxItems": 1
}
```

### 5. Expected Output Format

The actor returns data like:
```json
{
  "appId": "com.studio.mergehometown",
  "title": "Merge Home Town",
  "version": "1.2.3",
  "score": 4.5,
  "ratings": 12345,
  "reviews": 678,
  "installs": "1,000,000+",
  "updated": "March 15, 2026",
  "developer": "Your Studio",
  "genre": "Puzzle",
  "price": "Free"
}
```

### 6. Map to Web App Schema

In Make.com, transform the Apify output to match our API:
```json
{
  "packageName": "{{appId}}",
  "versionName": "{{version}}",
  "rolloutStatus": "completed",
  "track": "production",
  "rating": {{score}},
  "installs": "{{installs}}",
  "updated": "{{updated}}"
}
```

## Cost

- Free tier: ~100 runs/month
- 3 games × 4 runs/day = ~360 runs/month
- Paid plan (starting $49/month) covers this easily
- Alternative: Reduce frequency to every 12 hours (180 runs/month)

## Troubleshooting

- If scraping fails, the PlayStore page structure may have changed. Check Apify actor logs.
- Some fields (like exact version code) may not be available via scraping. These will be populated when available.
