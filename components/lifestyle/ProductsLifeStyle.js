import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";
import BeatLoader from "react-spinners/BeatLoader";
import { MdError } from "react-icons/md";
import ButtonBottom from "../../components/elements/ButtonBottom";

function ProductsLifeStyle() {
  const router = useRouter();
  const { id, title, slug } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async()=>{
    setLoading(true)
    const auxProductos = []
    const productos = await ecwid.getProducts();
    const productosParte1 = productos.items
    productos = await ecwid.getProducts({ offset: 100 });
    const productosParte2 = productos.items
    let totalProductos = [];
    if (productosParte1 && productosParte2) {
      totalProductos = productosParte1.concat(productosParte2);
    }
    const atributo = title;
    totalProductos.map(producto =>{
      if(producto.attributes != 0){
        producto.attributes.map((atribute) =>{
          if(atribute.name === atributo){
            if(atribute.value != 0 ){
              auxProductos.push(producto)
            }
          }
        })
      }
    })
    setProducts(auxProductos)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [id, slug]);

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
          {products.length > 0 ? (
            <>
              {products.map((l, i) => (
                <div key={i} className="col-lg-3 col-md-5 col-12 col-sm-6">
                  <div className="product-cart-wrap mb-30">
                    <div className="product-img-action-wrap">
                      <div className="product-img product-img-zoom">
                        <Link
                          href={{
                            pathname: "/products/[id]",
                            query: {
                              id: l.id,
                            },
                          }}
                        >
                          <a>
                            <img
                              className="default-img"
                              src={l.imageUrl}
                              alt=""
                            />
                          </a>
                        </Link>
                      </div>
                    </div>
                    <div className="product-content-wrap">
                      <div className="product-category">
                        <Link href="/products">
                          <a>{l.googleItemCondition}</a>
                        </Link>
                      </div>
                      <h2>
                        <Link
                          // href="/products/[id]"
                          // as={`/products/${l.id}`}
                          href={{
                            pathname: "/products/[id]",
                            query: {
                              id: l.id,
                            },
                          }}
                        >
                          <a>{l.name}</a>
                        </Link>
                      </h2>

                      <div className="product-price">
                        <span>${l.price} </span>
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
      )
      }
      <ButtonBottom />
    </>
  );
}
export default ProductsLifeStyle;
