import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import BrandFilter from "../../components/ecommerce/BrandFilter";
import CategoryProduct from "../../components/ecommerce/CategoryProduct";
import Pagination from "../../components/ecommerce/Pagination";
import PriceRangeSlider from "../../components/ecommerce/PriceRangeSlider";
import QuickView from "../../components/ecommerce/QuickView";
import ShowSelect from "../../components/ecommerce/ShowSelect";
import SingleProductPlaneer from "../../components/ecommerce/SingleProductPlaneer";
import SizeFilter from "../../components/ecommerce/SizeFilter";
import SortSelect from "../../components/ecommerce/SortSelect";
import WishlistModal from "../../components/ecommerce/WishlistModal";
import LifeStyleFilter from "../../components/lifestyle/Filter"
import Layout from "../../components/layout/Layout";
import { fetchProduct } from "../../redux/action/product";
import Link from "next/link";
import ecwid from "../../util/ecwid";
import { size } from "lodash";
import getProducts from "../../util/getProducts";
import { toast } from "react-toastify";

const Products = ({ products, productFilters, fetchProduct }) => {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [active, setActive] = useState('1');
  const [desayuno, setDesayuno] = useState([]);
  const [comida, setComida] = useState([]);
  const [cena, setCena] = useState([]);
  const [market, setMarket] = useState([]);
  const [pedidoDiario, setPedidoDiario] = useState([]);
  const [bandera, setBandera]=useState(0);

  const changeTab = (numberTab)=>{
    if(active !== numberTab){
      setActive(numberTab)
    }
  }

  useEffect(() => {
    (async () => {
      const busqueda = await getProducts.getProductsComplete();
      const categoria = await ecwid.getCategories({parent:0, productIds : true});
      const comida ={}
      const desayuno ={}
      const cena = {}
      const market = {}
      setProductos(busqueda)
      categoria.items.map((categoria) => {
        if (categoria.name === 'Comidas')
          comida = categoria
        else if (categoria.name === 'Desayunos')
          desayuno = categoria
        else if (categoria.name === 'Market')
          market = categoria
      });
      cena = comida //
      const filtro = [];
      //const filtro = busqueda
      busqueda.map((producto)=>{
        if(comida.productIds.includes(producto.id))
        filtro.push(producto)
      })
      console.log('Productos')
      const filtroCalorias = [];
      if(productFilters.calories != 0 && productFilters.foods != 0){
        const calculo = productFilters.calories / productFilters.foods
        console.log(`Calculo por comida: ${calculo} kcal`)
         filtro.map((producto)=>{
          if(producto.attributes.length > 0){
            producto.attributes.map((atributo) =>{
              if(atributo.name === 'Contenido Energético (kcal)')
              {
                if(atributo.value <= calculo + 20){
                  filtroCalorias.push(producto)
                }
              }
            })}
          })
        setComida(filtroCalorias)
        setCena(filtroCalorias)
      }else {
        setComida(filtro)
        setCena(filtro)
      }

      filtro = [];
      //const filtro = busqueda
      busqueda.map((producto)=>{
        if(desayuno.productIds.includes(producto.id))
        filtro.push(producto)
      })
      filtroCalorias = [];
      if(productFilters.calories != 0 && productFilters.foods != 0){
        const calculo = productFilters.calories / productFilters.foods
        console.log(`Calculo por comida: ${calculo} kcal`)
         filtro.map((producto)=>{
          if(producto.attributes.length > 0){
            producto.attributes.map((atributo) =>{
              if(atributo.name === 'Contenido Energético (kcal)')
              {
                if(atributo.value <= calculo + 20){
                  filtroCalorias.push(producto)
                }
              }
            })}
          })
        setDesayuno(filtroCalorias)
      }else{
        setDesayuno(filtro);
      }

      filtro = [];
      //const filtro = busqueda
      busqueda.map((producto)=>{
        if(market.productIds.includes(producto.id))
        filtro.push(producto)
      })
      filtroCalorias = [];
      if(productFilters.calories != 0 && productFilters.foods != 0){
        const calculo = productFilters.calories / productFilters.foods
        console.log(`Calculo por comida: ${calculo} kcal`)
         filtro.map((producto)=>{
          if(producto.attributes.length > 0){
            producto.attributes.map((atributo) =>{
              if(atributo.name === 'Contenido Energético (kcal)')
              {
                if(atributo.value <= calculo + 20){
                  filtroCalorias.push(producto)
                }
              }
            })}
          })
        setMarket(filtroCalorias)
      }else{
        setMarket(filtro);
      }

    })();
  }, [productFilters]);

  function handleClick(producto){
    let auxBandera = 0;
    if(size(pedidoDiario) > 0){
      pedidoDiario.map(pedido=>{
        if(pedido.name === producto.name){
          auxBandera = 1;
        }
      })
      if(auxBandera === 0 && (productFilters.foods > size(pedidoDiario))){
        setPedidoDiario([...pedidoDiario, producto])
        toast.success(`Agregado ${producto.name} en tu pedido del día!`);
      }else if(auxBandera !== 0){
        let newArray = pedidoDiario.filter(pedido => pedido.name !== producto.name)
        toast.success(`Eliminando ${producto.name} de tu pedido Diario!`)
        setPedidoDiario(newArray)
      }
    }else{
      setPedidoDiario([...pedidoDiario, producto])
      toast.success(`Agregado ${producto.name} en tu pedido del día!`);
    }
  }

  return (
    <>
      <Layout parent="Inicio" sub="Productos" >
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                  <LifeStyleFilter />
              </div> 

              <div className="tab-header">
                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={active ==="1" ? "nav-link active" : "nav-link"}
                      onClick={()=>changeTab("1")}
                    >
                      Desayunos
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className={active ==="2" ? "nav-link active" : "nav-link"}
                      onClick={()=>changeTab("2")}
                    >
                      Comidas
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className={active ==="3" ? "nav-link active" : "nav-link"}
                      onClick={()=>changeTab("3")}
                    >
                      Cenas
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className={active ==="4" ? "nav-link active" : "nav-link"}
                      onClick={()=>changeTab("4")}
                    >
                      Snacks
                    </button>
                  </li>
                </ul>
              </div>


              <div className="tab-content wow fadeIn animated">

                <div className={ active ==="1" ? "tab-pane fade show active" : "tab-pane fade"}>
                  Esto en un div de Desayunos
                  <div className="product-grid-4 row">
                    <div className="col-lg-12">
                      <div className="shop-product-fillter">
                        <div className="totall-product">
                          <p>
                            Hemos encontrado
                            <strong className="text-brand">{size(desayuno)}</strong>
                            productos para ti!
                          </p>
                        </div>
                      </div>
                      <div className="row product-grid-3">
                        {size(desayuno) === 0 && (
                          <h3>No se han encontrado productos para {desayuno.name} </h3>
                        )}
                        {size(desayuno) > 0 && (
                          <>
                            {desayuno.map((l, i) => (
                              <div
                                className="col-lg-3 col-md-4 col-12 col-sm-6"
                                key={i}
                              >
                                <SingleProductPlaneer product={l} onClick={handleClick}/>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>       
                  </div>
                </div>

                <div className={ active ==="2" ? "tab-pane fade show active" : "tab-pane fade"}>
                  Esto es un div de Comidas
                  <div className="product-grid-4 row">
                    <div className="col-lg-12">
                      <div className="shop-product-fillter">
                        <div className="totall-product">
                          <p>
                            Hemos encontrado
                            <strong className="text-brand">{size(comida)}</strong>
                            productos para ti!
                          </p>
                        </div>
                      </div>
                      <div className="row product-grid-3">
                        {size(comida) === 0 && (
                          <h3>No se han encontrado productos para {comida.name} </h3>
                        )}
                        {size(comida) > 0 && (
                          <>
                            {comida.map((l, i) => (
                              <div
                                className="col-lg-3 col-md-4 col-12 col-sm-6"
                                key={i}
                              >
                                <SingleProductPlaneer product={l}  onClick={handleClick}/>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                            
                  </div>
                </div>

                <div className={ active ==="3" ? "tab-pane fade show active" : "tab-pane fade"}>
                  Esto es un div de Cenas
                  <div className="product-grid-4 row">
                    <div className="col-lg-12">
                      <div className="shop-product-fillter">
                        <div className="totall-product">
                          <p>
                            Hemos encontrado
                            <strong className="text-brand">{size(cena)}</strong>
                            productos para ti!
                          </p>
                        </div>
                      </div>
                      <div className="row product-grid-3">
                        {size(cena) === 0 && (
                          <h3>No se han encontrado productos para {cena.name} </h3>
                        )}
                        {size(cena) > 0 && (
                          <>
                            {cena.map((l, i) => (
                              <div
                                className="col-lg-3 col-md-4 col-12 col-sm-6"
                                key={i}
                              >
                                <SingleProductPlaneer product={l} onClick={handleClick} />
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                            
                  </div>
                </div>


                <div className={ active ==="4" ? "tab-pane fade show active" : "tab-pane fade"}>
                  Esto es un div de Snack
                  <div className="product-grid-4 row">
                    <div className="col-lg-12">
                      <div className="shop-product-fillter">
                        <div className="totall-product">
                          <p>
                            Hemos encontrado
                            <strong className="text-brand">{size(market)}</strong>
                            productos para ti!
                          </p>
                        </div>
                      </div>
                      <div className="row product-grid-3">
                        {size(market) === 0 && (
                          <h3>No se han encontrado productos para {market.name} </h3>
                        )}
                        {size(market) > 0 && (
                          <>
                            {market.map((l, i) => (
                              <div
                                className="col-lg-3 col-md-4 col-12 col-sm-6"
                                key={i}
                              >
                                <SingleProductPlaneer product={l} onClick={handleClick}  />
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                            
                  </div>
                </div>


              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.products,
  productFilters: state.productFilters,
});

const mapDidpatchToProps = {
  // openCart,
  fetchProduct,
  // fetchMoreProduct,
};

export default connect(mapStateToProps, mapDidpatchToProps)(Products);
