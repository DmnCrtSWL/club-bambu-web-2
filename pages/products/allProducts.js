import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";
import Layout from "../../components/layout/Layout";
import BeatLoader from "react-spinners/BeatLoader";

function allProducts() {
  const router = useRouter();
  const { slug, title, id } = router.query;
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("1");
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    (async () => {
      document.addEventListener("scroll", () => {
        const scrollCheck = window.scrollY >= 100;
        if (scrollCheck !== scroll) {
          setScroll(scrollCheck);
        }
      });
      if (active === "2") {
        const todosProductos = await ecwid.getProducts();
        setProducts(todosProductos.items);
      } else {
        const productosDestacados = await ecwid.getProducts();
        const filtro = productosDestacados.items;

        const currentCategory = filtro.filter(
          (category) => category.defaultCategoryId === 136064009
        );
        setProducts(currentCategory);
      }
    })();
  }, [active]);

  const featuredProduct = async () => {
    setActive("1");
  };

  const allProduct = async () => {
    setActive("2");
  };

  return (
    <>
      <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
        <section className="product-tabs section-padding position-relative wow fadeIn animated">
          <div className="container">
            <div className="col-lg-12">
              <div className="tab-header">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={
                        active === "1" ? "nav-link active" : "nav-link"
                      }
                      onClick={featuredProduct}
                    >
                      Productos destacados
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={
                        active === "2" ? "nav-link active" : "nav-link"
                      }
                      onClick={allProduct}
                    >
                      Ver más
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* <div className="col-lg-12">
          <div className="tab-header m-10 col-lg-12">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={active === "1" ? "nav-link active" : "nav-link"}
                  onClick={featuredProduct}
                >
                  Productos destacados
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={active === "2" ? "nav-link active" : "nav-link"}
                  onClick={allProduct}
                >
                  Ver todo
                </button>
              </li>
            </ul>
          </div>
        </div> */}
        <section className="product-tabs section-padding position-relative wow fadeIn animated">
          <div className="container">
            <div className="col-lg-12">
              <div className="tab-content wow fadeIn animated">
                <div className="tab-pane fade show active">
                  <div className="product-grid-4 row">
                    {products.length > 0 ? (
                      <>
                        {products.map((l, i) => (
                          <div
                            key={i}
                            className="col-lg-3 col-md-5 col-12 col-sm-6"
                          >
                            <div className="product-cart-wrap mb-30">
                              <div className="product-img-action-wrap">
                                <div className="product-img product-img-zoom">
                                  <Link
                                    href="/products/[slug]"
                                    as={`/products/${l.id}`}
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
                                    href="/products/[slug]"
                                    as={`/products/${l.id}`}
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
                      <>
                        {active === "2" ? (
                          <div className="col-12">
                            <div className=" bg-slate-200 h-20 rounded-xl justify-center flex items-center p-1">
                              <h4 className="text-center text-xs">
                                Cargando productos destacados
                              </h4>
                            </div>
                          </div>
                        ) : (
                          <div className="col-12">
                            <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
                              <BeatLoader
                                color={"#325454"}
                                size={10}
                                className="mb-10"
                              />
                              <h4 className="text-center text-xs">
                                Cargando productos Bambu
                              </h4>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
export default allProducts;
