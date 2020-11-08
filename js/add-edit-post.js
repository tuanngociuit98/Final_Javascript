import postApi from "./api/postApi.js";

function parseUrlString(str) {
  const params = {};

  // Write your code here ...
  const keyValuePairs = str.split("&");
  // console.log(keyValuePairs);
  keyValuePairs.forEach((pairString) => {
    // const values = pairString.split('=');
    // const key = values[0];
    // const value = values[1];

    // array desctructoring
    const [key, value] = pairString.split("=");
    params[key] = value;

    // key = page
    // params.page = value;
  });

  return params;
}

// Global variables
// TODO: URLSearchParams()
const urlParams = parseUrlString(window.location.search.slice(1));
const postId = urlParams.id;
const isEditMode = !!postId;



(async function () {
  if (isEditMode) {
    const post = await postApi.get(postId);
    console.log(post);

    setFormValues(post);
  }
})();

const getFormValues = (form) => {
  if (!form) return {};

  const formValues = {};

  // Get value of Title
  const title = form.querySelector("#postTitle");
  if (title) {
    formValues.title = title.value;
  }
  // Get value of author
  const authorInput = form.querySelector("#postAuthor");
  if (authorInput) {
    formValues.author = authorInput.value;
  }

  // Get value of Description
  const description = form.querySelector("#postDescription");
  if (description) {
    formValues.description = description.value;
  }

  return formValues;
};

const validateForm = (values) => {
  if (!values) return false;

  let isValid = true;

  // Validate title: title not null
  const isValidtitle = values.title.split(" ").filter((x) => !!x).length >= 1;
  if (!isValidtitle) {
    // TODO: Update DOM to show error message

    isValid = false;
    console.log("Title is invalid");
  }
  // Validate author: author not null
  const isValidAuthor = values.author.split(" ").filter((x) => !!x).length >= 1;
  if (!isValidtitle) {
    // TODO: Update DOM to show error message

    isValid = false;
    console.log("Author is invalid");
  }

  return isValid;
};





const handleFormSubmit = async (e) => {
  e.preventDefault();

  const postForm = e.target;
  const formValues = getFormValues(postForm);

  // Validation
  const isValid = validateForm(formValues);
  if (!isValid) return;

  // ADD/EDIT
  if (isEditMode) {
    formValues.id = postId;
    await postApi.update(formValues);
  } else {
    await postApi.add(formValues);
  }

  // Reset form
  postForm.reset();

  // Back home
  window.location = "/";
};

// Find form element and attach save event
const formElement = document.querySelector("#postForm");
if (formElement) {
  formElement.addEventListener("submit", handleFormSubmit);
}

const setFormValues = (post) => {
  // Populate data to student form

  // Get name
  const authorInput = formElement.querySelector("#postAuthor");
  if (authorInput) {
    authorInput.value = post.author;
  }

  // Get value of description
  const descriptionInput = formElement.querySelector("#postDescription");
  if (descriptionInput) {
    descriptionInput.value = post.description;
  }

  
  // Get value of city
  const titleInput = formElement.querySelector("#postTitle");
  if (titleInput) {
    titleInput.value = post.title;
  }
};
