import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../screens/DrawerScreens/HomeScreen";
// import AccountStackNavigator from './AccountStackNavigator';
import HistoryScreen from "../screens/DrawerScreens/HistoryScreen";
import NotificationsScreen from "../screens/DrawerScreens/NotificationsScreen";
import ReferralScreen from "../screens/DrawerScreens/ReferralScreen";
import PaymentScreen from "../screens/DrawerScreens/PaymentScreen";
import SubscriptionsScreen from "../screens/DrawerScreens/SubscriptionsScreen";
import HelpScreen from "../screens/DrawerScreens/HelpScreen";
import OrderDetailsScreen from "../screens/DrawerScreens/OrderDetailsScreen";
import PurchaseProduct from '../stripe/otherMethod/PurchaseProduct'
import DrawerContent from "../screens/DrawerScreens/UserDrawerContent";
// import ChangePasswordScreen from "../screens/DrawerScreens/ChangePasswordScreen";
import NewOrderScreen from "../screens/DrawerScreens/NewOrderScreen";
// import HomeStackNavigator from './HomeStackNavigator'
import AccountScreen from "../screens/DrawerScreens/AccountScreen";
import WasherAvailableOrdersScreens from "../screens/DrawerScreens/WasherAvailableOrdersScreens";

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>

      <Drawer.Screen name="Home" component={WasherAvailableOrdersScreens} />
      <Drawer.Screen name="Account" component={AccountScreen} options={{unmountOnBlur:true}}/>
      {/* <Drawer.Screen name="ChangePassword" component={ChangePasswordScreen} options={{unmountOnBlur:true}}/> */}
      <Drawer.Screen name="History" component={HistoryScreen} options={{unmountOnBlur:true}}/>
      {/* <Drawer.Screen name="Order Details" component={OrderDetailsScreen} options={{unmountOnBlur:true}}/> */}
      {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{unmountOnBlur:true}}/> */}
      {/* <Drawer.Screen name="Referrals" component={ReferralScreen} options={{unmountOnBlur:true}}/> */}
      <Drawer.Screen name="Payment" component={PaymentScreen} options={{unmountOnBlur:true}}/>

      {/* <Drawer.Screen name="Subscriptions" component={SubscriptionsScreen} options={{unmountOnBlur:true}}/> */}
      <Drawer.Screen name="Help" component={HelpScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
