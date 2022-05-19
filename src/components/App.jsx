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
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import {userContext} from '../utils/utils'

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({})
    const [currentUser, setCurrentUser] = useState(userContext)
    const [cards, setCards] = useState([])
    const [cardToRemove, setCardToRemove] = useState({})

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

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Header/>
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
            <Footer/>
        </CurrentUserContext.Provider>
    )
}

export default App;
