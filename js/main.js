import postApi from "./api/postApi.js";
import constants from "./constants.js"


const renderPostList = (postList) => {
  const ulElement = document.querySelector("#postsList");

  postList.forEach((post) => {
    // Get template
    const templateElement = document.querySelector("#postItemTemplate");
    if (!templateElement) return;

    // Clone li
    const liElementFromTemplate = templateElement.content.querySelector("li");
    const newLiElement = liElementFromTemplate.cloneNode(true);
    

    const postItemTitle = newLiElement.querySelector("#postItemTitle");
    if (postItemTitle) {
      postItemTitle.textContent = post.title;
    }
    const postItemDescription = newLiElement.querySelector("#postItemDescription");
    if (postItemDescription) {
      postItemDescription.textContent = post.description;
    }
    const postItemAuthor = newLiElement.querySelector("#postItemAuthor");
    if (postItemAuthor) {
      postItemAuthor.textContent = post.author;
    }
    const postItemImage = newLiElement.querySelector("#postItemImage");
    if (postItemImage) {
      postItemImage.src = post.imageUrl;
    }
    const postItemTimeSpan = newLiElement.querySelector("#postItemTimeSpan");
    if (postItemTimeSpan) {
      const datePost = new Date(post.createAt)
    }
    // // Add click event for post div
    // const divElement = newLiElement.querySelector(".post");
    // if (divElement) {
    //   divElement.addEventListener("click", () => {
    //     window.location = `/post-detail.html?id=${student.id}`;
    //   });
    // }

    // // Add click event for edit button
     const editElement = newLiElement.querySelector("#postItemEdit");
     if (editElement) {
       editElement.addEventListener("click", (e) => {
         // Stop bubbling
         e.stopPropagation();

         window.location = `/add-edit-post.html?id=${post.id}`;
       
  });
    }

    // Add click event for remove button
    const removeElement = newLiElement.querySelector("#postItemRemove");
    if (removeElement) {
      removeElement.addEventListener("click", async (e) => {
        // Stop bubbling
        e.stopPropagation();

        // Ask user whether they want to delete
        const message = `Are you sure to remove student ${post.title}?`;
        if (window.confirm(message)) {
          try {
            await postApi
          .remove(post.id);

            // remove li element
            newLiElement.remove();
            await renderData();
            
          } catch (error) {
            console.log("Failed to remove student:", error);
          }
        }
      });
    }

    // Append li to ul
    ulElement.appendChild(newLiElement);
  });
};
const getPageList = (pagination) => {
  const { _limit, _totalRows, _page } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  let prevPage = -1;

  //invalid page detected
  if (_page < 1 || _page > totalPages) return [0, -1, -1, -1, 0];

  if (_page === 1) prevPage = 1;
  else if (_page === totalPages) prevPage = _page - 2 > 0 ? _page - 2 : 1;
  else prevPage = _page - 1;

  const currPage = prevPage + 1 > totalPages ? -1 : prevPage + 1;
  const nextPage = prevPage + 2 > totalPages ? -1 : prevPage + 2;

  return [
    _page === 1 || _page === 1 ? 0 : _page - 1,
    prevPage,
    currPage,
    nextPage,
    _page === totalPages || totalPages === _page ? 0 : _page + 1,
  ];
};

const renderPostsPagination = (pagination) => {
  const postPagination = document.querySelector('#postsPagination');
  if (postPagination) {
    const pageList = getPageList(pagination);
    const { _page, _limit } = pagination;
    const pageItems = postPagination.querySelectorAll('.page-item');
    if (pageItems.length === 5) {
      pageItems.forEach((item, idx) => {
        if (pageList[idx] === -1) {
          item.setAttribute('hidden', '');
          return;
        }

        if (pageList[idx] === 0) {
          item.classList.add('disabled');
          return;
        }

        const pageLink = item.querySelector('.page-link');
        if (pageLink) {
          pageLink.href = `?_page=${pageList[idx]}&_limit=${_limit}`;

          if (idx > 0 && idx < 4) {
            pageLink.textContent = pageList[idx];
          }
        }

        if (idx > 0 && idx < 4 && pageList[idx] === _page) {
          item.classList.add('active');
        }
      });

      postPagination.removeAttribute('hidden');
    }
  }
};
async function renderData(page){
  try {
    // Retrieve city from URL params
    const params = { _page: page, _limit: 6 };
    const response = await postApi.getAll(params);
    const postList = response.data;
   // console.log(postList)
    renderPostList(postList);
    return postList;
  } catch (error) {
    
  }
}
async function main () {
  try{
  const urlParam = new URLSearchParams(window.location.search);
  const page = urlParam.get('_page');
  const limit = urlParam.get('_limit');
  const params = {
    _page: page || constants.DEFAULT_PAGE,
    _limit: limit || constants.DEFAULT_LIMIT,
    _sort: 'updatedAt',
    _order: 'desc',
  };
  // made page buttom -----------------------
  const response = await postApi.getAll(params);
  const postList = response.data;
  renderPostList(postList);

  renderPostsPagination(response.pagination);
  // ---------------------------------------

  const loading = document.querySelector('#loading');
  loading.style.display = 'none';
  // render
} catch (error) {
  console.log('Failed to fetch post list', error);
}}


// MAIN
// IIFE -- iffy
(main)();
