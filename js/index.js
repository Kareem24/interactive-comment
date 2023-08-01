const getElement = function (selector, isList = false) {
  if (isList) return document.querySelectorAll(selector);
  return document.querySelector(selector);
};
const commentContainer = getElement(".container");
const submitBtn = getElement(".add-comment");
const commentText = getElement(".comment-text");
const getComments = () => JSON.parse(localStorage.getItem("data"));

const createComment = function (users, name = "") {
  const { content, score, user, createdAt } = users;
  return `
    <div class="post-interaction">
  <article class="post bg-white">
					<div class="headings d-flex ai-c">
						<img
							src=".${user.image.webp}"
            alt="${user.username} profile image"
							class="user-image" />
						<h3 class="user-name">${user.username}</h3>
						<p class="time text">${createdAt} </p>
					</div>
					<p class="comment text"><span class='mention-user'>${
            name ? "@" : ""
          }${name}</span> ${content} </p>
					<div class="buttons d-flex jc-sb ai-c">
						<div class="votes-btn d-flex jc-sb ai-c">
							<button type="button" class="upvote btn">+</button>
							<p class="vote">${score} </p>
							<button type="button" class="downvote btn">-</button>
						</div>
						<button type="button" class="btn reply-btn">
							<span class="icon">i</span>reply
						</button>
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
  // const reply = comments.map(({ replies, user }) => replies);
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

const addComment = (e) => {
  e.preventDefault();
  const data = JSON.parse(localStorage.getItem("data"));
  const { value } = commentText;
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
  localStorage.setItem("data", JSON.stringify(data));
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
