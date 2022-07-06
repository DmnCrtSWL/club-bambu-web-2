import React, { useEffect, useState } from "react";
import Link from "next/link";
import ecwid from "../../util/ecwid";

function HeaderCategory() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    (async () => {
      const categorias = await ecwid.getCategories();
      setCategorias(categorias.items);
    })();
  }, []);

  return (
    <>
      <div className="relative flex items-center mx-52 mt-10">
        <div className="w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide ">
          <>
            {categorias.map((l, i) => (
              <div
                key={i}
                className="w-[220px] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300 "
              >
                <div className="flex-row">
                  <Link
                    href={{
                      pathname: "/categories/[slug]",
                      query: {
                        id: l.id,
                        title: l.name,
                        slug: l.url,
                      },
                    }}
                    // "/categories/[slug]"
                    // as={`/categories/${category.slug}`}
                  >
                    <a className="font-bold">{l.name}</a>
                  </Link>
                </div>
              </div>
            ))}
          </>
        </div>
      </div>
    </>
  );
}
export default HeaderCategory;
