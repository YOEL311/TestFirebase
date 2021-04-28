const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { user } = require("firebase-functions/lib/providers/auth");
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
  //   admin
  //     .auth()
  //     .setCustomUserClaims("g8hgZCsmETSa9DOEvlzHJqgfAZb2", { admin: true });

  admin
    .auth()
    .getUser("g8hgZCsmETSa9DOEvlzHJqgfAZb2")
    .then((userRecord) => {
      // The claims can be accessed on the user record.
      //   console.log(userRecord);
      //   console.log(userRecord.customClaims["admin"]);
      functions.logger.info(userRecord.customClaims["admin"]);
      functions.logger.info(userRecord);
      functions.logger.info(userRecord.customClaims);
    });
});

exports.getAllUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return { message: "Authentication Required!", code: 401 };
  }
    const uid = context.auth.uid;

  if (!checkUser(uid)) {
    return { message: "have to be admin", code: 401 };  
  }
  users = await getListUsers();
  return { users, code: 200 };
});

const checkUser = (idToken) => {
    return new Promise((resolve) => {
        admin
        .auth()
        .verifyIdToken(idToken)
        .then((claims) => {
            if (claims.admin === true)resolve(true)
            else resolve(false);
        });
    });

const getListUsers = () => {
  return new Promise((resolve, reject) => {
    admin
      .auth()
      .listUsers(1000)
      .then((listUsersResult) => {
        allUsers = [];
        listUsersResult.users.forEach((userRecord) => {
          allUsers.push(userRecord.email);
        });
        functions.logger.info("all users", allUsers);
        resolve(allUsers);
      })
      .catch((error) => {
        console.log("Error listing users:", error);
        reject(error);
      });
  });
};
