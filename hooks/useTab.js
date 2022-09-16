import { useState } from "react";

export const useTab = (initialValue) =>{
  const [active, setActive] = useState(initialValue);

  const changeTab =(numberTab)=> {
    if(active !== numberTab){
      setActive(numberTab)
    }
  };

  return [active, changeTab];
}