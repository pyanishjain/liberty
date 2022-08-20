/* Moralis init code */
const serverUrl = "https://b2hwqtcxqsnp.usemoralis.com:2053/server";
const appId = "bKviMbcIE6zW2V88ImA4PIuMeLHknEfun1ZpJjrB";
Moralis.start({ serverUrl, appId });

// Helper function
hideElement = (element) => (element.style.display = "none");
showElement = (element) => (element.style.display = "block");

// get the navigation bar and logout button
const navbar = document.getElementById("nav");
const logoutBtn = document.getElementById("btn-logout");

// call when page loads to check wheather user is logged in or not

const init = () => {
  console.log("Initiated");
  let user = Moralis.User.current();
  if (user) {
    console.log(user, "alredy we have your data in our database");
    document.getElementById("root").innerHTML =
      "Logged in as " + user.get("ethAddress");
    // showElement(navbar);
    showElement(logoutBtn);
  } else {
    console.log("NOT LOGGED IN");
    // hideElement(navbar);
    hideElement(logoutBtn);
  }
};

/* Authentication code */
async function login() {
  let user = Moralis.User.current();
  console.log("USER IS HERE", user);
  if (!user) {
    user = await Moralis.authenticate({
      signingMessage: "Log in using Moralis",
    }).then(function (user) {
      console.log("logged in user:", user);
      console.log(user.get("ethAddress"));
      document.getElementById("root").innerHTML =
        "Logged in as " + user.get("ethAddress");
    });
    showElement(logoutBtn);
  }
}

async function logOut() {
  await Moralis.User.logOut();
  window.location.reload();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
logoutBtn.onclick = logOut;

init();
