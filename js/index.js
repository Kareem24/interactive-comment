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

const createComment = function (users, name = "") {
  const { content, score, user, createdAt, id } = users;
  return `
    <div class="post-interaction" data-id= ${id}>
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
						<button type="button" class="btn reply-btn  ai-c ${
              user.username === "juliusomo" ? "d-none" : "d-flex"
            }">
							<img src="./images/icon-reply.svg" alt="the reply icon" />Reply
						</button>
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
  commentContainer.insertAdjacentHTML("beforeend", post);
  const reply = comments.reduce((newReplies, users) => {
    const {
      replies,
      user: { username },
    } = users;
    newReplies.push({ replies, username });
    return newReplies;
  }, []);
  const posts = getElement(".post-interaction", true);
  posts.forEach((singlePost, i) => {
    const repliedComment = reply[i].replies
      .map(
        (singleReply) =>
          `<div class="reply-comment d-flex">
  				<div class="vertical-line"></div>
  				${createComment(singleReply, reply[i].username)}
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
  localStorage.setItem("data", JSON.stringify(data));
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
  localStorage.setItem("data", JSON.stringify(data));
};

const deleteComment = (e) => {
  const currtarget = e.target;

  if (currtarget.classList.contains("delete-btn")) {
    const parent =
      currtarget.parentElement.parentElement.parentElement.parentElement;
    const deleteBtn = getElement(".btn-delete");

    showModal();
    deleteBtn.addEventListener("click", () => {
      parent.remove();
      const { id } = parent.dataset;
      deleteFromStorage(id);
      deleteReply(parseInt(id, 10));
      closeModal();
    });
  }
};
const addCommentUI = (comment) => {
  const postInteraction = document.createElement("div");
  postInteraction.classList.add("post-interaction");
  postInteraction.setAttribute("data-id", comment.id);
  postInteraction.innerHTML = createComment(comment);
  commentContainer.append(postInteraction);
};

const addComment = (e) => {
  e.preventDefault();
  const data = JSON.parse(localStorage.getItem("data"));
  const { value } = commentText;
  if (!value) return;
  const id = new Date().getTime().toString();
  const { currentUser } = data;
  const content = value;
  const newComment = {
    id,
    // eslint-disable-next-line new-cap
    createdAt: new Date().getUTCDay(),
    score: 0,
    replies: [],
    content,
    user: currentUser,
  };
  data.comments.push(newComment);
  addCommentUI(newComment);
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
commentContainer.addEventListener("click", deleteComment);
cancelDelete.addEventListener("click", closeModal);
