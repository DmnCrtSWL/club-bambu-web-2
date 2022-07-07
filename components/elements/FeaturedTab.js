import SingleProduct from "../ecommerce/SingleProduct";
import React, { useEffect, useState } from "react";
import ecwid from "../../util/ecwid";
import Link from "next/link";

const FeaturedTab = () => {
  const [products, setProducts] = useState([]);
  const showItem = 8;

  useEffect(() => {
    (async () => {
      const productos = await ecwid.getProducts();
      setProducts(productos.items);
    })();
  }, []);

  const currentCategory = products.filter(
    (category) => category.googleItemCondition === "NEW"
  );

  return (
    <>
      {currentCategory.length > 0 ? (
        <>
          {currentCategory.slice(0, showItem).map((l, i) => (
            // <div className="col-lg-3 col-md-4 col-12 col-sm-6" key={i}>
            //   <SingleProduct product={product} />
            // </div>
            <div key={i} className="col-lg-3 col-md-5 col-12 col-sm-6">
              <div className="product-cart-wrap mb-30">
                <div className="product-img-action-wrap">
                  <div className="product-img product-img-zoom">
                    {/*<Link href="/products/[slug]" as={`/products/${l.id}`}>*/}
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
                    {/*<Link href="/products/[slug]" as={`/products/${l.id}`}>*/}
                    <Link
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
        <div className="col-12">
          <div className=" bg-slate-100 h-20 rounded-xl justify-center flex items-center p-1">
            <h4 className="text-center text-xs">Cargando Productos Bambu</h4>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedTab;
