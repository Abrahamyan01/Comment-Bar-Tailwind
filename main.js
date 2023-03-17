let comments = [];
loadComments();

const validateInput = () => {
    let name = document.getElementById('name').value;
    let errorField = document.getElementById("error")
    if (name === "") {
        document.getElementById('name').focus();
        errorField.innerText = "Please, write your name..."
        errorField.classList.add("text-red-500")        
        setTimeout(() => {
            errorField.innerText = ""
        }, 2000);
        return false;
    } else {
        return true;
    }
}

document.querySelector(".get_data").onclick = function (e) {
    e.preventDefault();
    let name = document.getElementById("name");
    let info = tinymce.get("textarea").getContent();
    let date = document.getElementById("date");
    let data = date.value
    const now = new Date();
    let objectTime = timeRestore(now);

    const isOkay = validateInput()
    if (isOkay) {

        if (data == objectTime.today || data == "") {
            data = "Today"
        } else if (data === objectTime.yesterday) {
            data = "Yesterday"
        }

        let comment = {
            time: objectTime.hoursAndMinutes,
            name: name.value,
            body: info,
            date: data,
        }

        name.value = "";
        info = tinyMCE.activeEditor.setContent('');
        date.value = "";

        comments.push(comment);
        saveComments();
        showComments();
    }
}

function saveComments() {
    localStorage.setItem("comments", JSON.stringify(comments));
}

function loadComments() {
    if (localStorage.getItem("comments")) comments = JSON.parse(localStorage.getItem("comments"));
    showComments();
}

function showComments() {
    let list = document.getElementById("comment_line");
    let out = "";
    comments.forEach((el) => {
        out += `  
        <div id="comment">  
        <div class="flex justify-between items-center border-b-2 border-blue-200 mt-4 px-4 pb-1 w-94">
        <p class="text-blue-400 capitalize">${el.name}</p>
        <p class="text-blue-400">${el.date} at ${el.time}</p>    
        </div>
        <div class="mt-3 w-96 px-4 inline-block">${el.body}</div>
        <div class="flex items-center justify-between px-4 mt-2">
        <p id="${el.time}" class="text-blue-400">0 likes</p>
        <div id="icons" class="flex items-center justify-center gap-5">
        <i class='bx bx-heart hover:text-red-400 transition-colors duration-300'></i>
        <i class='bx bxs-trash hover:text-blue-400 transition-colors duration-300'></i>
        </div>    
        </div>
        </div>`
    });
    list.innerHTML = out;

    let hearts = Array.from(document.querySelectorAll('.bx-heart'))
    hearts.forEach(heart => {
        heart.addEventListener("click", (e) => {
            let like = e.target.parentNode.previousElementSibling;
            if (like.innerText == "0 likes") {
                like.innerText = "1 likes"
            } else {
                like.innerText = "0 likes"
            }
        })
    });

    let removes = Array.from(document.querySelectorAll('.bxs-trash'))
    removes.forEach(remove => {
        remove.addEventListener("click", (e) => {
            let item = e.target.parentNode.parentNode.parentNode
            let list = document.getElementById("comment_line");
            list.removeChild(item);
            let id = item.firstChild.nextSibling.lastChild.previousElementSibling.innerText.split(" ")[2];
            resultComments(id);
        })
    })



    function resultComments(id) {
        let elements = comments.filter(comment => comment.time !== id);
        console.log(elements)
        window.localStorage.clear();
        localStorage.setItem("comments", JSON.stringify(elements));
    }
}

function timeRestore(now) {

    let day = timeformat(now.getDate());
    let yday = timeformat(now.getDate() - 1);
    let month = timeformat(now.getMonth() + 1);
    let year = now.getFullYear();
    let hours = timeformat(now.getHours());
    let minutes = timeformat(now.getMinutes());
    let seconds = timeformat(now.getSeconds());
    let today = year + "-" + month + "-" + day;
    let yesterday = year + "-" + month + "-" + yday;
    let hoursAndMinutes = hours + ":" + minutes + ":" + seconds;

    return {
        today: today,
        yesterday: yesterday,
        hoursAndMinutes: hoursAndMinutes,
    }
}

function timeformat(value) {
    if (value < 10) {
        value = '0' + value;
    }
    return value;
}








