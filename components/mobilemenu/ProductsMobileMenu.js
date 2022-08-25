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
} from "../../redux/action/cart";
import { connect } from "react-redux";
import { getOffsetTop } from "@mui/material";

const ProductsMobileMenu = ({
  cartItems,
  addToCart,
  quickView,
}) => {
  const router = useRouter();
  const { id, title, slug, idProducts } = router.query;
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false)

  const changeMenuMobile = () =>{
    if(window.scrollY >= 260){
      console.log(`cambiando menu`)
      setMobileMenu(true);
    }else {
      setMobileMenu(false);
    }
    console.log(`Scroll Y : ${window.scrollY}`)
  }

  const getData = async()=>{
    const busqueda = await getProducts.getProductsComplete();
    setProducts(busqueda)
    const cat = await ecwid.getCategories({productIds:true, parent: 0});
    setCategorias(cat.items)
    console.log(busqueda)
    console.log(cat.items)
    setLoading(false)
  }

  const handleCart = (product) => {
    if(product.options.length > 0) {
      toast.success('hay opciones Para desplegar El Modal')
    }

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
    window.addEventListener('scroll',changeMenuMobile);
    getData();
  }, []);

  return (
    <>
      {loading ?
      (
        <div className="col-12">
          <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
            <BeatLoader color={"#325454"} size={10} className="mb-10" />
            <h4 className="text-center text-xs">
              Cargando productos de {title}
            </h4>
          </div>
        </div>
      ):(
        <>
          {categorias && (
            <>
              <div className="relative flex items-center ">
                <div
                  id ="sliderMobileMenu"
                  className={mobileMenu ? 
                    'sliderMobileMenuFixed w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'
                    :'sliderMobileMenu w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'}
                >
                  {categorias.map((c,i) =>(
                    <div
                      key={i}
                      className="item-list w-[210px] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300"
                    >
                      <div className="flex-row text-center" id="item-list">
                        <a 
                          className="font-bold"
                          href={`#${c.id}`}
                          key={c.id}
                        > 
                          {c.name} 
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          
              {products ? (
                <>
                  {categorias.map((categoria)=> ( 
                    <section className="" id={categoria.id} >
                      <div className="container mt-15 mb-5 text-center">
                        <h2>{categoria.name}</h2>
                      </div>
                      
                      {products.map((l, i) => (
                        <div>
                          {l.defaultCategoryId === categoria.id && (
                            <div key={`product${i}`} className="col-lg-12 col-md-12 col-12 col-sm-12">
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
                                      <a>{`$ ${l.price}`}</a>
                                    </div>
                                    <h2>
                                      <a>{l.name}</a>
                                    </h2>
                                    {l.description &&
                                      <p>
                                        {l.description.slice(3,-4)}
                                      </p>
                                    }
                                    <div className="col text-right mt-10">
                                      <button
                                        onClick={(e) => {
                                          handleCart(l);
                                        }}
                                        className="button button-add-to-cart-mobile"
                                      >
                                        <i className="fi-rs-plus "/>
                                      </button>
                                    </div>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      )}
                      </div>
                      ))}
                    </section>
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
  addToCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsMobileMenu);