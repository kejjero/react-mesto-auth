const BASE_URl = 'https://auth.nomoreparties.co'

// запрос на регистрацию
export const register = (password, email) => {
    return fetch(`${BASE_URl}/signup`,{
        method : "POST",
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify ({password, email})
    })
        .then(response => checkResponse(response))
}

// запрос на авторизацию
export const login = (password, email) => {
    return fetch(`${BASE_URl}/signin`,{
        method : "POST",
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body : JSON.stringify ({password, email})
    })
        .then(response => checkResponse(response))
}

const checkResponse = (response) => {
    try {
        if (response.ok) {
            console.log('register: ', response)
            return response.json()
        }
    }  catch (error) {
        return alert(error)
    }
}