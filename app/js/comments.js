let sendComment = document.querySelector("#send-comment");
let sendBtn = document.querySelector("#send");
let container = document.querySelector(".container");

sendComment.addEventListener("input", getComment);

function toggleReply(e) {
  let markup = `
  <div class="reply">
      <img src="images\\avatars\\image-juliusomo.png" alt="avatar">
      <textarea placeholder="Add a reply..." name="reply-comment" id="reply-comment"></textarea>
      <button onclick="postReply(event)">REPLY</button>
    </div>
  `;
  let post = e.target.closest(".post");
  let previousEL = post.nextElementSibling;
  e.target.closest(".post").insertAdjacentHTML("afterend", markup);

  if (post.nextElementSibling.isEqualNode(previousEL)) {
    post.nextElementSibling.remove();
  }
}

function postReply(e) {
  let parent = e.target.closest(".reply");
  let id = e.target.closest(".reply").previousElementSibling.dataset.id;
  let aDay = 24 * 60 * 60 * 1000;
  let date = timeSince(new Date(Date.now() - aDay * 2));
  let postObj = {
    content: `${parent.querySelector("textarea").value}`,
    createdAt: `${date}`,
    score: 0,
    replyingTo: `${
      parent.previousElementSibling.querySelector(
        ".post__body .user__tools .user span b"
      ).innerHTML
    }`,
    user: {
      image: {
        png: `${base.currentUser.image.png}`,
        webp: `${base.currentUser.image.webp}`,
      },
      username: `${base.currentUser.username}`,
    },
  };
  base.comments[id].replies.splice(id, 0, postObj);
  console.log(base.comments);
  let markup = `
  <div class="added">
      <div class="line"></div>
      <div class="post" data-id="${base.comments[id].replies.length}" data-type="reply">
        <div class="post__vote">
          <a href="#" onclick="votePlus(event)" >+</a>
          <p>0</p>
          <a href="#" onclick="voteMinus(event)">-</a>
        </div>
        <div class="post__body">
          <div class="user__tools">
            <div class="user">
              <img src=${base.comments[id].replies[id].user.image.png} alt="avatar">
              <span><b>${base.comments[id].replies[id].user.username}</b></span><span>${date}</span>
            </div>
            <div class="tool">
            <a href="#" onclick="openModal(event)"><img src="images/icon-delete.svg" alt="del">Delete</a>
            <a href="#" onclick="editComment(event)"><img src="images/icon-edit.svg" alt="edit">Edit</a>
            </div>
          </div>
          <div class="desc">
            <p>${base.comments[id].replies[id].content}</p>
          </div>
        </div>
      </div>
  `;

  e.target.closest(".reply").insertAdjacentHTML("afterend", markup);
  e.target.closest(".reply").remove();
}

function openModal(e) {
  let post = e.target.closest(".post");
  let id = e.target.closest(".post").dataset.id;

  if (post.hasAttribute("data-type")) {
    let headId = e.target.closest(".added").previousElementSibling.dataset.id;
    base.comments[headId].replies.splice(id);
  }
  if (!post.hasAttribute("data-type")) {
    base.comments.splice(id, 1);
  }

  e.target.closest(".post").remove();
  closeModal();
  console.log(base.comments);
  // });
}

function closeModal() {
  document.querySelector(".modal__holder").style.display = "none";
  document.querySelector(".overlay").style.display = "none";
}

function editComment(e) {
  let textarea = `<textarea name="edit-comment" id="edit-comment"></textarea><button id="update">UPDATE</button>`;
  let desc = e.target.closest(".post");
  desc =
    e.target.parentElement.parentElement.parentElement.querySelector(".desc");
  if (desc.querySelector("textarea")) return;
  let descValue = desc.querySelector("p").innerHTML;
  console.log(descValue);

  desc.innerHTML = textarea;
  desc.querySelector("#update").addEventListener("click", updateComment);
  desc.querySelector("textarea").value = descValue;
}

function updateComment() {
  let parent = this.parentElement;
  let textarea = this.parentElement.querySelector("textarea");
  let updateValue = textarea.value;
  let paragraph = `<p>${updateValue}</p>`;
  let id = this.closest(".added").previousElementSibling.dataset.id;
  base.comments[id].content = updateValue;
  console.log(base);
  parent.innerHTML = paragraph;
}

function getComment() {
  const text = sendComment.value;
  return text;
}

sendBtn.addEventListener("click", createComment);

function showError() {
  let html = `<p style="color: red">Your comment length should be higher than 5</p>`;
  document.querySelector(".error").innerHTML = html;
}

function votePlus(e) {
  let id = e.target.closest(".post").dataset.id;
  let score = e.target.parentElement.querySelector("p").innerHTML;
  score++;
  e.target.parentElement.querySelector("p").innerHTML = score;
  base.comments[id].score = score;
}

function voteMinus(e) {
  let id = e.target.closest(".post").dataset.id;
  let score = e.target.parentElement.querySelector("p").innerHTML;
  score--;
  if (score < 0) return;
  e.target.parentElement.querySelector("p").innerHTML = score;
  base.comments[id].score = score;
}

function generateMarkup(user) {
  let markup = `
    <div class="post" data-id="${user.id}">
    <div class="post__vote">
      <a href="#" onclick="votePlus(event)">+</a>
      <p>${user.score}</p>
      <a href="#" onclick="voteMinus(event)">-</a>
    </div>
    <div class="post__body">
      <div class="user__tools">
        <div class="user">
          <img src=${user.user.image.png} alt="avatar">
          <span><b>${user.user.username}</b></span><span class="you">you</span><span>${user.createdAt}</span>
        </div>
        <div class="tool">
            <a href="#" onclick="openModal(event)" id="delete"><img src="images/icon-delete.svg" alt="del">Delete</a>
            <a href="#" onclick="editComment(event)" id="edit"><img src="images/icon-edit.svg" alt="edit">Edit</a>
          </div>
      </div>
      <div class="desc">
        <p>${user.content}</p>
      </div>
    </div>
  </div>
    `;
  return markup;
}

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

function createComment() {
  let text = getComment();
  if (text.length === 0) return showError();
  document.querySelector(".error").innerHTML = "";
  sendComment.value = "";
  let aDay = 24 * 60 * 60 * 1000;
  let date = timeSince(new Date(Date.now() - aDay * 2));
  let id = base.comments.length;

  let commentData = {
    id: id,
    content: `${text}`,
    createdAt: `${date}`,
    score: 0,
    user: {
      image: {
        png: `${base.currentUser.image.png}`,
        webp: `${base.currentUser.image.webp}`,
      },
      username: `${base.currentUser.username}`,
    },
    replies: [],
  };
  base.comments.push(commentData);
  console.log(base);
  let markup = generateMarkup(commentData);
  container.insertAdjacentHTML("afterbegin", markup);
}
