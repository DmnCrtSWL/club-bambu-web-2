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

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      const producto = await ecwid.getProduct(id);
      setProduct(producto);
      console.log("Producto id entrando a [id]: " + id);
      console.log("Datos: ");
      console.log(product);
    })();
  }, []);

  return (
    <>
      <Layout parent="Inicio" sub="Productos" subChild={product.name}>
        <div className="container">
          <ProductDetails />
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
