/* Moralis init code */
const serverUrl = "https://b2hwqtcxqsnp.usemoralis.com:2053/server";
const appId = "bKviMbcIE6zW2V88ImA4PIuMeLHknEfun1ZpJjrB";
Moralis.start({ serverUrl, appId });

// CONTRACT

const TOKEN_CONTRACT_ADDRESS = "0x3213D64dA2a92525E21E45b4a7c31A3AEeD06AA2";
const MARKETPLACE_CONTRACT_ADDRESS = "MARKETPLACE_CONTRACT_ADDRESS";

// Helper function
hideElement = (element) => (element.style.display = "none");
showElement = (element) => (element.style.display = "block");

const msg = document.getElementById("msg");
hideElement(msg);

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
    // window.location.replace("learnzy");
    alert("Please Login First");
  }
};

// Create Item

const btnCreateItem = document.getElementById("btnCreateItem");

createItem = async () => {
  console.log("BTN CLICKED FOR CREATING NFT");

  if (createItemFile.files.length == 0) {
    alert("Please select a file!");
    return;
  }
  //   else if (createItemNameField.value.length == 0) {
  //     alert("Please give the item a name!");
  //     return;
  //   }

  hideElement(createItemBtn);
  showElement(spinner);

  const nftFile = new Moralis.File("nftFile.jpg", createItemFile.files[0]);

  console.log("NFT FILE::::::::::::::::", nftFile);

  const cid = await nftDotStorage(createItemFile.files[0]);

  console.log("HERE IS MY RETURNED CID >>>>>>>>>>>>>>>..", cid);

  await nftFile.saveIPFS();

  const nftFilePath = nftFile.ipfs();

  console.log("IPFS PATH HERE???????????", nftFilePath);

  const metadata = {
    name: createItemNameField.value,
    description: createItemDescriptionField.value,
    image: "https://ipfs.io/ipfs/" + cid,
  };

  const nftFileMetadataFile = new Moralis.File("metadata.json", {
    base64: btoa(JSON.stringify(metadata)),
  });
  await nftFileMetadataFile.saveIPFS();

  const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();

  console.log("SAVED WITH IPFS AND MORALIS>>>>>>>>>>", nftFileMetadataFilePath);

  const nftId = await mintNft(nftFileMetadataFilePath);

  console.log("HI NFTS WITH THIS ID>>>>>>>", nftId);

  switch (createItemStatusField.value) {
    case "0":
      hideElement(spinner);
      showElement(createItemBtn);
      showElement(msg);
      return;
    case "1":
      await ensureMarketplaceIsApproved(nftId, TOKEN_CONTRACT_ADDRESS);
      await marketplaceContract.methods
        .addItemToMarket(
          nftId,
          TOKEN_CONTRACT_ADDRESS,
          createItemPriceField.value
        )
        .send({ from: userAddress });
      hideElement(spinner);
      showElement(createItemBtn);
      showElement(msg);
      break;
    case "2":
      hideElement(spinner);
      showElement(createItemBtn);
      showElement(msg);
      alert("Not yet supported!");
      return;
  }

  hideElement(spinner);
  showElement(createItemBtn);
};

// Mint NFT
mintNft = async (metadataUrl) => {
  const receipt = await tokenContract.methods
    .createItem(metadataUrl)
    // .send({ from: ethereum.selectedAddress });
    .send({ from: userAddress });

  console.log(userAddress, "USER ADDRESS@@@@@@@@@@@@@@@@@@@@@@");
  console.log(ethereum.selectedAddress, ">>>>>>>>>>");
  console.log("THIS IS THE RECIPT", receipt);
  return receipt.events.Transfer.returnValues.tokenId;
};

ensureMarketplaceIsApproved = async (tokenId, tokenAddress) => {
  user = await Moralis.User.current();
  const userAddress = user.get("ethAddress");
  const contract = new web3.eth.Contract(tokenContractAbi, tokenAddress);
  const approvedAddress = await contract.methods
    .getApproved(tokenId)
    .call({ from: userAddress });
  if (approvedAddress != MARKETPLACE_CONTRACT_ADDRESS) {
    await contract.methods
      .approve(MARKETPLACE_CONTRACT_ADDRESS, tokenId)
      .send({ from: userAddress });
  }
};

const createItemFile = document.getElementById("fileCreateItemFile");
const createItemNameField = document.getElementById("txtCreateItemName");
const createItemDescriptionField = document.getElementById(
  "txtCreateItemDescription"
);
const createItemBtn = document.getElementById("btnCreateItem");
const spinner = document.getElementById("spinner");
hideElement(spinner);
createItemBtn.onclick = createItem;
const createItemStatusField = document.getElementById("selectCreateItemStatus");

init();
// window.location.reload();

const nftDotStorage = async (img) => {
  console.log("CALLED  NFT STORAGE...............");
  console.log("IMG", img);
  try {
    const res = await fetch("https://api.nft.storage/upload", {
      body: img,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY5YjA3NWQ1OWRGRGNhMjJBMDNEZDMyMmZFNDZjYjg1ZkYwY0I0NmMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MDMwMDk2ODA2MCwibmFtZSI6Ik1JTlRFUiJ9.pwZFcGfgSSVO7pjnRW31fShXABCsIzYz1GVYmeRm9W8",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const data = await res.json();
    console.log("RES", data);
    const c = data.value.cid;
    console.log("CID LLLLLLLLLLLLLLLLLLL", c);
    return c;
  } catch (err) {
    console.log(err, "BIG ERRROR");
    return;
  }
  // .then((res) => {
  //   console.log(res);
  //   return res.json();
  // })
  // .then((data) => {
  //   console.log(data);
  //   console.log("CID>>>>>>>>>",data.value.cid)
  //   return data.value.cid
  // }).catch((err)=>{
  //   console.log("ERROR with NFT.storage",err)
  // })
};
