import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";

function IconsCategory() {
  const router = useRouter();
  const { slug, title, id } = router.query;
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    (async () => {
      const categorias = await ecwid.getCategories();
      setCategorias(categorias.items);
      console.log(categorias);
    })();
  }, []);

  return (
    <>
      {categorias.length > 0 ? (
        <>
          <div className="mb-30">
            <h1>Explorar Categorías</h1>
          </div>
          <div className="tab-content wow fadeIn animated">
            <div className="tab-pane fade show active">
              <div className="product-grid-4 row">
                {categorias.map((l, i) => (
                  <div key={i} className="col-lg-3 col-md-5 col-12 col-sm-6 ">
                    <div className="product-cart-wrap mb-20 ">
                      <div className="product-content-wrap ">
                        <div className="product-category">
                          <Link
                            href={{
                              pathname: "/categories/[slug]",
                              query: {
                                id: l.id,
                                title: l.name,
                                slug: l.url,
                              },
                            }}
                          >
                            <a>Categoría</a>
                          </Link>
                        </div>
                        <h2>
                          <Link
                            href={{
                              pathname: "/categories/[slug]",
                              query: {
                                id: l.id,
                                title: l.name,
                                slug: l.url,
                              },
                            }}
                          >
                            <a>{l.name}</a>
                          </Link>
                        </h2>
                      </div>
                    </div>
                  </div>
                ))}
              </div>{" "}
            </div>{" "}
          </div>
        </>
      ) : (
        <div className="col-12">
          <div className=" bg-slate-200 h-20 rounded-xl justify-center flex items-center p-1">
            <h4 className="text-center text-xs">Cargando Categorías</h4>
          </div>
        </div>
      )}
    </>
  );
}
export default IconsCategory;
