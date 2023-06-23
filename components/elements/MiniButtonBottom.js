import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Search from "../ecommerce/Search";

const ButtonBottom = ({ totalCartItems,cartItems }) => {
  const [isToggled, setToggled] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [items, setItems] = useState(0);

  useEffect(() => {
    var articulos = 0
    cartItems.map((i)=>{
      articulos= articulos + i.quantity
    })
    setItems(articulos)
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY >= 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  },[]);

  const handleToggle = () => setToggled(!isToggled);

  return (
    <>
      {totalCartItems > 0 && (
        <div
          className="cart-action text-center d-grid gap-2"
          style={{
            position: "fixed",
            bottom: "5px",
            right: "0%",
            left: "0%",
            "z-index":"1000",
          }}
        >
          <Link href="mobilemenu/shop-cart">
            <a className="btn ">
              <span className="pro-count blue">
                ¡Tienes artículos en tu canasta!
              </span>
            </a>
          </Link>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  totalCartItems: state.cart.length,
  totalCompareItems: state.compare.items.length,
  totalWishlistItems: state.wishlist.items.length,
  cartItems: state.cart,
});

export default connect(mapStateToProps, null)(ButtonBottom);
