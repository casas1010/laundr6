import React from 'react';
// import { WebView } from 'react-native-webview';
import { STRIPE } from '../../key';
import { stripeCheckoutRedirectHTML } from './stripeCheckout';
import Header from '../../components/Header'

const PurchaseProduct = () => {

  // TODO: this should come from some service/state store
  const user = { id: 'someID' };

  const onSuccessHandler = () => { /* TODO: do something */ };
  const onCanceledHandler = () => { /* TODO: do something */ };

  // Called everytime the URL stats to load in the webview
  onLoadStart = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.url === STRIPE.SUCCESS_URL) {
      onSuccessHandler();
      return;
    }
    if (nativeEvent.url === STRIPE.CANCELED_URL) {
      onCanceledHandler();
    }
  };

  // Render
  if (!user) {
    return null;
  }

  return (
<>
    {/* <WebView
      originWhitelist={['*']}
      source={{ uri: "https://www.google.com"}}
      // source={{ html: stripeCheckoutRedirectHTML(user.id) }}

      onLoadStart={onLoadStart}
    /> */}
 </>
  );
  
};

export default PurchaseProduct;
