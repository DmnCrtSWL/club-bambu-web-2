import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";

function ProductsCategory() {
  const router = useRouter();
  const { id, title, slug } = router.query;
  const [products, setProducts] = useState([]);
  let categoriasproductos = [];

  useEffect(() => {
    (async () => {
      const productos = await ecwid.getProducts();
      const filtro = productos.items;
      const number = Number(id);
      const currentCategory = filtro.filter(
        (category) => category.categoryIds[0] === 133695893
      );
      // const currentCategory = filtro.map((category) => category.categoryIds);
      setProducts(currentCategory);
      console.log("*********");
      console.log(number);
      console.log("*********");
      console.log(currentCategory);
      console.log("*********");
    })();
  }, [id]);

  return (
    <>
      {products.length > 0 ? (
        <>
          {products.map((l, i) => (
            <div key={i} className="col-lg-3 col-md-5 col-12 col-sm-6">
              <div className="product-cart-wrap mb-30">
                <div className="product-img-action-wrap">
                  <div className="product-img product-img-zoom">
                    <Link href="/products/[slug]" as={`/products/${l.slug}`}>
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
                    <Link href="/products/[slug]" as={`/products/${l.slug}`}>
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
          <div className=" bg-slate-200 h-20 rounded-xl justify-center flex items-center p-1">
            <h4 className="text-center">
              No hay productos en la categoría {title}
            </h4>
          </div>
        </div>
      )}
    </>
  );
}
export default ProductsCategory;
