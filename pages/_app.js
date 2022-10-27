import "react-perfect-scrollbar/dist/css/styles.css";
import { Provider } from "react-redux";
import "react-responsive-modal/styles.css";
import store from "../redux/store";
import StorageWrapper from "../components/ecommerce/storage-wrapper";
import "../public/assets/css/main.css";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Swiper Slider
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Preloader from "./../components/elements/Preloader";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    if (typeof window !== "undefined") {
      window.WOW = require("wowjs");
    }
    new WOW.WOW().init();


    // Intercom code snippet
    (function(){
      var w=window;
      var ic=w.Intercom;
      if(typeof ic==="function")
      {
        ic('reattach_activator');
        ic('update',w.intercomSettings);
      }else{
        var d=document;
        var i=function()
        {
          i.c(arguments);
        };
        i.q=[];
        i.c=function(args)
        {
          i.q.push(args);
        };
        w.Intercom=i;
        var l=function()
        {
          var s=d.createElement('script');
          s.type='text/javascript';
          s.async=true;
          s.src='https://widget.intercom.io/widget/usvdqdfx';
          var x=d.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(s,x);
        };
        if(w.attachEvent)
        {
          w.attachEvent('onload',l);
        }else{w.addEventListener('load',l,false);}}})();

        // Call boot method
      (window).Intercom('boot', {
        app_id: 'usvdqdfx'
      });
  }, []);


  return (
    <>
      {/* {!loading ? ( */}
      <Provider store={store}>
        <StorageWrapper>
          <ToastContainer />
          <Component {...pageProps} />
        </StorageWrapper>
      </Provider>
      {/* ) : (
        <Preloader />
      )} */}
    </>
  );
}

export default MyApp;
