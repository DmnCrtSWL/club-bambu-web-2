import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ecwid from "../../util/ecwid";
import Preloader from "../elements/Preloader";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    const busqueda = await ecwid.searchProducts();
    const filtro = busqueda.items;
    const currentProducts = filtro.filter((product) => {
      if (
        product.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return product;
      }
    });
    router.push({
      pathname: "/products",
      query: {
        search: currentProducts,
        item: searchTerm,
      },
    });
    setSearchTerm("");
    setLoading(false);
  };

  const handleInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };
  return (
    <>
      {!loading ? (
        <form>
          {/* <select className="select-active">
          <option>All Categories</option>
          <option>Women's</option>
          <option>Men's</option>
          <option>Cellphones</option>
          <option>Computer</option>
          <option>Electronics</option>
          <option> Accessories</option>
          <option>Home & Garden</option>
          <option>Luggage</option>
          <option>Shoes</option>
          <option>Mother & Kids</option>
        </select> */}
          <input
            value={searchTerm}
            onKeyDown={handleInput}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="¿Qué estás buscando?"
          />
        </form>
      ) : (
        <Preloader />
      )}
      {/* <Button>Search</Button> */}
      {/* <button onClick={handleSearch}>search</button> */}
    </>
  );
};

export default Search;
