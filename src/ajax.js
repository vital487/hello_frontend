import { getCookie } from './lib';

//export let linkApi = "https://localhost:444"
export let linkApi = "https://hellochat.ddns.net:444"

export async function login(auth) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(auth)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function register(user) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    if (resposta.status === 201)
        return await resposta.json();
    else
        throw resposta;
}

export async function validateToken(token) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/validatetoken",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    if (resposta.ok)
        return;
    else
        throw resposta;
}

export async function search(name) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/search",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(name)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function getRelationship(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/relationship/" + id,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getCookie("token")
            }
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function addContact(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/addcontact",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(id)
        }
    );

    if (resposta.status === 201)
        return await resposta.json();
    else
        throw resposta;
}

export async function removeContact(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/removecontact",
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(id)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function acceptRequest(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/acceptrequest",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(id)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function declineRequest(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/declinerequest",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(id)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function setAlias(info) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/setalias",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(info)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function setColor(info) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/setcolor",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(info)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function getRequests() {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/requests",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getCookie("token")
            }
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function getMyself() {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/myself",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getCookie("token")
            }
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function updateMyself(user, file) {
    let resposta;
    //let form = new FormData();

    //form.append("file", file);
    //form.append("user", JSON.stringify(user));

    resposta = await fetch(
        linkApi + "/api/updatemyself",
        {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + getCookie("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    if (resposta.ok)
        return resposta;
    else
        throw resposta;
}

export async function searchById(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/search/" + id,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getCookie("token")
            }
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function getContacts() {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/contacts",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getCookie("token")
            }
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function getContactMessageInfo() {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/contactmessageinfo",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getCookie("token")
            }
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function getContactMessageInfoId(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/contactmessageinfo/" + id,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getCookie("token")
            }
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function getMessages(info) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/messages",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token")
            },
            body: JSON.stringify(info)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function getContactColor(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/contact/" + id + "/colors",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getCookie("token")
            }
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function isOnline(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/online/" + id,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + getCookie("token")
            }
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function sendMessage(message) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/sendmessage",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + getCookie("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function setReceiveMessages(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/receivemessages",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + getCookie("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(id)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}

export async function setReadMessages(id) {
    let resposta;

    resposta = await fetch(
        linkApi + "/api/readmessages",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + getCookie("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(id)
        }
    );

    if (resposta.ok)
        return await resposta.json();
    else
        throw resposta;
}