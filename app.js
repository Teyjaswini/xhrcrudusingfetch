const cl = console.log;

const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('title')
const bodyControl = document.getElementById('body')
const userIdControl = document.getElementById('userId')
const spinner = document.getElementById('spinner')
const addPostBtn = document.getElementById('addPostBtn')
const updatePostBtn = document.getElementById('updatePostBtn')

// create >> POST
// get from DB >> GET
// remove >> DELETE
// update >> PUT/PATCH

const BASE_URL = `https://jsonplaceholder.typicode.com`

const POSTS_URL = `${BASE_URL}/posts`;
const postContainer = document.getElementById('postContainer')

let postsArr = []

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}


const createPostCards = arr => {
    postsArr = arr;
    let result = '';
    for (let i = arr.length - 1; i >= 0; i--) {
        result += `<div class="col-md-4 mb-4" id="${arr[i].id}">
                <div class="card h-100">
                    <div class="card-header">
                        <h3>
                            ${arr[i].title}
                        </h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">
                            ${arr[i].body}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button 
                        onclick="onEdit(this)"
                        class="btn btn-sm btn-outline-primary">Edit</button>
                        <button 
                        onclick="onRemove(this)"
                        class="btn btn-sm btn-outline-danger">Remove</button>
                    </div>
                </div>
            </div>`

    };

    postContainer.innerHTML = result;

}


function fetchPosts() {
    // Spinner Show
    spinner.classList.remove('d-none')
    fetch(POSTS_URL, {
        method: 'GET',
        body: null,
        headers: { // Without header API Call won't be there
            'content-type': 'application/json',
            "auth": 'Token from Local Storage'
        }
    }) // default Method >> Get
        .then(res => {
            cl(res)
            return res.json()
        })
        .then(data => {
            createPostCards(data)
        })
        .catch(err => {
            snackbar(err)
        })
        .finally(() => {
            // Spinner stop or hide
            spinner.classList.add('d-none')
        })
}

fetchPosts()

function onPostSubmit(eve) {
    // Spinner Show
    spinner.classList.remove('d-none')
    eve.preventDefault();

    let postObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }

    cl(postObj)
    const configObj = {
        method: 'POST',
        body: JSON.stringify(postObj),
        headers: {
            'content-type': 'application/json',
            Auth: 'Token from Local Storage'
        }
    }

    fetch(POSTS_URL, configObj)
        .then(res => {
            return res.json()
        })
        .then(res => {
            cl(res)
            postForm.reset()
            // Create Single Card

            let col = document.createElement('div')
            col.className = `col-md-4 mb-4`
            col.id = res.id
            col.innerHTML = `
                <div class="card h-100">
                    <div class="card-header">
                        <h3>
                            ${res.title}
                        </h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">
                            ${res.body}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button 
                        onclick="onEdit(this)"
                        class="btn btn-sm btn-outline-primary">Edit</button>
                        <button 
                        onclick="onRemove(this)"
                        class="btn btn-sm btn-outline-danger">Remove</button>
                    </div>
                </div>`

            postContainer.prepend(col)
            snackbar(`The post with ID ${res.id} is added successfully !!!`, 'success')

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            // Spinner Hide
            spinner.classList.add('d-none')
        })
}



function onEdit(ele) {
    let EDIT_ID = ele.closest('.col-md-4').id;
    localStorage.setItem('EDIT_ID', EDIT_ID)
    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`;
    spinner.classList.remove('d-none')
    fetch(EDIT_URL, {
        method: 'GET',
        body: null,
        headers: {
            'content-type': 'application/json',
            'auth': 'Token from Local Storage'
        }
    })
        .then(res => {
            return res.json()
        })
        .then(res => {
            titleControl.value = res.title
            bodyControl.value = res.body
            userIdControl.value = res.userId
            addPostBtn.classList.add('d-none')
            updatePostBtn.classList.remove('d-none')
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')
        })
}

function onPostUpdate() {


    // UPDATE_ID

    let UPDATE_ID = localStorage.getItem('EDIT_ID')
    // UPDATE_OBJ

    let UPDATE_OBJ = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value,
        id: UPDATE_ID
    }

    // UPDATE_URL

    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`

    // API CALL

    const config = {
        method: 'PATCH',
        body: JSON.stringify(UPDATE_OBJ),
        headers: {
            'content-type': 'application/json',
            Auth: 'Token from Local Storage'
        }
    }
    spinner.classList.remove('d-none')
    fetch(UPDATE_URL, config)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(data => {
            cl(data)
            postForm.reset()
            let col = document.getElementById(UPDATE_ID)
            let h3 = col.querySelector('.card-header h3')
            let p = col.querySelector('.card-body p')
            h3.innerText = UPDATE_OBJ.title
            p.innerText = UPDATE_OBJ.body
            updatePostBtn.classList.add('d-none')
            addPostBtn.classList.remove('d-none')
            snackbar(`The post with ID ${UPDATE_ID} is updated successfully !!!`, 'success')

        })
        .catch(err => {
            snackbar(err)
        })
        .finally(() => {
            spinner.classList.add('d-none')
        })
}

function onRemove(ele) {
    let REMOVE_ID = ele.closest('.col-md-4').id

    Swal.fire({
        title: `Do you want to remove the Post with ID ${REMOVE_ID}?`,
        showCancelButton: true,
        confirmButtonText: "Remove",
    }).then((result) => {
        if(result.isConfirmed){
            let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`
            spinner.classList.remove('d-none')
            fetch(REMOVE_URL, {
                method : 'DELETE',
                body : null,
                headers : {
                    auth : 'Token from Local Storage'
                }
            })
                .then(res => res.json())
                .then(data => {
                    cl(data),
                    snackbar(`The post with ID ${REMOVE_ID} is removed successfully !!!`, 'success')
                    ele.closest('.col-md-4').remove()
                })
                .catch(err => {
                    snackbar(err, 'error')
                })
                .finally(() => {
                    spinner.classList.add('d-none')
                })
        }


    });



}

postForm.addEventListener('submit', onPostSubmit)
updatePostBtn.addEventListener('click', onPostUpdate)






// Promise<Response> >> Promise of type Response
// If we consume this promsie we will get data of type Response(Type) 
