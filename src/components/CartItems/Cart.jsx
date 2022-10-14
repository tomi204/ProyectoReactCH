import React, { useContext } from "react";
import "./Cart.css";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DataContext } from "../context";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import Web3 from "web3";
import { useAccount, useSendTransaction } from "wagmi";
import { ethers } from "ethers";
const Cart = () => {
  const connection = new ethers.providers.JsonRpcBatchProvider("");
  const { address } = useAccount();
  // data context from context
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
  const total = calcTotal().toString();
  const gasPrice = connection.getGasPrice();
  const recipient = "0xe2Ee704E662F320Ae75f92E1585c779bF1244554";
  const tx = {
    request: {
      from: address,
      to: recipient,
      value: ethers.utils.parseUnits(total("ether")),
      gasPrice: gasPrice,
    },
    onSuccess: (txHash) => {
      console.log("Transaction sent", txHash);
    },
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
            <div className="buy-div">
              <h3>total: ${calcTotal(totalQtty)}</h3>
              <br />

              <button className="btn-buy" onClick={tx}>
                comprar
              </button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Cart;
