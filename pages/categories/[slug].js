import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { server } from "../../config/index";
import Products from "../../components/category/products";
import { useRouter } from "next/router";

const CategoryId = (props) => {
  const router = useRouter();
  const { slug, title, id } = router.query;

  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
  }, [router.isReady]);

  return (
    <>
      <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
        <h1 className="m-10">Categoría {title}</h1>
        <section className="product-tabs section-padding position-relative wow fadeIn animated">
          <div className="container">
            <div className="col-lg-12">
              <Products />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default CategoryId;
