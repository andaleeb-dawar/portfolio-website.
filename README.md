# Andaleeb Dawar — Portfolio

A static portfolio website built with HTML, CSS, and JavaScript. The site has no build step or package dependencies. The contents of this folder are intended to be the repository root.

## Project layout

- `index.html` — portfolio page
- `style.css`, `script.js`, `contact-form.js` — styles and browser behavior
- `profile.png`, `rest-api-project.png` — profile and project images, stored beside the HTML file
- `cv.pdf` — downloadable CV
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment

## Upload and deploy with GitHub Pages

1. Create a GitHub repository.
2. Upload the **contents** of this `frontend` folder to the repository root. Include the hidden `.github` folder; do not upload this folder as a nested `frontend/` directory.
3. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. The workflow deploys the site on each push to `main`. Find the published URL in the workflow run or under **Settings → Pages**.

If using Git, clone the new repository, copy the contents of this folder (including `.github`) into the clone, then run these commands from the clone folder:

```sh
git add .
git commit -m "Prepare portfolio for GitHub Pages"
git push
```

The contact form is a static Web3Forms integration, so it can run on GitHub Pages without a server. Test it after deployment; local file previews cannot send submissions.
