import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getFirestore, addDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const state = {
  pages: {
    content: document.querySelector(".content-page"),
    login: document.querySelector(".login-page"),
    edit: document.querySelector(".edit-page"),
    detail: document.querySelector(".detail-page"),
  },
  login: {
    user: document.querySelector(".user"),
    password: document.querySelector(".password"),
  },
  edit:{
    name: document.querySelector("#item-name"),
    description: document.querySelector("#item-description"),
    category: document.querySelector("#item-category"),
    weight: document.querySelector("#item-weight"),
    width: document.querySelector("#item-width"),
    height: document.querySelector("#item-height"),
    length: document.querySelector("#item-length"),
    detail: document.querySelector(".item-detail"),
  },
  detail: {
    name: document.querySelector("#detail-name"),
    description: document.querySelector("#detail-description"),
    category: document.querySelector("#detail-category"),
    weight: document.querySelector("#detail-weight"),
    width: document.querySelector("#detail-width"),
    height: document.querySelector("#detail-height"),
    length: document.querySelector("#detail-length"),
    detail: document.querySelector("#detail-detail"),
  },
  values: {
    itemsList: null,
    isLogged: false,
    uploadedImage: [],
  },
  actions: {
    login: document.querySelector(".login"),
    dropArea: document.querySelector("#drop-area"),
    image: document.querySelector("#item-image"),
    saveItem: document.querySelector("#save-item"),
    editItem: document.querySelector("#edit-item"),
    back: document.querySelector(".back"),
    clean: document.querySelector(".clean-item"),
    closeDetail: document.querySelector(".close-detail"),
    closeLogin: document.querySelector(".close-login"),
  },
}
const firebaseConfig = {
  apiKey: "AIzaSyAYgx5j6ltZkbF2wvLMIu7uIV_Levk0z6s",
  authDomain: "parts-catalog-ae03d.firebaseapp.com",
  projectId: "parts-catalog-ae03d",
  storageBucket: "parts-catalog-ae03d.appspot.com",
  messagingSenderId: "443141760317",
  appId: "1:443141760317:web:33054c5eb0c1b3e9a59154",
}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const COLL = "Parts"

async function fetchData() {
  try{
    const collectionRef = collection(db, COLL);
    const snapshot = await getDocs(collectionRef);
    const dataFromFirestore = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    state.values.itemsList = dataFromFirestore;
    return dataFromFirestore;
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    return false;
  }
}

function showThisPage(page) {
  state.pages[page].style.display = "flex";
  Object.keys(state.pages).filter(key => key !== page).forEach(item => state.pages[item].style.display = "none");
}

function convertToBase64(files) {
  const array = []
  for (let file of files) {
    const fileRead = new FileReader();
    fileRead.onload = function(uploadedFile) {
      const image64 = uploadedFile.target.result;
      array.push(image64)
    }
    fileRead.readAsDataURL(file)
  }
  return array
}
function onFileSelected(e) {
  state.values.uploadedImage = [];
  state.values.uploadedImage = convertToBase64(e.target.files);
}
function onFileDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  state.values.uploadedImage = [];
  state.values.uploadedImage = convertToBase64(e.dataTransfer.files);
}

function cleanEditEntries() {
  state.edit.name.value = "";
  state.edit.description.value = "";
  state.edit.category.value = "";
  state.edit.weight.value = "";
  state.edit.width.value = "";
  state.edit.height.value = "";
  state.edit.length.value = "";
  state.values.uploadedImage = [];
}
async function saveItem() {
  if (state.edit.name.value) {
    await addDoc(collection(db, COLL), {
      name: state.edit.name.value,
      description: state.edit.description.value,
      category: state.edit.category.value,
      weight: state.edit.weight.value,
      width: state.edit.width.value,
      height: state.edit.height.value,
      length: state.edit.length.value,
      image: state.values.uploadedImage,
      detail: state.edit.detail.value,
    });
    cleanEditEntries();
  }
}
function createCards(list) {
  list.forEach(item => {
    let group = document.querySelector(`.${item.category}`);
    let items;
    
    if (!group) {
      group = document.createElement("div");
      group.classList.add("group");
      group.classList.add(item.category);
      const header = document.createElement("h2");
      header.textContent = item.category;
      header.style.textTransform = "uppercase";
      group.appendChild(header);      
      items = document.createElement("div");
      items.classList.add("items");
      group.appendChild(items);
      state.pages.content.appendChild(group);
    }
    items = group.querySelector(".items");
    
    const card = document.createElement("div");
    card.classList.add("item")

    const header = document.createElement("h3");
    header.textContent = item.name;
    card.appendChild(header)
    
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = `${item.name}: ${item.description}`
    card.appendChild(img)
    
    const span = document.createElement("span");
    span.textContent = item.description;
    card.appendChild(span)
    
    const button = document.createElement("button");
    button.textContent = "Mais detalhes";
    button.addEventListener("click", () => handleDetail(item))
    card.appendChild(button)

    items.appendChild(card)
  })
}
function handleDetail(item) {
  showThisPage("detail");
  state.detail.name.textContent = item.name;
  state.detail.description.textContent = item.description;
  state.detail.category.textContent = item.category;
  state.detail.weight.textContent = item.weight;
  state.detail.width.textContent = item.width;
  state.detail.height.textContent = item.height;
  state.detail.length.textContent = item.length;
  state.detail.detail.textContent = item.detail;
}
function handleAddItem() {
  if (!state.values.isLogged) {
    showThisPage("login")
  } else {
    showThisPage("edit")
  }
}
async function handleLogin() {
  state.actions.login.disabled = true;
  const user = state.login.user.value;
  const password = state.login.password.value;
  console.log("user:", user, "password:", password)
  try {
    await signInWithEmailAndPassword(auth, user, password);
    showThisPage("edit");
    state.values.isLogged = true;
    state.actions.login.disabled = false;
  } catch (error) {
    console.log(error)
    state.actions.login.disabled = false;
  }
}

async function init() {
  showThisPage("content");
  state.values.itemsList = await fetchData();
  createCards(state.values.itemsList);
  state.actions.image.addEventListener("change", e => onFileSelected(e));
  state.actions.dropArea.addEventListener("drop", e => onFileDrop(e));
  state.actions.saveItem.addEventListener("click", () => saveItem());

  state.actions.editItem.addEventListener("dblclick", () => handleAddItem());
  state.actions.login.addEventListener("click", () => handleLogin());
  state.actions.back.addEventListener("click", () => showThisPage("content"));
  state.actions.clean.addEventListener("click", () => cleanEditEntries());
  state.actions.closeDetail.addEventListener("click", () => showThisPage("content"));
  state.actions.closeLogin.addEventListener("click", () => showThisPage("content"));
}

init()