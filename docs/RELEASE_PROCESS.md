# Release Process - v0.2.0

## Pre-Release Checklist

1. ✅ All tests pass (`npm run test && npm run test:e2e`)
2. ✅ Code committed to your release branch
3. ✅ Documentation updated (README, CHANGELOG, BETA_CHECKLIST)
4. ✅ Version bumped in `package.json` to `0.2.0`

## Step-by-Step Release

### 1. Push Feature Branch

```bash
git push origin <your-release-branch>
```

### 2. Create Pull Request

- Go to GitHub: https://github.com/APerlinx/svg-saas-client
- Click "Pull requests" → "New pull request"
- Base: `main` ← Compare: `<your-release-branch>`
- Title: `Release v0.2.0 - BullMQ Integration & Progress UX`
- Description: Paste changelog from `CHANGELOG.md`
- Create PR and wait for CI checks to pass

### 3. Merge to Main

Once CI is green:

- Review changes one final time
- Click "Squash and merge" or "Merge pull request"
- Delete feature branch after merge

### 4. Tag the Release

```bash
# Switch to main and pull latest
git checkout main
git pull origin main

# Create annotated tag with message
git tag -a v0.2.0 -m "Release v0.2.0 - Async jobs with real-time progress UI"

# Push tag to remote
git push origin v0.2.0
```

### 5. Create GitHub Release

1. Go to: https://github.com/APerlinx/svg-saas-client/releases/new
2. Click "Choose a tag" → Select `v0.2.0`
3. Release title: `v0.2.0 - Async Job Processing & Progress UX`
4. Description: Copy from `CHANGELOG.md` (v0.2.0 section)
5. Check "Set as the latest release"
6. Click "Publish release"

### 6. Verify Deployment

**Vercel (Frontend):**

- Vercel will auto-deploy `main` branch
- Check: https://vercel.com/your-project/deployments
- Verify: https://your-app.vercel.app

**Smoke Test:**

1. Visit production URL
2. Sign in with test account
3. Generate an SVG
4. Verify progress modal shows
5. Check credits update without refresh
6. Try double-clicking Generate (should not create duplicates)

### 7. Monitor Production

**First 24 Hours:**

- Check Sentry for errors: https://sentry.io
- Monitor backend logs on Render
- Watch for 429 rate limit issues
- Check job queue metrics (if dashboard available)

**Success Criteria:**

- Zero Sentry errors related to job updates/progress
- Credits update correctly in 100% of cases
- No duplicate jobs created
- Modal UX feels responsive and polished

## Rollback Plan (If Issues Found)

### Quick Rollback

```bash
# Revert main to previous version
git checkout main
git reset --hard v0.1.0
git push origin main --force

# Vercel will auto-deploy previous version
```

### Tag Rollback Release

```bash
git tag -a v0.2.1-hotfix -m "Hotfix: Rollback to v0.1.0 due to [issue]"
git push origin v0.2.1-hotfix
```

## Post-Release

- [ ] Update project board/issues
- [ ] Announce release in team chat
- [ ] Document any production issues in GitHub Issues
- [ ] Plan v0.3.0 features based on feedback

---

**Questions?** Open an issue or contact [@APerlinx](https://github.com/APerlinx)
