import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";
import { toast } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
import { MdError } from "react-icons/md";
import MiniButtonBottom from "../../components/elements/MiniButtonBottom";
import getProducts from "../../util/getProducts";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import { connect } from "react-redux";
const ProductsMobileMenu = ({
  cartItems,
  addToCompare,
  addToCart,
  addToWishlist,
  increaseQuantity,
  decreaseQuantity,
  quickView,
}) => {
  const router = useRouter();
  const { id, title, slug, idProducts } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async()=>{
    const busqueda = await getProducts.getProductsComplete();
    setProducts(busqueda)
    console.log(busqueda)
    setLoading(false)
  }

  const handleCart = (product) => {
    const inCart = cartItems.find((cartItem) => cartItem.id === product.id);
    if (inCart){
      console.log('En contrado')
      addToCart({...product, quantity: inCart.quantity+1});
      toast.success(`Tienes ${inCart.quantity} artículos de ${product.name} en tu carrito!`);
    }
    else{
      addToCart({...product, quantity: 1});
      toast.success(`Agregaste ${product.name} a tu carrito!`);
    }
  };

  useEffect(() => {
    getData();
  }, [idProducts]);

  return (
    <>
      {loading ?
      (
        <div className="col-12 ">
          <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
            <BeatLoader color={"#325454"} size={10} className="mb-10" />
            <h4 className="text-center text-xs">
              Cargando productos de {title}
            </h4>
          </div>
        </div>
      ):(
        <>
          {products ? (
            <>
              {products.map((l, i) => (
                <div key={i} className="col-lg-12 col-md-12 col-12 col-sm-12">
                  <div className="product-cart-wrap-mobile mb-30">
                    <div className="row product-content-wrap">
                    <div className="col product-img-action-wrap">
                      <div className="product-img product-img-zoom">
                          <a>
                            <img
                              className="default-img"
                              src={l.imageUrl}
                              alt=""
                            />
                          </a>
                      </div>
                    </div>
                    <div className="col product-content-wrap">
                      <div className="row">
                        <div className="col">
                          <div className="product-category">
                            <a>{/*l.googleItemCondition*/}</a>
                          </div>
                          <h2>
                            <a>{l.name}</a>
                          </h2>
                        </div>
                        <div className="col">
                          <div className="product-extra-link2">
                            <button
                              onClick={(e) => {
                                handleCart(l);
                              }}
                              className="button button-add-to-cart"
                            >
                              <strong>+</strong>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="col-12 ">
              <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
                <MdError size={40} className="mb-5" />
                <h4 className="text-center text-xs">
                  No hay productos de {title}
                </h4>
              </div>
            </div>
          )}
        </>
      )}
      <MiniButtonBottom />
    </>
  );
};


const mapStateToProps = (state) => ({
  cartItems: state.cart,
});

const mapDispatchToProps = {
  addToCompare,
  addToWishlist,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsMobileMenu);