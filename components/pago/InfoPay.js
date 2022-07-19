import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  ElementsConsumer,
  CardElement,
} from "@stripe/react-stripe-js";

function InfoPay() {
  const stripePromise = loadStripe("<pulishable_api_key>");

  return (
    <Elements stripe={stripePromise}>
      <CardElement />
    </Elements>
  );
}

export default InfoPay;
