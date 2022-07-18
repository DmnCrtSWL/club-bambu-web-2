import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Search from "../ecommerce/Search";

const ButtonBottom = ({ totalCartItems }) => {
  const [isToggled, setToggled] = useState(false);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    console.log(totalCartItems);
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY >= 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });

  const handleToggle = () => setToggled(!isToggled);

  return (
    <>
      {totalCartItems && (
        <div
          className="cart-action text-center d-grid gap-2"
          style={{
            position: "fixed",
            bottom: "0",
            right: "0%",
            left: "0%",
          }}
        >
          <Link href="/shop-cart">
            <a className="btn ">
              <i className="fi-rs-shopping-bag mr-10"></i>
              <span className="pro-count blue">
                Artículos en Carrito de compras : {totalCartItems}
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
});

export default connect(mapStateToProps, null)(ButtonBottom);
