import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ecwid from "../../util/ecwid";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    console.log("click");
    const busqueda = await ecwid.searchProducts(searchTerm);
    console.log("****+********");
    console.log(busqueda);
    console.log("****+********");
    router.push({
      pathname: "/products",
      query: {
        search: busqueda,
        item: searchTerm,
      },
    });
    setSearchTerm("");
  };

  const handleInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };
  return (
    <>
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

      {/* <Button>Search</Button> */}
      {/* <button onClick={handleSearch}>search</button> */}
    </>
  );
};

export default Search;
