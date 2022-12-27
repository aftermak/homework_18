const loginPage = document.getElementById('login-page');
const userPage = document.getElementById('user-page');
const cardContainer = document.getElementById('card-container');
const modalCreate = document.getElementById('modalCreate');
const modalUpdate = document.getElementById('modalUpdate');
const cardUserTemplate = document.getElementById('card-template').innerHTML;
const loginError = document.querySelector('#error');

const getLogin = document.getElementById('loginName');
const getPassword = document.getElementById('loginPass');
const getFirstName = document.getElementById('userFirstName');
const getLastName = document.getElementById('userLastName');
const getEmail = document.getElementById('userEmail');
const getJob = document.getElementById('userJob');
const updateFirstName = document.getElementById('updateFirstName');
const updateLastName = document.getElementById('updateLastName');
const updateEmail = document.getElementById('updateEmail');
const updateJob = document.getElementById('updateJob');

const buttonLogin = document.querySelector('#login-btn');
const buttonPrew = document.getElementById('action-prew');
const buttonNext = document.getElementById('action-next');
const buttonNew = document.getElementById('action-new');
const buttonCreate = document.getElementById('action-create');
const buttonUpdate = document.getElementById('action-update');
const buttonsDelete = document.getElementsByClassName('delete');
const buttonsUpdate = document.getElementsByClassName('update');

const xhr = new XMLHttpRequest;
const requestURL = 'https://reqres.in';

const getRequest = (API, callback) => {
    xhr.open ('GET', requestURL+API);
    xhr.responseType = 'json'
    xhr.onload = (event) => {
        const response = event.currentTarget.response;
        callback(response)
    }
    xhr.send();
};

const postRequest = (API, body, callbackRequest) => {
    xhr.open ('POST', requestURL+API);
    xhr.responseType = 'json';
    xhr.setRequestHeader ('content-type', 'application/json')
    xhr.onload = (event) => {
        const response = event
        callbackRequest(response)
    }
    xhr.send(body);
};

const updateRequest = (API,body, callbackRequest) => {
    xhr.open ('PUT', requestURL + API);
    xhr.responseType = 'json';
    xhr.setRequestHeader ('content-type', 'application/json')
    xhr.onload = (event) => {
        const response = event;
        callbackRequest(response)
    }
    xhr.send(body);
};

const deleteRequest = (API, callback) => {

    xhr.open ('DELETE', requestURL + API);
    xhr.responseType = 'json'
    xhr.onload = (event) => {
        const response = event.target.status;
        callback(response)
    }
    xhr.send();
}

const userLogin = function () {
    return JSON.stringify(
         { 
            email: getLogin.value,
            password: getPassword.value,
         }
     ) 
 };

const getUsers = (page, callback) => {

    xhr.open ('GET', requestURL + `/api/users?page=${page}`);

    xhr.responseType = 'json';

    xhr.onload = (event) => {
        const {data} = event.currentTarget.response;
        callback(data);
    }
    xhr.onerror = (error) => {
        console.log(error);
    }
    xhr.send();
}

const userCreate = function () {
    return JSON.stringify({
        first_name: getFirstName.value,
        last_name: getLastName.value,
        email: getEmail.value,
        job: getJob.value,
        avatar: 'https://img.freepik.com/free-vector/hand-painted-watercolour-ukraine-flag-background_1048-15614.jpg?w=1800&t=st=1671795340~exp=1671795940~hmac=ab2132d02553809b756ff1f91a5d35278d1a05e84b5f1567eb5603189ae2311f',
        fullname: `${getFirstName.value} ${getLastName.value}`, 
    })
 };

 const userEdit = function () {
    return JSON.stringify({
        first_name: updateFirstName.value,
        last_name: updateLastName.value,
        email: updateEmail.value,
        job: updateJob.value,
        fullname: `${updateFirstName.value} ${updateLastName.value}`, 
    })
 };

function userUpdate () {

    function updateUserCard (user) {
        updateFirstName.value = user.dataset.firstname;
        updateLastName.value = user.dataset.lastname;
        updateEmail.value = user.dataset.email;
        updateJob.value = user.dataset.job;  
    };

    function updateDataset (user) {
        user.dataset.firstname = updateFirstName.value;
        user.dataset.lastname = updateLastName.value;
        user.dataset.email = updateEmail.value;
        user.dataset.job = updateJob.value;  
    };

    const update = (e) => {
        const id = e.target.getAttribute('data-update');
        const user = document.getElementById(`card_${id}`);
        const fullName = user.getElementsByClassName('user-name')[0];
        const email = user.getElementsByClassName('user-info')[0];
        const job = user.getElementsByClassName('user-job')[0];

        updateUserCard(user);
      
        modalUpdate.classList.remove('hide');
        cardContainer.classList.add('blur');

        buttonUpdate.addEventListener('click', () => {
        
            modalUpdate.classList.add('hide');
            cardContainer.classList.remove('blur');
    
            updateRequest(`/api/users/${id}`,userEdit(), (response) => {

                const updateUser = response.target.response;
    
                if (response.target.status === 200) {
                   fullName.innerText = updateUser.fullname;
                   email.innerText = updateUser.email;
                   job.innerText = updateUser.job
                   updateDataset(user);
                } else {
                    console.log('user not update');
                }
            })
        })
    };

    [...buttonsUpdate].forEach((btn) => {
        btn.addEventListener('click', update)
    });

};

function userDelete () {

    function deleteUserCard (id) {
        const userCard = document.getElementById(`card_${id}`);
        userCard.remove()
    };

    const userDelete = (e) => {
        const idDelete = e.target.getAttribute('data-delete');

        deleteRequest(`/api/users/${idDelete}`, (status) => {
            if (status === 204) {
                deleteUserCard(idDelete);
            } else {
                console.log('user not found');
            }
        });
    };

    [...buttonsDelete].forEach((btn) => {
        btn.addEventListener('click',userDelete)
    }); 
};


const addCardsList = (users, template) => {
    let result = '';
    
    users
        .map ((user) => {
            return {
                ...user,
                fullname: `${user.first_name} ${user.last_name}`
            }
        })
        .forEach(user => {
            result += template
                .replaceAll('{{name}}', user.fullname)
                .replaceAll('{{email}}', user.email)
                .replaceAll('{{avatar}}', user.avatar)
                .replaceAll('{{job}}', '')
                .replaceAll('{{user-id}}',`card_${user.id}`)
                .replaceAll('{{data-update}}',user.id)
                .replaceAll('{{data-del}}',user.id)
                .replaceAll('{{data-firstName}}', user.first_name)
                .replaceAll('{{data-lastName}}', user.last_name)
                .replaceAll('{{data-email}}', user.email)
                .replaceAll('{{data-job}}', '')
        });

    cardContainer.innerHTML = result;
};

const addNewUser = (newUser, template) => {
    let result = cardContainer.innerHTML;

    result += template
        .replaceAll('{{name}}', newUser.fullname)
        .replaceAll('{{email}}', newUser.email)
        .replaceAll('{{avatar}}', newUser.avatar)
        .replaceAll('{{job}}', newUser.job)
        .replaceAll('{{user-id}}',`card_${newUser.id}`)
        .replaceAll('{{data-update}}',newUser.id)
        .replaceAll('{{data-del}}',newUser.id)
        .replaceAll('{{data-firstName}}', newUser.first_name)
        .replaceAll('{{data-lastName}}', newUser.last_name)
        .replaceAll('{{data-email}}', newUser.email)
        .replaceAll('{{data-job}}', newUser.job)

    cardContainer.innerHTML = result;
}

function showUserList () {
    let currentPage = 1;
    getUsers(currentPage, (users) => {
        addCardsList(users, cardUserTemplate);
        userDelete();
        userUpdate ();
    });

    buttonNext.addEventListener('click', () => {
        getUsers(++currentPage, (users) => {
            addCardsList(users, cardUserTemplate);
            userDelete();
            userUpdate ();
        })
    });

    buttonPrew.addEventListener('click', () => {
        getUsers(--currentPage, (users) => {
            addCardsList(users, cardUserTemplate);
            userDelete();
            userUpdate ();
        })
    });

    buttonNew.addEventListener('click', () => {
        modalCreate.classList.remove('hide');
        cardContainer.classList.add('blur');
        cardContainer.addEventListener('click', () => {
        modalCreate.classList.add('hide');
        cardContainer.classList.remove('blur');
        });
    })

    buttonCreate.addEventListener('click', () => {
        
        postRequest('/api/users', userCreate(), (response) => {
            const newUser = response.currentTarget.response 
            
            getFirstName.value = getLastName.value = getEmail.value = getJob.value = null;
            modalCreate.classList.add('hide');
            cardContainer.classList.remove('blur');
            addNewUser(newUser, cardUserTemplate);
            userDelete();
            userUpdate();
    
        })
    });
};

buttonLogin.addEventListener ('click',() => {
    postRequest('/api/login',userLogin(), (response) => {
        if (response.target.status > 200){
            loginError.innerText = response.target.response.error
            getPassword.value = null;
        } else {
            loginPage.classList.add('hide');
            userPage.classList.remove('hide');
            showUserList ();
        } 
    });
});



























