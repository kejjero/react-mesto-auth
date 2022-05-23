import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import {useEffect, useState} from "react";
import api from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {userContext} from "../utils/utils"
import {Routes, Route} from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import * as auth from "../utils/auth"

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({})
    const [currentUser, setCurrentUser] = useState(userContext)
    const [cards, setCards] = useState([])
    const [cardToRemove, setCardToRemove] = useState({})
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        email: ''
    })

    useEffect(() => {
        Promise.all([api.getUserInfo(), api.getCards()])
            .then(([userData, cardsData]) => {
                setCurrentUser(userData)
                setCards(cardsData)
            })
            .catch((err) => {
                alert(err)
            })
    }, [])

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }

    function handleDeleteCardClick() {
        setIsDeleteCardPopupOpen(true)
    }

    function handleCardClick(selectedCard) {
        setSelectedCard(selectedCard)
    }

    // Закрытие всех попапов
    function closeAllPopups() {
        setIsEditProfilePopupOpen(false)
        setIsAddPlacePopupOpen(false)
        setIsEditAvatarPopupOpen(false)
        setIsDeleteCardPopupOpen(false)
        setSelectedCard({})
        setCardToRemove({})
    }

    // функция лайка карточки
    function handleCardLike(card) {
        // Ищем айди пользователя в массиве лайкнувших карточку
        const isLiked = card.likes.some(item => item._id === currentUser._id);
        if (isLiked) {
            api.deleteLike(card._id)
                .then((res) => {
                    setCards((cards) =>
                        cards.map((item) => (item._id === card._id ? res : item)))
                })
                .catch((err) => {
                    alert(err)
                })
        } else {
            api.addLike(card._id)
                .then((res) => {
                    setCards((cards) =>
                        cards.map((item) => (item._id === card._id ? res : item)))
                })
                .catch((err) => {
                    alert(err)
                })
        }
    }

    // Открытие попапа с получением нужной для удаления карточки
    function confirmDeleteCard(card) {
        handleDeleteCardClick();
        setCardToRemove(card);
    }

    // запрос на удаление карточки
    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(
                setCards((cards) =>
                    // исключаем удаленную карточку из нового массива карточек
                    cards.filter((item) => (item._id !== card._id))

                ), closeAllPopups()
            )
            .catch((err) => {
                alert(err)
            })
    }

    // запрос на апдейт профиля пользователя с новыми данными
    function handleUpdateUser({name, description}) {
        api.editProfile(name, description)
            .then((res) => setCurrentUser(res), closeAllPopups())
            .catch((err) => {
                alert(err)
            })
    }

    // запрос на апдейт аватара пользователя с новой картинкой
    function handleUpdateAvatar({avatar}) {
        api.editAvatar(avatar)
            .then((res) => setCurrentUser(res), closeAllPopups())
            .catch((err) => {
                alert(err)
            })
    }

    // запрос на добавление новой карточки
    function handleAddPlaceSubmit({namePlace, linkPlace}) {
        api.sendCard(namePlace, linkPlace)
            .then((newCard) => setCards([newCard, ...cards]), closeAllPopups())
            .catch((err) => {
                alert(err)
            })
    }

    // АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ


    function handleRegister(email, password) {
        auth.register(password, email)
            .then(response => {
                console.log('register', response)

            })
    }

    function handleLogin(email, password) {
        auth.login(password, email)
            .then(response => {
                console.log('login: ', response)
                if (response) {
                    setIsLoggedIn(true)
                    localStorage.setItem('token', response.token)
                }
            })
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Header isLoggedIn={isLoggedIn}/>
            <Routes>
                <Route exact path='/sign-up' element={<Register onRegister={handleRegister}/>}/>
                <Route exact path='/sign-in' element={<Login onLogin={handleLogin}/>}/>
                <Route path='/' element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <Main
                            openEditProfile={handleEditProfileClick}
                            openAddPlace={handleAddPlaceClick}
                            openAvatar={handleEditAvatarClick}
                            openDeleteCard={handleDeleteCardClick}
                            onCardClick={handleCardClick}
                            onCardLike={handleCardLike}
                            onCardDelete={confirmDeleteCard}
                            cards={cards}
                        />
                        <Footer/>
                    </ProtectedRoute>
                }
                />
            </Routes>
            <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
            />
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
            />
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddCard={handleAddPlaceSubmit}
            />
            <ConfirmDeletePopup
                isOpen={isDeleteCardPopupOpen}
                onClose={closeAllPopups}
                card={cardToRemove}
                onSubmitDelete={handleCardDelete}
            />
        </CurrentUserContext.Provider>
    )
}

export default App;
