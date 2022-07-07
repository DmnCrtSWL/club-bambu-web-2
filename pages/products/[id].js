import React, { useEffect, useState } from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from "../../components/layout/Layout";
import { server } from "../../config/index";
import { findProductIndex } from "../../util/util";
import ecwid from "../../util/ecwid";
import { useRouter } from "next/router";

const ProductId = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState([]);

  console.log("Producto id entrando a [id]: " + id)

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady]);

  useEffect(() => {
    (async() => {
      const producto = await ecwid.getProduct(id);
      setProduct(producto);
      console.log("Obteniendo producto por id en Ecwid:")
      console.log(producto);
    })();
  }, []);

  return (
    <>
      <Layout parent="Home" sub="Shop" subChild={product.id}>
        <div className="container">
          <ProductDetails product={product} />
        </div>
      </Layout>
    </>
  );
};

/*
ProductId.getInitialProps = async (params) => {
  //const request = await ecwid.getProduct(params.id);
  const request = await fetch(`${server}/static/product.json`); //Aqui va el request de Ecwid
  const data = await request.json();
  const index = findProductIndex(data, params.query.slug);

  return { product: data[index] };
};
*/

export default ProductId;
