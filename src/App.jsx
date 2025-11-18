import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [userPsw, setUserPsw] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [userMenu, setUserMenu] = useState(false);
  const [userReg, setUserReg] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartMenu, setCartMenu] = useState(false);
  const [paswEye, setPaswEye] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user-reg"));
    if (savedUser) {
      setUserReg(true);
      setUserName(savedUser.userName);
      setUserEmail(savedUser.userEmail);
    }
  }, []);

  useEffect(() => {
    fetch("https://69198b479ccba073ee933bd9.mockapi.io/users")
      .then((res) => res.json())
      .then((json) => setUsers(json))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("https://fakestoreapiserver.reactbd.org/api/products")
      .then((res) => res.json())
      .then((json) => setProducts(json.data))
      .catch((err) => console.error(err));
  }, []);

  const regFunction = (e) => {
    e.preventDefault();

    const userExists = users.some((u) => u.userEmail === userEmail);
    if (userExists) {
      alert("This email is already used");
      return;
    }

    fetch("https://69198b479ccba073ee933bd9.mockapi.io/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName,
        userEmail,
        userPasw: userPsw,
      }),
    })
      .then((res) => res.json())
      .then((newUser) => {
        setUsers([...users, newUser]);
        setUserReg(true);
        setUserName(newUser.userName);

        localStorage.setItem(
          "user-reg",
          JSON.stringify({
            userName: newUser.userName,
            userEmail: newUser.userEmail,
          })
        );
      })
      .catch((err) => console.error(err));
  };

  const logFunction = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.userEmail === userEmail && u.userPasw === userPsw
    );

    if (!user) {
      alert("Wrong email or password");
      return;
    }

    setUserReg(true);
    setUserName(user.userName);

    localStorage.setItem(
      "user-reg",
      JSON.stringify({
        userName: user.userName,
        userEmail: user.userEmail,
      })
    );
  };

  const logout = () => {
    setUserReg(false);
    setUserMenu(false);
    localStorage.removeItem("user-reg");
  };

  useEffect(() => {
    if (userMenu || cartMenu) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [userMenu, cartMenu]);

  return (
    <>
      {userReg ? (
        <>
          <header>
            <h1 className="web-logo">
              <span>Space</span>Shop.uz
            </h1>
            <ol>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Products</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ol>
            <div className="icons">
              <i
                onClick={() => setUserMenu(!userMenu)}
                className="fa-solid fa-user-astronaut"
              ></i>
              <i
                onClick={() => setCartMenu(!cartMenu)}
                className="fa-solid fa-cart-arrow-down"
              ></i>
              <div
                style={
                  cart.length == 0 ? { display: "none" } : { display: "flex" }
                }
                className="cart-num"
              >
                {cart.length}
              </div>
            </div>
          </header>

          <div
            style={userMenu ? { display: "flex" } : { display: "none" }}
            className="profile-menu"
          >
            <div className="profile-window">
              <button
                className="profile-close-btn"
                onClick={() => setUserMenu(false)}
              >
                &times;
              </button>

              <div className="profile-top">
                <div className="profile-avatar">
                  <i className="fa-solid fa-user-astronaut"></i>
                </div>

                <h2 className="profile-name">{userName}</h2>
                <p className="profile-email">{userEmail}</p>

                <button className="profile-edit-btn">
                  <i className="fa-solid fa-pen"></i> Edit profile
                </button>
              </div>

              <div className="profile-info-block">
                <h3>Account Info</h3>
                <ul>
                  <li>
                    <span>Full Name:</span>
                    <p>{userName}</p>
                  </li>
                  <li>
                    <span>Email:</span>
                    <p>{userEmail}</p>
                  </li>
                  <li>
                    <span>Account Level:</span>
                    <p>Basic</p>
                  </li>
                </ul>
              </div>

              <div className="profile-actions">
                <button className="profile-btn">
                  <i className="fa-solid fa-gear"></i> Settings
                </button>
                <button className="profile-btn">
                  <i className="fa-solid fa-heart"></i> Favorites
                </button>
                <button className="profile-btn logout-btn" onClick={logout}>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> Log
                  Out
                </button>
              </div>
            </div>
          </div>

          <div
            style={cartMenu ? { display: "flex" } : { display: "none" }}
            className="cart-window"
          >
            <div className="cart-menu">
              <button
                className="cart-close-btn"
                onClick={() => setCartMenu(false)}
              >
                &times;
              </button>

              <ol className="products-list">
                <h3 className="cart-big-text">My Cart : </h3>
                {cart.map((product, index) => (
                  <li key={index}>
                    <img src={product.image} alt={product.title} />
                    <h2>
                      {product.title} <br /> <span>{product.desc}</span>
                    </h2>
                    <div className="cart-product-right">
                      <p className="price">${product.price}</p>

                      <div className="more-or-less">
                        <button className="less-btn">-</button>
                        <span>{1}</span>
                        <button className="more-btn">+</button>
                      </div>

                      <button className="delete-btn">
                        <i className="fa-solid fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ol>


              <div className="cart-footer">
                <h2 className="total-price">
                  Total:
                 <span> ${cart
                    .reduce((total, product) => total + product.price, 0)
                    .toFixed(2)}</span>
                </h2>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </div>
          </div>

          <main onClick={() => setUserMenu(false)}>
            <section className="sect-1">
              <h2>11.11</h2>
              <p>
                new <span>discounts</span> until November 18!
              </p>
              <button>more details</button>
            </section>

            <section className="products">
              {products.map((product) => (
                <div key={product._id} className="product">
                  <div className="image">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <p className="price">${product.price}</p>
                  <h2 className="title">{product.title}</h2>

                  <div className="types">
                    <p
                      className="class"
                      id={
                        product.category === "women"
                          ? "woman"
                          : product.category === "men"
                          ? "man"
                          : "other"
                      }
                    >
                      {product.category}
                    </p>
                    <p className="type">{product.type}</p>
                  </div>

                  <p className="rating">
                    {Array(Math.round(product.rating))
                      .fill(0)
                      .map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    <span className="stock">({product.stock})</span>
                  </p>

                  <button
                    onClick={() =>
                      setCart([
                        ...cart,
                        {
                          image: product.image,
                          title: product.title,
                          price: product.price,
                          desc: product.description,
                          qty: 1,
                        },
                      ])
                    }
                  >
                    Add To Cart <i className="fa-solid fa-cart-arrow-down"></i>
                  </button>
                </div>
              ))}
            </section>
          </main>

          <footer onClick={() => setUserMenu(false)}>
            <div className="footer-links">
              <h3>Navigation</h3>
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Products</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-logo">
              <h1>
                <span>Space</span>Shop.uz
              </h1>
              <p>Your cosmic marketplace</p>
            </div>

            <div className="footer-social">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <i className="fa-brands fa-telegram"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-youtube"></i>
              </div>
            </div>
          </footer>
        </>
      ) : (
        <div className="reg-menu">
          {showLogin ? (
            <form onSubmit={logFunction} className="reg-box">
              <div className="reg-logo">
                <h1>
                  <span>Space</span>Shop.uz
                </h1>
              </div>

              <h2>Log In</h2>

              <input
                onChange={(e) => setUserEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="reg-input"
                required
              />

              <input
                onChange={(e) => setUserPsw(e.target.value)}
                type="password"
                placeholder="Password"
                className="reg-input"
                required
                maxLength={6}
              />

              <button type="submit" className="reg-btn">
                Continue
              </button>

              <p className="switch-text">
                Don't have an account?
                <span onClick={() => setShowLogin(false)}> Create one</span>
              </p>
            </form>
          ) : (
            <form onSubmit={regFunction} className="reg-box">
              <div className="reg-logo">
                <h1>
                  <span>Space</span>Shop.uz
                </h1>
              </div>

              <h2>Create Account</h2>

              <input
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="Full Name"
                className="reg-input"
                required
              />

              <input
                onChange={(e) => setUserEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="reg-input"
                required
              />

              <input
                onChange={(e) => setUserPsw(e.target.value)}
                type="password"
                placeholder="Password"
                className="reg-input"
                required
                maxLength={6}
              />

              <button type="submit" className="reg-btn">
                Register
              </button>

              <p className="switch-text">
                Already have an account?
                <span onClick={() => setShowLogin(true)}> Log In</span>
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}

export default App;
