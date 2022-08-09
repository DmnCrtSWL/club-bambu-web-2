import React, { useEffect, useState } from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from "../../components/layout/Layout";
import { server } from "../../config/index";
import { findProductIndex } from "../../util/util";
import ecwid from "../../util/ecwid";
import { useRouter } from "next/router";
import BeatLoader from "react-spinners/BeatLoader";

const ProductId = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState([]);
  const [loading, setLoading] =useState(true);

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      const producto = await ecwid.getProduct(id);
      setProduct(producto);
    })();
    setLoading(false);
  }, [id]);

  return (
    <>
    {loading === true ? (
      <div className="col-12">
        <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
          <BeatLoader color={"#325454"} size={10} className="mb-10" />
            <h4 className="text-center text-xs">Cargando Información</h4>
        </div>
      </div>
      ):(
      <>
        <Layout parent="Inicio" sub="Productos" subChild={product.name}>
          <div className="container">
            <ProductDetails />
          </div>
        </Layout>
      </>
      )
    };
    </>
  )
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
