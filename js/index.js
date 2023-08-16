const getElement = function (selector, isList = false) {
  if (isList) return document.querySelectorAll(selector);
  return document.querySelector(selector);
};
const commentContainer = getElement(".container");
const submitBtn = getElement(".submit-comment");
const commentText = getElement(".comment-text");
const getComments = () => JSON.parse(localStorage.getItem("data"));
const modal = getElement(".modal");
const cancelDelete = getElement(".btn-cancel");

const setToStorage = (data) =>
  localStorage.setItem("data", JSON.stringify(data));

const createElement = (element, ...className) => {
  const el = document.createElement(element);
  className.forEach((singlecClass) => el.classList.add(singlecClass));
  return el;
};

const allCommentDiv = createElement("div", "post-interaction");
const createComment = function (users, name = "") {
  const { content, score, user, createdAt, id } = users;
  return `
    <div class="article-div" data-id= ${id}>
				<article class="post bg-white">
					<div class="headings d-flex ai-c">
						<img
							src=${user.image.webp}
							alt="${user.username} profile image"
							class="user-image" />
						<h3 class="user-name">${user.username}</h3>
						<div class="tag ${
              user.username === "juliusomo" ? "d-flex" : "d-none"
            } ai-c jc-c">
            <p>You</p>
            </div>
						<p class="time text">${createdAt}</p>
					</div>
					<p class="comment text"><span class='mention-user'>${
            name ? "@" : ""
          }${name}</span> ${content} </p>
					<div class="buttons d-flex jc-sb ai-c">
						<div class="votes-btn d-flex jc-sb ai-c">
							<button type="button" class="upvote btn"><img src="./images/icon-plus.svg" alt="the plus icon for the upvote btn" /></button>
							<p class="vote">${score}</p>
							<button type="button" class="downvote btn"><img src="./images/icon-minus.svg" alt="the minus image for downvote" /></button>
						</div>
            <div>
						<button type="button" class="btn reply-btn  ai-c ${
              user.username === "juliusomo" ? "d-none" : "d-flex"
            }">
							<img src="./images/icon-reply.svg" alt="the reply icon" />Reply
						</button></div>
						<div class="owner-btn ${
              user.username === "juliusomo" ? "d-flex" : "d-none"
            } ai-c">
							<button type="button" class="btn d-flex ai-c delete-btn"
								><img
									src="images/icon-delete.svg"
									alt="delete comment button icon" />Delete</button
							>
							<button type="button" class="btn d-flex ai-c edit-btn"
								><img
									src="images/icon-edit.svg"
									alt="delete comment button icon" />Edit</button
							>
						</div>
					</div>
				</article>
			</div>`;
};

const loadPage = (data) => {
  const { comments } = data;
  const post = comments.map((person) => createComment(person)).join(" ");

  commentContainer.append(allCommentDiv);
  allCommentDiv.insertAdjacentHTML("beforeend", post);
  const reply = comments.reduce((newReplies, users) => {
    const {
      replies,
      user: { username },
    } = users;
    newReplies.push({ replies, username });
    return newReplies;
  }, []);

  const posts = getElement(".article-div", true);
  posts.forEach((singlePost, i) => {
    const repliedComment = reply[i].replies
      .map(
        (singleReply) =>
          `<div class="reply-comment  d-flex">
  				${createComment(singleReply, reply[i].username)}
  				<div class="vertical-line"></div>
  		  </div>`,
      )
      .join("");
    singlePost.insertAdjacentHTML("beforeend", repliedComment);
  });
};

const showModal = () => {
  modal.classList.add("d-flex");
  modal.classList.remove("d-none");
};

const closeModal = () => {
  modal.classList.add("d-none");
  modal.classList.remove("d-flex");
};

const deleteFromStorage = (id) => {
  const data = getComments();
  const { comments } = data;
  const filteredComments = comments.filter((comment) => comment.id !== id);
  data.comments = filteredComments;
  setToStorage(data);
};

const deleteReply = (id) => {
  const data = getComments();
  const { comments } = data;
  comments.forEach(({ replies }) => {
    replies.forEach((reply) => {
      if (reply.id === id) {
        const index = replies.indexOf(reply);
        replies.splice(index, 1);
      }
    });
  });
  setToStorage(data);
};

const confirmDelete = (el) => {
  el.remove();
  const { id } = el.dataset;
  deleteFromStorage(id);
  deleteReply(parseInt(id, 10));
  closeModal();
};

const deleteComment = (e) => {
  const currtarget = e.target;

  if (currtarget.classList.contains("delete-btn")) {
    const parent =
      currtarget.parentElement.parentElement.parentElement.parentElement;
    const deleteBtn = getElement(".btn-delete");

    showModal();
    deleteBtn.addEventListener("click", () => {
      confirmDelete(parent);
    });
  }
};

const createFormUI = (isEdit) => {
  const form = createElement("form", "comment-form", "bg-white");

  form.innerHTML = `<textarea
					name="comment"
					id=""
					cols="30"
					rows="10"
					placeholder="Add comment"
					class="comment-text"></textarea>
        <div class="d-flex ai-c jc-sb">
          <img
            src="./images/avatars/image-juliusomo.webp"
            alt="the account user image"
            class="user-image"
          />
          <button type="submit" class="submit-comment">${
            isEdit ? "Update" : "Submit"
          }</button>
        </div>`;
  return form;
};

const replyComment = (e) => {
  const currTarget = e.target;
  if (currTarget.classList.contains("reply-btn")) {
    console.log("reply");
  }
};

const editComment = (e) => {
  const currTarget = e.target;
  const data = getComments();
  const { comments } = data;
  const form = createFormUI(true);
  const comment = form.querySelector(".comment-text");
  const updateBtn = form.querySelector(".submit-comment");
  if (currTarget.classList.contains("edit-btn")) {
    const parent =
      currTarget.parentElement.parentElement.parentElement.parentElement
        .parentElement;
    const paragraph =
      currTarget.parentElement.parentElement.previousElementSibling;
    if (parent.classList.contains("reply-comment")) {
      parent.firstElementChild.append(form);
      const { id } = parent.firstElementChild.dataset;
      currTarget.disabled = true;
      comment.focus();
      comment.value = paragraph.textContent;

      updateBtn.addEventListener("click", (evt) => {
        evt.preventDefault();
        if (comment.value === "") return;

        comments.forEach(({ replies }) => {
          replies.forEach((reply) => {
            if (reply.id === +id) {
              // eslint-disable-next-line no-param-reassign
              reply.content = comment.value;
              paragraph.textContent = comment.value;

              setToStorage(data);
              form.remove();
              currTarget.disabled = false;
            }
          });
        });
      });

      // commentText.focus();
    }
    if (parent.classList.contains("post-interaction")) {
      parent.append(form);
      const { id } =
        currTarget.parentElement.parentElement.parentElement.parentElement
          .dataset;

      currTarget.disabled = true;
      comment.focus();
      comment.value = paragraph.textContent;
      updateBtn.addEventListener("click", (event) => {
        event.preventDefault();
        // change the text content of the paragph
        paragraph.textContent = comment.value;
        // change back to submit
        updateBtn.textContent = "Submit";
        currTarget.disabled = false;

        // edit from local storage
        comments.find((comt) => comt.id === id).content = comment.value;
        comment.value = "";
        setToStorage(data);
        form.remove();
      });
    }
  }
};

const addComment = (e) => {
  e.preventDefault();
  const data = JSON.parse(localStorage.getItem("data"));
  const { value } = commentText;
  if (!value) return;
  const id = new Date().getTime().toString();
  const { currentUser } = data;
  const content = value;
  const date = new Date();
  const locale = navigator.language;
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  };
  const globalDate = new Intl.DateTimeFormat(locale, options).format(date);
  const newComment = {
    id,
    createdAt: globalDate,
    score: 0,
    replies: [],
    content,
    user: currentUser,
  };
  data.comments.push(newComment);
  allCommentDiv.insertAdjacentHTML("beforeend", createComment(newComment));

  localStorage.setItem("data", JSON.stringify(data));
  commentText.value = "";
};

const getData = async function () {
  try {
    let data;
    if (localStorage.getItem("data")) {
      data = getComments();
    } else {
      const response = await fetch("../data.json");
      data = await response.json();
      localStorage.setItem("data", JSON.stringify(data));
    }

    loadPage(data);
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener("DOMContentLoaded", getData);
submitBtn.addEventListener("click", addComment);
commentContainer.addEventListener("click", (e) => {
  deleteComment(e);
  editComment(e);
  replyComment(e);
});
cancelDelete.addEventListener("click", closeModal);
