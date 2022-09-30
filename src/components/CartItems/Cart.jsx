import React, { useContext } from "react";
import "./Cart.css";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DataContext } from "../context";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import Web3 from "web3";
import { useState } from "react";
const Cart = () => {
  // data context from context
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  const {
    CartItem,
    setCartItem,
    addToCart,
    decreaseQty,
    deleteQty,
    count,
    setCount,
    calcTotal,
    totalQtty,
    account,
    setAccount,
    setButtonText,
    buttonText,
  } = useContext(DataContext);
  function createProduct(id, tittle, cover, desc, price, stock, category) {
    let product = {
      id,
      tittle,
      cover,
      desc,
      price,
      stock,
      category,
    };
    addToCart(product);
  }

  function decreaseProduct(id, tittle, cover, desc, price, stock, category) {
    let product = {
      id,
      tittle,
      cover,
      desc,
      price,
      stock,
      category,
    };
    decreaseQty(product);
  }

  const order = {
    buyer: {
      name: "Juan",
      phone: "221456789",
      email: "juandoscuatro@gmail.com",
      addres: "Calle falsa 123",
    },
    items: CartItem.map((product) => ({
      id: product.id,
      title: product.tittle,
      price: product.cover,
      quantity: product.qty,
    })),
    total: calcTotal(),
  };
  const refreshPage = () => {
    window.location.reload(true);
  };
  const createOrder = () => {
    const db = getFirestore();
    const ordersC = collection(db, "ordersEcommerce");
    addDoc(ordersC, order).then(({ id }) =>
      alert("tu numero de orden es " + id)
    );
  };

  const sendTransaction = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
              value: web3.utils.toHex(
                web3.utils.toWei(calcTotal().toString(), "ether")
              ),
              gas: "0x5208",
            },
          ],
        })
        .then((result) => {
          setButtonText("Transaction sent");
        })
        .catch((error) => {
          setButtonText("Transaction error");
        });
    }
  };

  return (
    <div className="cartTittle">
      <Container className="containerProds">
        {CartItem.length == 0 ? (
          <div className="vacio">
            <h2>Tu carrito esta vacio</h2>
            <Link to={"../Productos"}>Ir a productos</Link>
          </div>
        ) : (
          <>
            {CartItem.map((item) => (
              <div className="item-products" key={item}>
                <h3>{item.tittle}</h3>
                <img src={item.desc} alt="" className="cart-Item-Image" />
                <br></br>
                <button
                  className="btnA"
                  onClick={() =>
                    createProduct(
                      item.id,
                      item.tittle,
                      item.price,
                      item.cover,
                      item.category,
                      item.stock,
                      item.desc
                    )
                  }
                >
                  +
                </button>
                <button
                  className="btnN"
                  onClick={() =>
                    decreaseProduct(
                      item.id,
                      item.tittle,
                      item.price,
                      item.cover,
                      item.category,
                      item.stock,
                      item.desc
                    )
                  }
                >
                  -
                </button>
                <h2 className="contador">{item.qty}</h2>
                <h2>${item.qty * item.cover}</h2>
                <button className="eliminar" onClick={() => deleteQty(item.id)}>
                  eliminar producto
                </button>
              </div>
            ))}
            <h3>total: ${calcTotal(totalQtty)}</h3>
            <br />

            <button className="btn-M" onClick={sendTransaction}>
              comprar
            </button>
          </>
        )}
      </Container>
    </div>
  );
};

export default Cart;
