# MovieNight App Setup Guide

This guide will help you set up the **MovieNight** app, which uses **Astro** for the frontend and **Firebase** for the backend (data storage and hosting).
The app uses a centralized Firebase database, so you don't need to set up your own Firebase instance. All data is stored in the project's central Firebase database.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v12 or higher)
- A code editor like [VSCode](https://code.visualstudio.com/)

## 1. Clone the Repository

First, clone this repository to your local machine:
```bash
git clone https://github.com/your-username/MovieNight.git
cd MovieNight
```

## 2. Install Dependencies

Navigate into the project directory and install the required dependencies using npm:
```bash
npm install
```

This will install all the necessary dependencies for **Astro** and Firebase.

## 3. Firebase Setup (Already Configured)

This app is connected to a **central Firebase database**. You don't need to set up your own Firebase instance.

### Firebase Configuration

The app already includes the Firebase credentials for connecting to the central database. You do not need to modify or set up Firebase locally

## 4. Run the App Locally

To run the app in development mode, use the following command:
```bash
npm run dev
```

This will start the development server.

## 5. Build the App for Production

To prepare the app for deployment, run:
```bash
npm run build
```

This command will build the app and place the output files in the `dist/` directory.

## 6. Deploy to Firebase Hosting (For Project Maintainers Only)

The app is deployed using Firebase Hosting. If you need to deploy a new version of the app, use the following command:
```bash
firebase deploy
```

This command will deploy the production build (in `dist/`) to Firebase Hosting, and the app will be accessible via the Firebase Hosting URL.

## Conclusion

Now you’re all set! You can run the **MovieNight** app locally and interact with the central Firebase database. No additional Firebase setup is needed for users.

Enjoy using the MovieNight app! If you have any questions or run into issues, feel free to open an issue on GitHub.
