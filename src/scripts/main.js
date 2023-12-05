state = {
  pages: {
    content: document.querySelector(".content-page"),
    login: document.querySelector(".login-page"),
    edit: document.querySelector(".edit-page"),
    detail: document.querySelector(".detail-page"),
  },
  view: {
    name: document.querySelector("#item-name"),
    category: document.querySelector("#item-category"),
    weight: document.querySelector("#item-weight"),
    width: document.querySelector("#item-width"),
    height: document.querySelector("#item-height"),
    length: document.querySelector("#item-length"),
  },
  values: {
    user: null,
    password: null,
    name: null,
    category: null,
    weight: null,
    width: null,
    height: null,
    length: null,
    detail: null,
    uploadedImage: [],
  },
  actions: {
    dropArea: document.querySelector("#drop-area"),
    image: document.querySelector("#item-image"),
    saveItem: document.querySelector("#save-item")
  },
}
const firebaseConfig = {
  apiKey: "AIzaSyAYgx5j6ltZkbF2wvLMIu7uIV_Levk0z6s",
  authDomain: "parts-catalog-ae03d.firebaseapp.com",
  projectId: "parts-catalog-ae03d",
  storageBucket: "parts-catalog-ae03d.appspot.com",
  messagingSenderId: "443141760317",
  appId: "1:443141760317:web:33054c5eb0c1b3e9a59154"
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

function showThisPage(page) {
  state.pages[page].style.display = "flex";
  Object.keys(state.pages).filter(key => key !== page).forEach(item => state.pages[item].style.display = "none");
}

async function saveItem () {
  state.view.name.value; 
  state.view.category.value;
  state.view.weight.value;
  state.view.width.value;
  state.view.height.value;
  state.view.length.value;
}
async function init() {
  showThisPage("edit")
  
  state.actions.image.addEventListener("change", e => onFileSelected(e));
  state.actions.dropArea.addEventListener("drop", e => onFileDrop(e));
  state.actions.saveItem.addEventListener("click", () => saveItem())
}

init()