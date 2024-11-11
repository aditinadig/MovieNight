// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Cloud Function to list users
exports.listUsers = functions.https.onRequest(async (req, res) => {
  try {
    const users = [];
    let nextPageToken;
    // Fetch users in batches of 1000
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      listUsersResult.users.forEach((userRecord) => {
        users.push(userRecord.email);
      });
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
