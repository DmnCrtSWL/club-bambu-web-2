import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";

function HeaderCategory() {
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
      <div className="relative flex items-center mx-52 mt-10">
        <div className="w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide ">
          <>
            {categorias.map((l, i) => (
              <div className="w-[220px] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300 ">
                <div className="flex-row">
                  <Link href="/products/[slug]" as={`/products/${l.slug}`}>
                    <a>{l.name}</a>
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
