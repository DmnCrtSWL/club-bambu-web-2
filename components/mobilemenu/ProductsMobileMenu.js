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
import Modal from "../layout/Modal";
//import {Modal} from 'react-responsive-modal';
import { useModal } from "../../hooks/useModal";
import { size } from "lodash";
import Radio from '@mui/material/Radio';
import RadioGroup, {useRadioGroup} from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { it } from "date-fns/locale";

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
      setMobileMenu(true);
    }else {
      setMobileMenu(false);
    }
  }

  const getData = async()=>{
    const busqueda = await getProducts.getProductsComplete();
    setProducts(busqueda)
    const cat = await ecwid.getCategories({productIds:true, parent: 0});
    setCategorias(cat.items)
    //console.log(busqueda)
    //console.log(cat.items)
    setLoading(false)
  }

  const handleCart = (product) => {
    const inCart = cartItems.find((cartItem) => cartItem.id === product.id);
    if (inCart){
      //console.log('En contrado')
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

  //_____________________________________________________________________________________________________Modal
  const [producto,setProducto]=useState({});
  const setOptionsModal=(product)=>{
    setProducto(product)
    openModalOptions();
  }

  const [isOpenModalOptions, openModalOptions, closeModalOptions] = useModal(false);

  const ModalOptions =({isOpenModalOptions, closeModalOptions, openModalOptions, producto}) => {
    const [options,setOptions] = useState([]);

    const handleSubmit=(e)=>{
      e.preventDefault();
    }
    
    const handleRadioChange = (event) => {
      if(options.length > 0){
        options.map((opcion)=>{
          if(opcion.name === event.target.name){
            let newArray = options.filter(item => item !== opcion)
            newArray.push({ name: event.target.name , value: event.target.value})
            setOptions(newArray)
          }
          else{
            setOptions([...options,{ name: event.target.name , value: event.target.value}])
          }
        })
      }else{
        setOptions([...options,{ name: event.target.name , value: event.target.value}])
      }

      options.map(o=>{toast.success(o.name)})
    };

    return(
      <Modal isOpen={isOpenModalOptions} closeModal={closeModalOptions} openModal={openModalOptions} >
        <h1>Selecciona las Opciones disponibles</h1>
        <br/>
        {size(producto.options) > 0 && (
          <div>
            <form onSubmit={handleSubmit}>
              <FormControl>
                {producto.options.map((opcion, i)=> (
                  <div key={i}>
                    {console.log('Datos de la opcion:')}
                    {console.log(opcion)}
                    <h4><strong className="mr-10">{opcion.name}</strong></h4>
                    <br/>
                    {(opcion.type === 'TEXTFIELD') && (
                        <textarea />
                    )} 
                    <RadioGroup
                      name={opcion.name}
                      onChange={handleRadioChange}
                    >
                      {size(opcion.choices)>0 &&
                        opcion.choices.map(o => (
                          <FormControlLabel value={o.text} control={<Radio />} label={o.text} />
                        ))
                      }
                    </RadioGroup>
                    <br />
                  </div>
                ))}
              </FormControl>
            </form>
          </div>
        )}
        <button type="submit">Añadir a Carrito</button>
        
      </Modal>
    )
  }

  //______________________________________________________________________________________________________________________________________________________

  return (
    <>
      <ModalOptions 
        isOpenModalOptions={isOpenModalOptions} 
        closeModalOptions={closeModalOptions} 
        openModalOptions={openModalOptions} 
        producto={producto} 
      />
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
                                    {(l.options.length)>0 ? 
                                      <div className="col text-right mt-10">
                                        <button
                                          onClick={(e) => {
                                            setOptionsModal(l);}}
                                          className="button button-add-to-cart-mobile"
                                       >
                                          <i className="fi-rs-plus "/>
                                        </button>
                                      </div>
                                      :
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
                                    }
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