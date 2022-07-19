import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";
import Layout from "../../components/layout/Layout";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import { createTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { UseLocalStorage } from "../../components/pago/UseLocalStorage";
import { isEmpty, size } from "lodash";
import { toast } from "react-toastify";
import { validateEmail } from "../../util/validations";
import Autocomplete from "react-google-autocomplete";

function infoComensal() {
  const router = useRouter();
  const [name, setName] = UseLocalStorage("text", "");
  const [email, setEmail] = UseLocalStorage("email", "");
  const [phone, setPhone] = UseLocalStorage("phone", "");
  const [methodPayCash, setMethodPayCash] = useState(true);
  const [methodPayCard, setMethodPayCard] = useState(false);
  const [coupon, setCoupon] = UseLocalStorage("coupon", "");
  const [date, setDate] = UseLocalStorage("date", "");
  const [hour, setHour] = UseLocalStorage("hour", "");
  const [adress, setAdress] = UseLocalStorage("adress", "");
  const [comments, setComments] = UseLocalStorage("comments", "");
  const [path, setpath] = useState("infoComensal");
  // const stripePromise = loadStripe();

  const sendForm = () => {
    if (isEmpty(name)) {
      toast.error("Ingresa tu nombre");
    } else if (isEmpty(email)) {
      toast.error("Ingresa tu correo electrónico");
    } else if (isEmpty(hour)) {
      toast.error("Ingresa hora de entrega");
    } else if (isEmpty(date)) {
      toast.error("Ingresa fecha de entrega");
    } else if (isEmpty(phone)) {
      toast.error("Ingresa tu celular");
    } else if (isEmpty(adress)) {
      toast.error("Ingresa tu dirección");
    } else if (!validateEmail(email.replace(/ /g, ""))) {
      toast.error("Ingresa un correo electrónico válido");
    } else if (size(phone) != 10) {
      toast.error("Ingresa un celular valido");
    } else if (!/^\d+/.test(phone)) {
      toast.error("Ingresa un celular valido");
    } else if (!/^[0-9]+$/.test(phone)) {
      toast.error("Ingresa un celular valido");
    } else {
      // setpath("infoProductos");
      // console.log("Todo correcto");

      //1. Mandar pago a Stripe
      //2. Una vez confirmado el pago en Stripe obtenemos la respuesta y procesamos a Ecwid

      //3. Mandamos a la pagina detalle de pedido
      /*router.push({
        pathname: "/pago/infoProductos",
        query: {
          methodPayCash,
          methodPayCard,
          name,
          email,
          phone,
          coupon,
          date,
          hour,
          adress,
          comments,
        },
      });*/
    }
  };

  function roundMinutes(date) {
    date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
    date.setMinutes(0);

    return date;
  }

  return (
    <>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCSfb3q43wvrhTk9tbipj9KkrcVcjxW3ro&libraries=places"></script>
      <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
        <section className="product-tabs section-padding position-relative wow fadeIn animated">
          <div className="container">
            <div className="col-lg-12">
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                <h2>Información comensal</h2>
                <form className="m-10">
                  <h4 className="font-normal mb-2">Nombre completo</h4>
                  <input
                    className="w-full"
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    type="text"
                    value={name}
                  ></input>
                  <h4 className="font-normal mb-5 my-4">Correo electrónico</h4>
                  <input
                    className="w-full"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    type="text"
                    value={email}
                  ></input>
                  <h4 className="font-normal mb-5 my-4">Numero de celular</h4>
                  <input
                    className="w-full"
                    onChange={(e) => setPhone(e.target.value)}
                    name="phone"
                    type="text"
                    value={phone}
                  ></input>
                  <h4 className="font-normal mb-5 my-4">Método de pago</h4>
                  <label className="mx-4 mt-2">
                    Efectivo
                    <input
                      type="checkbox"
                      name="methodPayCash"
                      onChange={(e) => {
                        if (methodPayCash) {
                          setMethodPayCash(false);
                          setMethodPayCard(true);
                        } else {
                          setMethodPayCash(true);
                          setMethodPayCard(false);
                        }
                      }}
                      checked={methodPayCash}
                      className="h-5"
                    ></input>
                  </label>
                  <label>
                    Tarjeta de debito o credito
                    <input
                      type="checkbox"
                      name="methodPayCard"
                      onChange={(e) => {
                        if (methodPayCard) {
                          setMethodPayCash(true);
                          setMethodPayCard(false);
                        } else {
                          setMethodPayCash(false);
                          setMethodPayCard(true);
                        }
                      }}
                      className="h-5"
                      checked={methodPayCard}
                    ></input>
                  </label>
                  {methodPayCard && (
                    <>
                      <h4 className="font-normal mb-5 my-4">
                        Informacion de pago
                      </h4>
                      <input className="w-full"></input>
                    </>
                  )}
                  {/* <Elements>
                    <CardElement />
                  </Elements> */}

                  <h4 className="font-normal mb-5 my-4">Cupón de descuento</h4>
                  <input
                    className="w-full"
                    onChange={(e) => setCoupon(e.target.value)}
                    name="coupon"
                    type="text"
                    value={coupon}
                  ></input>
                  <h4 className="font-normal mb-6 my-4">Fecha de entrega</h4>
                  <ThemeProvider theme={materialTheme}>
                    <DatePicker
                      value={date ? date : new Date()}
                      onChange={(e) => setDate(e)}
                      name="date"
                      inputVariant="outlined"
                      minDate={new Date()}
                    />
                  </ThemeProvider>
                  <h4 className="font-normal mb-6 my-4">Hora de entrega</h4>
                  <ThemeProvider theme={materialTheme}>
                    <TimePicker
                      value={hour ? hour : roundMinutes(new Date())}
                      onChange={(e) => setHour(e)}
                      name="date"
                      inputVariant="outlined"
                      minutesStep={30}
                    />
                  </ThemeProvider>
                  <h4 className="font-normal mb-5 my-4">
                    Dirección de entrega
                  </h4>
                  {/* <textarea
                    className="w-full"
                    onChange={(e) => setAdress(e.target.value)}
                    name="adress"
                    value={adress}
                  ></textarea> */}
                  <Autocomplete
                    apiKey={"AIzaSyCSfb3q43wvrhTk9tbipj9KkrcVcjxW3ro"}
                    onPlaceSelected={(place) => {
                      setAdress(place.formatted_address);
                    }}
                    defaultValue={adress}
                    language="es"
                    placeholder="Buscar ubicación"
                    options={{
                      types: "address",
                      componentRestrictions: { country: "mx" },
                    }}
                  />
                  <h4 className="font-normal mb-5 my-4">Comentarios extras</h4>
                  <textarea
                    className="w-full"
                    onChange={(e) => setComments(e.target.value)}
                    name="comments"
                    value={comments}
                  ></textarea>
                </form>
                <div className="cart-action text-end">
                  <a className="btn " onClick={() => sendForm()}>
                    Realizar compra
                  </a>
                </div>
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

const materialTheme = createTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#325454",
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        backgroundColor: "white",
        color: "#325454",
      },
    },
  },
});

export default infoComensal;
