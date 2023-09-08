import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import styles from './App.module.scss';
import Home from '../Home/Home';
import ShopPage from '../ShopPage/ShopPage';
import SellerShop from '../SellerShop/SellerShop';
import ItemDetails from '../ItemDetails/ItemDetails';
import Favorites from '../Favorites/Favorites';
import Cart from '../Cart/Cart';
import Checkout from '../Checkout/Checkout';
import OrderHistory from '../OrderHistory/OrderHistory';
import AccountPage from '../AccountPage/AccountPage';
// Wireframe calls it User Profile Page, VSCode file calls it AccountPage here's the alternative
// import UserProfile from '../Users/UserProfile;
import ShopMgmt from '../ShopManagement/ShopManagement';
import NavBar from '../../components/NavBar/NavBar';
import { getUser, signUp } from '../../utilities/users-service';
import AuthModal from '../../components/AuthModal/AuthModal'
import * as ItemsAPI from '../../utilities/items-api'


export default function App() {
  const [user, setUser] = useState(getUser())
  const [cart, setCart] = useState([])
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [activeCat, setActiveCat] = useState('')

  //! categories must either be derived from the items OR we can create a controller on the backend that fetches all categories
  const categories = [
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting"
  ]

  const navigate = useNavigate()
  let location = useLocation()


  // auto log-in as guest user
  useEffect(() => {
    if (!user) {
      createGuestUser()
    }
    async function getItems() {
      const allItems = await ItemsAPI.getAll()
      console.log(allItems)
      setItems(allItems)
    }
    getItems()
  }, [])


  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen)
    console.log('Invoked toggleModal()')
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
    console.log('handleCloseModal invoked')
  }

  async function createGuestUser() {
    const guestUserData = {
      // random email generated
      email: Math.round(Math.random() * 100000000) + '@guest',
      // assign guest name
      name: 'c186ec',
      // set guest password
      password: 'guestpass'
    }
    localStorage.setItem('guest', guestUserData.email)
    const guestUser = await signUp(guestUserData)
    // set user to newly created guest user
    setUser(guestUser)
  }

  // clicking on logo takes you home
  function handleLogoClick() {
    navigate('/home')
  }


  return (
    <main className={styles.App}>
      <AuthModal 
      setUser={setUser}
      isAuthModalOpen={isAuthModalOpen}
      toggleAuthModal={toggleAuthModal}
      handleCloseAuthModal={handleCloseAuthModal}
       />
      <NavBar
        filteredItems={filteredItems}
        setFilteredItems={setFilteredItems}
        items={items}
        className={styles.NavBar}
        user={user}
        cart={cart}
        location={location} />
      <Routes>
        {/* client-side route that renders the component instance if the patch matches the url in the address bar */}
        <Route path="/home" element={<Home items={items} className={styles.Home} categories={categories} setActiveCat={setActiveCat} setCart={setCart} />} />
        <Route path="/shop" element={<ShopPage className={styles.ShopPage} items={items} />} />
        <Route path="/itemdetails/:itemId" element={<ItemDetails setCart={setCart} />} />
        <Route path="/account" element={<AccountPage className={styles.AccountPage} user={user} setUser={setUser} location={location} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart className={styles.Cart} cart={cart} setCart={setCart} />} />
        <Route path="/checkout" element={<Checkout className={styles.Checkout} />} />
        <Route path="/orderhistory" element={<OrderHistory user={user} setUser={setUser} location={location} />} />
        <Route path="/sellershop" element={<SellerShop user={user} setUser={setUser} />} />
        <Route path="/shopmgmt" element={<ShopMgmt user={user} setUser={setUser} />} />
        {/* redirect to /home if path in address bar hasn't matched a <Route> above */}
        <Route path="/*" element={<Navigate to="/home" />} />
      </Routes>
    </main>
  )
}
