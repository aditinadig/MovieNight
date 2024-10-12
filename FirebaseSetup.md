
# Firebase Setup Guide for MovieNight Project

This guide will walk you through the process of setting up Firebase to deploy your MovieNight app using Astro.

## Prerequisites

- Make sure you have the following installed:
  - [Node.js](https://nodejs.org/) (v12 or higher)
  - [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli)

## 1. Initialize Firebase in Your Project

Once you have the Firebase CLI installed, follow these steps:

### Step 1: Login to Firebase
If you haven't logged into Firebase before, use the following command to log into your Firebase account:
```bash
firebase login
```

### Step 2: Initialize Firebase
In the root of your project directory, run:
```bash
firebase init
```

You will be prompted to select Firebase features. Choose **Hosting** and **Firestore**.

### Step 3: Configure Firebase Hosting
- Select `public` as the public directory (where Astro outputs your build files).
- Configure as a **Single Page App** by answering **Yes** when prompted to rewrite all URLs to `/index.html`.

## 2. Build Your Astro Project

Before deploying, you'll need to build the production version of your Astro project. Run the following command:
```bash
npm run build
```

This will generate a production-ready version of your site in the `dist/` folder.

## 3. Deploy to Firebase Hosting

Once the build is complete, deploy your project to Firebase Hosting with:
```bash
firebase deploy
```

This command will publish your site live on the Firebase Hosting URL provided after deployment.

## 4. Optional: Set Up GitHub Actions for Continuous Deployment

If you'd like to automate the deployment process with GitHub Actions, follow these steps:

1. Create a `.github/workflows` directory in your project.
2. Add a workflow file called `firebase-hosting-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting on push

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: \${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: \${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: YOUR_FIREBASE_PROJECT_ID
```

3. Push your changes to GitHub, and GitHub Actions will automatically deploy your site whenever you push to the `main` branch.

## Conclusion

Your Firebase Hosting setup is now complete, and you can deploy updates to your Astro project by running `firebase deploy` or through automated GitHub Actions.

Happy coding!
