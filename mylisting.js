/* Moralis init code */
const serverUrl = "https://pwdgajlkixh3.usemoralis.com:2053/server";
const appId = "Gws8paRYa2auAnWgLoQYCcSbdOpugC3vbGsMdEWW";
Moralis.start({ serverUrl, appId });

// CONTRACT

const TOKEN_CONTRACT_ADDRESS = "0x3213D64dA2a92525E21E45b4a7c31A3AEeD06AA2";
const MARKETPLACE_CONTRACT_ADDRESS = "MARKETPLACE_CONTRACT_ADDRESS";

// Helper function
hideElement = (element) => (element.style.display = "none");
showElement = (element) => (element.style.display = "block");

let user;
let userAddress;

const init = async () => {
  console.log("Initiated in createad page");
  user = Moralis.User.current();
  window.web3 = await Moralis.Web3.enable();
  window.tokenContract = new web3.eth.Contract(
    tokenContractAbi,
    TOKEN_CONTRACT_ADDRESS
  );
  if (user) {
    userAddress = user.get("ethAddress");
    console.log(user, "alredy we have your data in our database");
  } else {
    console.log("NOT LOGGED IN");
    // window.location.replace("/");
    alert("Please Login First");
  }
};

initTemplate = (id) => {
  const template = document.getElementById(id);
  template.id = "";
  template.parentNode.removeChild(template);
  return template;
};

// Function used to get the image url from the data comes from moralis
getAndRenderItemData = (item, renderFunction) => {
  fetch(item.tokenUri)
    .then((response) => response.json())
    .then((data) => {
      item.name = data.name;
      item.description = data.description;
      item.image = data.image;
      renderFunction(item);
    });
};

// function used to render the users items
renderUserItem = async (item) => {
  const userItemListing = document.getElementById(
    `user-item-${item.tokenObjectId}`
  );
  if (userItemListing) return;

  const userItem = userItemTemplate.cloneNode(true);
  userItem.getElementsByTagName("img")[0].src = item.image;
  userItem.getElementsByTagName("a")[0].href = item.image;
  userItem.getElementsByTagName("img")[0].alt = item.name;
  userItem.id = `user-item-${item.tokenObjectId}`;

  userItems.appendChild(userItem);
};

loadUserItems = async () => {
  const ownedItems = await Moralis.Cloud.run("getUserItems");
  ownedItems.forEach((item) => {
    const userItemListing = document.getElementById(
      `user-item-${item.tokenObjectId}`
    );
    if (userItemListing) return;
    getAndRenderItemData(item, renderUserItem);
  });
};

init();

const userItemTemplate = initTemplate("itemTemplate");
const userItems = document.getElementById("userItemsList");

loadUserItems();
