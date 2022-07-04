import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";

function ProductsCategory() {
  const router = useRouter();
  const { slug, title, id } = router.query;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const productos = await ecwid.getProducts();
      setProducts(productos.items);
      console.log(productos);
      console.log(slug);
    })();
  }, []);

  const ProductsCategory = [
    {
      id: 1,
      slug: "comida",
      brand: "Barra Espresso",
      price: 50,
      title: "Nombre del platillo",
    },
    {
      id: 2,
      slug: "comida",
      brand: "Barra Espresso",

      price: 50,
      title: "Nombre del platillo",
    },
    {
      id: 3,
      slug: "comida",
      brand: "Barra Espresso",

      price: 50,
      title: "Nombre del platillo",
    },
    {
      id: 4,
      slug: "comida",
      brand: "Barra Espresso",

      price: 50,
      title: "Nombre del platillo",
    },
    {
      id: 5,
      slug: "comida",
      brand: "Categoría",
      price: 50,
      title: "Nombre del platillo",
    },
    {
      id: 6,
      slug: "comida",
      brand: "Categoría",
      price: 50,
      title: "Nombre del platillo",
    },
    {
      id: 7,
      slug: "comida",
      brand: "Categoría",
      price: 50,
      title: "Nombre del platillo",
    },
  ];

  const currentCategory = products.filter((category) => category.url === slug);

  return (
    <>
      {currentCategory.length > 0 ? (
        <>
          {currentCategory.map((l, i) => (
            <div key={i} className="col-lg-3 col-md-5 col-12 col-sm-6">
              <div className="product-cart-wrap mb-30">
                <div className="product-img-action-wrap">
                  <div className="product-img product-img-zoom">
                    <Link href="/products/[slug]" as={`/products/${l.slug}`}>
                      <a>
                        <img
                          className="default-img"
                          src="/assets/imgs/shop/category-thumb-1.jpg"
                          alt=""
                        />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="product-content-wrap">
                  <div className="product-category">
                    <Link href="/products">
                      <a>{l.brand}</a>
                    </Link>
                  </div>
                  <h2>
                    <Link href="/products/[slug]" as={`/products/${l.slug}`}>
                      <a>{l.title}</a>
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
