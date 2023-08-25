/* eslint-disable no-param-reassign */

const getElement = function (selector, isList = false) {
  if (isList) return document.querySelectorAll(selector);
  return document.querySelector(selector);
};
const commentContainer = getElement(".container");
const submitBtn = getElement(".submit-comment");
const commentText = getElement(".comment-text");
const modal = getElement(".modal");
const cancelDelete = getElement(".btn-cancel");

const getFromStorage = () => JSON.parse(localStorage.getItem("data"));
const setToStorage = (data) =>
  localStorage.setItem("data", JSON.stringify(data));

const createElement = (element, ...className) => {
  const el = document.createElement(element);
  className.forEach((singlecClass) => el.classList.add(singlecClass));
  return el;
};

const allCommentDiv = createElement("div", "post-interaction");
const createComment = function (users) {
  const { content, score, user, createdAt, id, replyingTo } = users;
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
					
          <div class="votes-btn d-flex jc-sb ai-c">
            <button type="button" class="upvote btn"><img src="./images/icon-plus.svg" alt="the plus icon for the upvote btn" class="upvote"  /></button>
            <p class="vote">${score}</p>
            <button type="button" class="downvote btn"><img src="./images/icon-minus.svg" alt="the minus image for downvote" class="downvote"/></button>
          </div>
          <p class="comment text"><span class='mention-user'>${
            replyingTo ? "@" : ""
          }${replyingTo || ""}</span> <span> ${content}</span> </p>
					<div class="buttons d-flex jc-sb ai-c">
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
  				${createComment(singleReply)}
  				<div class="vertical-line"></div>
  		  </div>`,
      )
      .join("");
    singlePost.insertAdjacentHTML("beforeend", repliedComment);
  });
};
const upVote = (e) => {
  const currTarget = e.target;
  let id;
  if (currTarget.classList.contains("upvote")) {
    const data = getFromStorage();
    const parent =
      currTarget.parentElement.parentElement.parentElement.parentElement;
    const el = parent.parentElement;

    id = parent.dataset.id;
    const { comments } = data;
    const increase = (post) => {
      const addVote =
        post.find((comment) => comment.id.toString() === id).score + 1;
      post.find((comment) => comment.id.toString() === id).score = addVote;
      setToStorage(data);
      const score = currTarget.parentElement.nextElementSibling;
      score.textContent = addVote;
    };

    if (el.classList.contains("post-interaction")) {
      increase(comments);
    }
    if (el.classList.contains("reply-comment")) {
      const replies = comments.map((comment) => comment.replies).flat();
      increase(replies);
    }
  }
};
const downVote = (e) => {
  const data = getFromStorage();
  let id;
  const { comments } = data;

  const currTarget = e.target;
  if (currTarget.classList.contains("downvote")) {
    const parent =
      currTarget.parentElement.parentElement.parentElement.parentElement;
    const el = parent.parentElement;
    id = parent.dataset.id;
    const decrease = (post) => {
      const subVote =
        post.find((comment) => comment.id.toString() === id).score - 1;
      if (subVote < 0) return;
      post.find((comment) => comment.id.toString() === id).score = subVote;
      setToStorage(data);
      const score = currTarget.parentElement.previousElementSibling;
      score.textContent = subVote;
    };

    if (el.classList.contains("post-interaction")) {
      decrease(comments);
    }
    if (el.classList.contains("reply-comment")) {
      const replies = comments.map((comment) => comment.replies).flat();
      decrease(replies);
    }
  }
};

const showModal = () => {
  modal.classList.add("d-flex");
  modal.classList.remove("d-none");
};

const closeModal = () => {
  modal.classList.add("d-none");
  modal.classList.remove("d-flex");
};

const confirmDelete = (el) => {
  el.remove();
  closeModal();
};

const deleteComment = (e) => {
  const currtarget = e.target;
  const deleteBtn = getElement(".btn-delete");
  const data = getFromStorage();
  const { comments } = data;
  let parent;
  let el;
  let id;

  if (currtarget.classList.contains("delete-btn")) {
    parent = currtarget.parentElement.parentElement.parentElement.parentElement;
    el = parent.parentElement;
    id = parent.dataset.id;

    showModal();

    deleteBtn.addEventListener("click", () => {
      if (el.classList.contains("post-interaction")) {
        confirmDelete(parent);
        const filteredComments = comments.filter(
          (comment) => comment.id !== id,
        );
        data.comments = filteredComments;
        setToStorage(data);
        e.stopPropagation();
        return;
      }
      if (el.classList.contains("reply-comment")) {
        confirmDelete(el);
        comments.forEach(({ replies }) => {
          replies.forEach((reply) => {
            if (reply.id.toString() === id) {
              const index = replies.indexOf(reply);
              replies.splice(index, 1);
            }
          });
        });
        setToStorage(data);
      }
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
const createCommentObj = function (value, isReply = false, user = "") {
  const data = getFromStorage();
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
  if (isReply) {
    delete newComment.replies;
    newComment.replyingTo = user;
  }
  return newComment;
};
const formFocus = (btn, input, paragraph) => {
  btn.disabled = true;
  input.focus();
  input.value = paragraph?.textContent || "";
};

const replyComment = (e) => {
  const currTarget = e.target;
  const form = createFormUI(false);
  const updateBtn = form.querySelector(".submit-comment");
  const comment = form.querySelector(".comment-text");
  const data = getFromStorage();
  const { comments } = data;
  let user;
  let parent;
  let id;
  let el;
  if (currTarget.classList.contains("reply-btn")) {
    parent = currTarget.parentElement.parentElement.parentElement.parentElement;
    parent.append(form);
    id = parent.dataset.id;
    el = parent.parentElement;

    if (el.classList.contains("post-interaction")) {
      user = comments.find((person) => person.id === +id).user.username;
    } else {
      user = comments
        .map(({ replies }) => replies)
        .flat()
        .find((reply) => reply.id.toString() === id).user.username;
    }
    formFocus(currTarget, comment);
  }
  updateBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    currTarget.disabled = false;
    const { value } = comment;
    if (!value) return;

    const reply = createCommentObj(value, true, user);
    const html = `<div class="reply-comment  d-flex">
  				${createComment(reply, user)}
  				<div class="vertical-line"></div>
  		  </div>`;

    if (el.classList.contains("post-interaction")) {
      parent.insertAdjacentHTML("beforeend", html);

      comments.find((person) => person.id === +id).replies.push(reply);
      setToStorage(data);
    } else {
      const container = parent.parentElement.parentElement;
      container.insertAdjacentHTML("beforeend", html);
      id = container.dataset.id;
      reply.replyingTo = user;
      comments.find((person) => person.id === +id).replies.push(reply);
      setToStorage(data);
    }
    form.remove();
  });
};

const editComments = (e) => {
  const currTarget = e.target;
  const data = getFromStorage();
  const { comments } = data;
  const form = createFormUI(true);
  const comment = form.querySelector(".comment-text");
  const updateBtn = form.querySelector(".submit-comment");

  let parent;
  let el;
  let paragraph;
  let id;
  if (currTarget.classList.contains("edit-btn")) {
    parent = currTarget.parentElement.parentElement.parentElement.parentElement;
    el = parent.parentElement;
    id = parent.dataset.id;
    paragraph =
      currTarget.parentElement.parentElement.previousElementSibling
        .lastElementChild;
    console.log(paragraph);
    parent.append(form);
    formFocus(currTarget, comment, paragraph);
  }
  updateBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (!comment.value) return;
    paragraph.textContent = comment.value;

    if (el.classList.contains("post-interaction")) {
      comments.find((person) => person.id === id).content = comment.value;
      setToStorage(data);
    } else {
      comments
        .map(({ replies }) => replies)
        .flat()
        .find((reply) => reply.id.toString() === id).content = comment.value;
      setToStorage(data);
    }
    currTarget.disabled = false;
    form.remove();
  });
};

const addComment = (e) => {
  e.preventDefault();
  const data = getFromStorage();
  const { value } = commentText;

  const newComment = createCommentObj(value);
  data.comments.push(newComment);
  allCommentDiv.insertAdjacentHTML("beforeend", createComment(newComment));
  setToStorage(data);
  commentText.value = "";
};

const fetchData = async function () {
  try {
    let data;
    if (localStorage.getItem("data")) {
      data = getFromStorage();
    } else {
      const response = await fetch("../data.json");
      data = await response.json();
      setToStorage(data);
    }

    loadPage(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

window.addEventListener("DOMContentLoaded", fetchData);
submitBtn.addEventListener("click", addComment);
commentContainer.addEventListener("click", (e) => {
  deleteComment(e);
  editComments(e);
  replyComment(e);
  upVote(e);
  downVote(e);
});
cancelDelete.addEventListener("click", closeModal);
