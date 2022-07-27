import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";
import BeatLoader from "react-spinners/BeatLoader";
import { MdError } from "react-icons/md";
import ButtonBottom from "../../components/elements/ButtonBottom";

function ProductsCategory() {
  const router = useRouter();
  const { id, title, slug } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productos1, setproductos1] = useState([]);
  const [productos2, setproductos2] = useState([]);

  useEffect(() => {
    (async () => {
      const productos = await ecwid.getProducts({ offset: 100 });
      setproductos1(productos.items);
      const productosParte = await ecwid.getProducts();
      setproductos2(productosParte.items);
      let totalProductos = [];

      if (productos1 && productos2) {
        totalProductos = productos1.concat(productos2);
      }
      console.log(productos);
      console.log(productosParte);
      console.log(totalProductos);

      const filtro = productos.items;
      const number = Number(id);
      const number2 = Number(slug);
      if (number2) {
        const currentCategory = totalProductos.filter(
          (category) => category.categoryIds[0] === number2
        );
        setProducts(currentCategory);
      } else {
        const currentCategory = totalProductos.filter(
          (category) => category.categoryIds[0] === number
        );
        setProducts(currentCategory);
      }
    })();
  }, [id, productos1, productos2]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {!loading ? (
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
      ) : (
        <div className="col-12 ">
          <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
            <BeatLoader color={"#325454"} size={10} className="mb-10" />
            <h4 className="text-center text-xs">
              Cargando productos de {title}
            </h4>
          </div>
        </div>
      )}
      {/* {products.length > 0 ? (
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
                        <img className="default-img" src={l.imageUrl} alt="" />
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
            <BeatLoader color={"#325454"} size={10} className="mb-10" />
            <h4 className="text-center text-xs">
              Cargando productos de {title}
            </h4>
          </div>
        </div>
      )} */}
      <ButtonBottom />
    </>
  );
}
export default ProductsCategory;
