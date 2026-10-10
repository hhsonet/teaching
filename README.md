# Teaching

Course materials, one folder per course. Site: https://hhsonet.github.io/teaching/

| Course | Folder | Site |
|---|---|---|
| Advanced Artificial Intelligence | [advanced-ai](advanced-ai) | https://hhsonet.github.io/teaching/advanced-ai/ |

## Repository layout

- `advanced-ai/`: Jekyll course site (Just the Docs theme). Pages, lectures and dashboard. See [advanced-ai/README.md](advanced-ai/README.md).
- `site-root/`: landing page (`index.html`, `teaching.css`, `teaching.js`) that lists all courses.
- `.github/workflows/pages.yml`: builds every course and the landing page into one GitHub Pages deployment on each push to `main`.
- `.github/ISSUE_TEMPLATE/`: templates for paper reviews and project proposals.

## Local preview

Course site:

```bash
cd advanced-ai
bundle install
bundle exec jekyll serve
```

Landing page: open `site-root/index.html` in a browser.

## Deployment

Push to `main`. The workflow builds each course with `actions/jekyll-build-pages`, copies `site-root/` into the output, and deploys to GitHub Pages.

## Add a course

1. Create a folder and copy the Jekyll files from `advanced-ai`.
2. Set its `baseurl` to `/teaching/<folder>`.
3. Add a build step in `pages.yml` with `destination: ./_site/<folder>`.
4. Add the course to the list in `site-root/teaching.js`.
