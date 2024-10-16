import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";
import BeatLoader from "react-spinners/BeatLoader";

function IconsCategory() {
  const router = useRouter();
  const { slug, title, id } = router.query;
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    (async () => {
      const categorias = await ecwid.getCategories();
      setCategorias(categorias.items);
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
                                id: l.parentId,
                                title: l.name,
                                slug: l.id,
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
                                id: l.parentId,
                                title: l.name,
                                slug: l.id,
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
          <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
            <BeatLoader color={"#325454"} size={10} className="mb-10" />
            <h4 className="text-center text-xs">Cargando Categorías</h4>
          </div>
        </div>
      )}
    </>
  );
}
export default IconsCategory;
