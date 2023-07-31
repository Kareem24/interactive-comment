const getElement = function (selector, isList) {
  if (isList) return document.querySelectorAll(selector);

  return document.querySelector(selector);
};
const commentContainer = getElement(".container", false);
const createComment = function (users) {
  const { content, score, user, createdAt } = users;
  return `
    <div class="post-interaction">
  <article class="post bg-white">
					<div class="headings d-flex ai-c">
						<img
							src=".${user.image.webp}"
							alt="amyrobson profile image"
							class="user-image" />
						<h3 class="user-name">${user.username}</h3>
						<p class="time text">${createdAt} </p>
					</div>
					<p class="comment text">${content} </p>
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

const getData = async function () {
  const response = await fetch("../data.json");
  const data = await response.json();
  const { currentUser, comments } = data;
  const post = comments.map((person) => createComment(person)).join(" ");
  commentContainer.insertAdjacentHTML("beforeend", post);
  // console.log(post);
  const reply = comments.map(({ replies }) => replies);

  const posts = getElement(".post-interaction", true);

  posts.forEach((singlePost, i) => {
    const repliedComment = reply[i]
      .map(
        (singlereply) => `<div class="reply-comment d-flex">
  				<div class="vertical-line"></div>
  					${createComment(singlereply)}
  			</div>`,
      )
      .join("");
    singlePost.insertAdjacentHTML("beforeend", repliedComment);
  });

  // posts.forEach((comment) => comment.insertAdjacentHTML('beforeend', reply))
};
getData();
