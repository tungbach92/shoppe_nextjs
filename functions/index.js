/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://shopee-demo-c6d2b-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY_TEST);

// API

// App configuration
const app = express();

// Middleware configuration
app.use(cors({origin: true}));
app.use(express.json());

// API routes

// Verify id token from client
app.post("/verify-id-token-by-firebase", async (req, res) => {
  const idToken = req.body.idToken;
  const checkRevoked = true;
  try {
    const result = await admin.auth().verifyIdToken(idToken, checkRevoked);
    res.send({succeeded: true, idToken: result});
  } catch (error) {
    if (error.code == "auth/id-token-revoked") {
      res.send({revoked: true, error: error.code});
      // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
    } else {
      res.send({invalid: true, error: error.code});
      // Token is invalid.
    }
  }
});

app.post("/retrieve-customer-by-id", async (req, res) => {
  try {
    const customerID = req.body.customerID;
    // retrieve customer object
    const customerResult = await stripe.customers.retrieve(customerID);

    res.send({customer: customerResult});
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
});

app.post("/get-payment-method-list", async (req, res) => {
  try {
    const customerID = req.body.customerID;
    // List the customer's payment methods to find one to charge
    const paymentMethodListResult = await stripe.paymentMethods.list({
      customer: customerID,
      type: "card",
    });
    res.send({
      paymentMethodList: paymentMethodListResult.data,
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      error: error.message,
    });
  }
});

app.post("/create-token-server-side", async (request, response) => {
  try {
    const tokenClientSideID = request.body.tokenClientSideID;
    const tokenResult = await stripe.tokens.retrieve(tokenClientSideID);
    response.send({
      tokenResult: tokenResult,
    });
  } catch (error) {
    response.send({
      error: error.message,
    });
  }
});

// Create setup Intent => return client secret
app.post("/create-setup-intent", async (request, response) => {
  // Since we are using test cards, create a new Customer here
  // You would do this in your payment flow that saves cards
  try {
    const name = request.body.name;
    const email = request.body.email;
    const customerID = request.body.customerID;
    let customer;
    if (!customerID) {
      customer = await stripe.customers.create({
        name: name,
        email: email,
      });
    }
    const intent = await stripe.setupIntents.create({
      customer: customerID ? customerID : customer.id,
    });

    response.status(201).send({
      setUpIntentSecret: intent.client_secret,
      customerID: intent.customer,
    });
  } catch (error) {
    response.send({
      error: error.message,
    });
  }
});

app.post("/detach-payment-method", async (req, res) => {
  try {
    const paymentMethodID = req.body.paymentMethodID;
    const paymentMethodResult = await stripe.paymentMethods.detach(
      paymentMethodID
    );
    res.send({
      paymentMethod: paymentMethodResult,
    });
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
});

app.post("/update-customer-payment-method", async (req, res) => {
  try {
    const customerID = req.body.customerID;
    const paymentMethodID = req.body.paymentMethodID;
    const customerResult = await stripe.customers.update(customerID, {
      invoice_settings: {
        default_payment_method: paymentMethodID,
      },
    });
    res.send({customer: customerResult});
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
});

app.post("/update-customer-billing-address", async (request, response) => {
  try {
    const {
      customerID,
      userName,
      shipName,
      phone,
      province,
      district,
      street,
      ward,
    } = request.body;
    const customerResult = await stripe.customers.update(customerID, {
      name: userName,
      address: {
        state: province,
        city: district,
        line1: ward,
        line2: street,
        postal_code: 10000,
        country: "VN",
      },
      shipping: {
        name: shipName,
        phone: phone,
        address: {
          state: province,
          city: district,
          line1: ward,
          line2: street,
          postal_code: 10000,
          country: "VN",
        },
      },
    });
    response.send({succeeded: true, customer: customerResult});
  } catch (error) {
    response.send({
      error: error.message,
    });
  }
});

// Charge by creating payment Intent
app.post("/charge-card-off-session", async (request, response) => {
  let total;
  try {
    total = request.query.total;
    const {paymentMethodID, customerID, email, shipping} = request.body;
    // no need cause paymentmethod will auto attach to provide customer above
    // const paymentMethodID = request.body.paymentMethodID;
    // const paymentMethod = await stripe.paymentMethods.attach(paymentMethodID, {
    //   customer: customer.id,
    // });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "vnd",
      // using first payment method in list
      // payment_method: paymentMethods.data[0].id,
      shipping: shipping,
      payment_method: paymentMethodID,
      customer: customerID,
      receipt_email: email,
      off_session: true, // indicate that the customer is not in your checkout flow during this payment attempt.
      // This causes the PaymentIntent to throw an error if authentication is required.
      confirm: true,
    });

    // OK - Card Succeeded
    response.send({
      succeeded: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntent: paymentIntent,
    });
  } catch (error) {
    if (error.code === "authentication_required") {
      // Bring the customer back on-session to authenticate the purchase
      // You can do this by sending an email or app notification to let them know
      // the off-session purchase failed
      // Use the PM ID and client_secret to authenticate the purchase
      // without asking your customers to re-enter their details
      response.send({
        error: "authentication_required",
        paymentMethod: error.raw.payment_method.id,
        clientSecret: error.raw.payment_intent.client_secret,
        paymentIntentID: error.raw.payment_intent.id,
        amount: total,
        card: {
          brand: error.raw.payment_method.card.brand,
          last4: error.raw.payment_method.card.last4,
        },
      });
    } else if (error.code) {
      // The card was declined for other reasons (e.g. insufficient funds)
      // Bring the customer back on-session to ask them for a new payment method
      response.send({
        error: error.code,
        clientSecret: error.raw.payment_intent.client_secret,
        card: {
          brand: error.raw.payment_method.card.brand,
          last4: error.raw.payment_method.card.last4,
        },
      });
    } else {
      console.log("Unknown error occurred", error);
    }
  }
});

// Listen command
exports.api = functions.https.onRequest(app);
