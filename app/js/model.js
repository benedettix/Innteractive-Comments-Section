const base = {
  comments: [],
  currentUser: {},
};

const createDataObject = function (data) {
  let { comments } = data;
  let { currentUser } = data;
  base.comments = comments;
  base.currentUser = currentUser;
  console.log(base);
};

const loadData = async function () {
  try {
    const dataReq = await fetch("../../data.json");
    const data = await dataReq.json();
    createDataObject(data);
    await eventHandler();
    await listData();
  } catch (err) {
    console.log(err);
  }
};

loadData();

const eventHandler = async function () {
  let replyBtns = document.querySelectorAll("#reply-btn");
  replyBtns.forEach((btn) => {
    btn.addEventListener("click", toggleReply);
  });
};

function commentTool(com) {
  if (com.user.username === base.currentUser.username) {
    return `a href="#" onclick="deleteComment(event)"><img src="images/icon-delete.svg" alt="del">Delete</a>
  <a href="#" onclick="editComment(event)"><img src="images/icon-edit.svg" alt="edit">Edit</a>`;
  } else {
    return `<a href="#" onclick="toggleReply(event)">↩ Reply</a>`;
  }
}

function replyTool(repl) {
  if (repl.user.username === base.currentUser.username) {
    return `a href="#" onclick="deleteReply(event)"><img src="images/icon-delete.svg" alt="del">Delete</a>
  <a href="#" onclick="editComment(event)"><img src="images/icon-edit.svg" alt="edit">Edit</a>`;
  } else {
    return `<a href="#" onclick="toggleReply(event)">↩ Reply</a>`;
  }
}

const listData = async function () {
  base.comments.forEach((com) => {
    let id = com.id;
    let markup = `
  <div class="post" data-id=${id} data-type='reply'>
      <div class="post__vote">
        <a href="#" onclick="votePlus(event)">+</a>
        <p>${com.score}</p>
        <a href="#" onclick="voteMinus(event)">-</a>
      </div>
      <div class="post__body">
        <div class="user__tools">
          <div class="user">
            <img src=${com.user.image.png} alt="avatar">
            <span><b>${com.user.username}</b></span><span>${
      com.createdAt
    }</span>
          </div>
          <div class="tool">
          ${commentTool(com)}
          </div>
        </div>
        <div class="desc">
          <p>${com.content}</p>
        </div>
      </div>

    </div>
  
  `;
    if (com.replies.length > 0) {
      let markup2 = ``;

      com.replies.forEach((repl) => {
        markup2 += `
    <div class="post" data-id="${id}">
      <div class="post__vote">
        <a href="#" onclick="votePlus(event)" >+</a>
        <p>0</p>
        <a href="#" onclick="voteMinus(event)">-</a>
      </div>
      <div class="post__body">
        <div class="user__tools">
          <div class="user">
            <img src=${repl.user.image.png} alt="avatar">
            <span><b>${repl.user.username}</b></span><span>${
          repl.createdAt
        }</span>
          </div>
          <div class="tool">
          ${replyTool(repl)}
          </div>
        </div>
        <div class="desc">
          <p>${repl.content}</p>
        </div>
      </div>
      </div>
    `;
      });
      let addedLine = `<div class="added">
    <div class="line"></div>
    ${markup2}
  </div>`;
      markup += addedLine;
    }
    document
      .querySelector(".container")
      .insertAdjacentHTML("afterbegin", markup);
  });
};
