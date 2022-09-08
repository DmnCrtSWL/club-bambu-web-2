import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { openQuickView } from "../../redux/action/quickViewAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import Loader from "./../elements/Loader";

const SingleProduct = ({
  product,
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
  onClick,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);


  return (
    <>
      {!loading ? (
        <>
        {console.log(product)}
          <div className="product-cart-wrap mb-30">
            <div className="product-img-action-wrap">
              <div className="product-img product-img-zoom">
                  <a onClick={()=>onClick(product)} >
                    <img
                      className="default-img"
                      src={product.imageUrl}
                      alt=""
                    />
                  </a>
              </div>
            </div>
            <div className="product-content-wrap">
              <div className="product-category">
                  <a>{product.googleItemCondition}</a>
              </div>
              <h2>
                  <a onClick={()=>onClick(product)}>{product.name}</a>
              </h2>
              <div className="product-price">
                <span>${product.price} </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

const mapDispatchToProps = {
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
};

export default connect(null, mapDispatchToProps)(SingleProduct);
