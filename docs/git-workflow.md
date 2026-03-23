# Git Workflow for Game Repos

## Conventional Commits

Use structured commit messages so the release tracker can automatically categorize changes.

### Format
```
<type>(<optional scope>): <description>
```

### Types
| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add new merge mechanic for level 5` |
| `fix` | Bug fix | `fix: resolve crash on Android 12 when merging items` |
| `chore` | Maintenance | `chore: update SDK dependencies` |
| `perf` | Performance | `perf: optimize sprite loading for merge animations` |
| `docs` | Documentation | `docs: update README with new build steps` |
| `style` | Code style | `style: fix indentation in GameManager` |
| `refactor` | Refactoring | `refactor: simplify merge logic in BoardController` |
| `test` | Tests | `test: add unit tests for score calculation` |
| `ci` | CI/CD | `ci: update Fastlane config for new signing key` |
| `build` | Build system | `build: update Gradle to 8.x` |

## Release Tags

When ready to release, create an annotated tag:

```bash
# Create tag
git tag -a v1.2.3 -m "Release 1.2.3: New merge mechanics and bug fixes"

# Push tag (this triggers the Make.com webhook)
git push origin v1.2.3
```

### Tag naming convention
- Always prefix with `v`: `v1.2.3`
- Follow semver: `vMAJOR.MINOR.PATCH`
  - MAJOR: Breaking changes or major feature releases
  - MINOR: New features, content updates
  - PATCH: Bug fixes, small improvements

## GitLab Webhook Setup

For each game repository:

1. Go to **Settings → Webhooks** in GitLab
2. **URL**: Your Make.com webhook URL
3. **Trigger events**:
   - ✅ Push events
   - ✅ Tag push events
4. **SSL verification**: Enable
5. Click **Add webhook**

## Workflow Summary

```
Developer commits → Push to GitLab
                       ↓
              GitLab sends webhook to Make.com
                       ↓
              Make.com processes and sends to web app
                       ↓
              Commits stored in database
                       ↓
Developer creates tag (v1.2.3) → Push to GitLab
                       ↓
              Tag webhook triggers → New Release created
              All pending commits assigned to this release
                       ↓
              Release visible in dashboard
```
