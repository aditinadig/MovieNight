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



## Additional Setup and Installations

This guide will walk you through all the necessary installations apart from Astro and Firebase for the MovieNight app.

### Prerequisites

Ensure you've set up Astro and Firebase according to the main setup instructions. Below are additional tools, libraries, and dependencies required for the project.

### 1. Material-UI (MUI)

Material-UI is used for component styling throughout the app.

#### Installation:
```bash
npm install @mui/material @mui/system @emotion/react @emotion/styled
```

#### Icons (Optional):
To add Material-UI icons to your project:
```bash
npm install @mui/icons-material
```


### 2. Axios (For API Calls)

We use Axios to handle API requests to external services, such as TMDB.

#### Installation:
```bash
npm install axios
```

### 3. ESLint (For Linting)

ESLint is used for ensuring code quality and enforcing consistent coding styles.

#### Installation:
```bash
npm install eslint --save-dev
```

#### Initialize ESLint:
```bash
npx eslint --init
```

### 4. Prettier (For Code Formatting)

Prettier is used to automatically format code to keep it clean and consistent.

#### Installation:
```bash
npm install --save-dev prettier
```

#### Configuration:
Create a `.prettierrc` file with the following configuration:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### 5. Vite (For Faster Builds)

Vite is used as the build tool in Astro for faster development.

#### Installation:
```bash
npm install vite
```

### 6. Firebase Tools (For Firebase CLI)

Install Firebase CLI tools if you haven't already, for managing Firebase from the command line.

#### Installation:
```bash
npm install -g firebase-tools
```

To initialize Firebase:
```bash
firebase init
```

### 7. Emotion (For CSS-in-JS with MUI)

Material-UI uses Emotion for styling, so ensure you have Emotion installed.

#### Installation:
```bash
npm install @emotion/react @emotion/styled
```

### Running the Project

After installing all dependencies, run the following command to start the development server:

```bash
npm run dev
```

## Conclusion

Now you’re all set! You can run the **MovieNight** app locally and interact with the central Firebase database. No additional Firebase setup is needed for users.

Enjoy using the MovieNight app! If you have any questions or run into issues, feel free to open an issue on GitHub.




