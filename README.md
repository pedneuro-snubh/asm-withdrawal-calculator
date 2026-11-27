# ASM Withdrawal Outcome Predictor

Web calculator for the probability of successful antiseizure medication (ASM)
withdrawal in pediatric-onset epilepsy, Seoul National University Bundang Hospital.

Live: https://pedneuro-snubh.github.io/asm-withdrawal-calculator/

All computation runs in the browser. Nothing entered on the page is sent anywhere.

## Models

`src/model/models.json` holds the two fitted elastic-net logistic regression
models (All Epilepsies; Self-Limited Epilepsy Excluded): scaling constants,
category encoding, coefficients and intercepts. `src/model/predict.ts`
evaluates them. It reproduces scikit-learn's `predict_proba` on every
development-cohort row to within 1e-15.

The file contains model parameters only, no patient data.

## Develop

    npm ci
    npm run dev      # local preview
    npm run build    # static site in dist/

Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

*Research tool. It supports, and does not replace, the judgment of a qualified clinician.*
