import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import HistoryScreen from "../screens/DrawerScreens/HistoryScreen";

import PaymentScreen from "../screens/DrawerScreens/PaymentScreen";

import HelpScreen from "../screens/DrawerScreens/HelpScreen";

import DrawerContent from "../screens/DrawerScreens/DriverDrawerContent";

import AccountScreen from "../screens/DrawerScreens/AccountScreen";

import DriverAvailableOrdersScreens from "../screens/DrawerScreens/DriverAvailableOrdersScreens";

import DriverAccepterOrdersScreen from '../screens/DrawerScreens/DriverAccepterOrdersScreen'


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>

      <Drawer.Screen name="Available Orders" component={DriverAvailableOrdersScreens} />

      <Drawer.Screen name="Accepted Orders" component={DriverAccepterOrdersScreen} />

      <Drawer.Screen name="Account" component={AccountScreen} options={{unmountOnBlur:true}}/>

      <Drawer.Screen name="History" component={HistoryScreen} options={{unmountOnBlur:true}}/>

      <Drawer.Screen name="Payment" component={PaymentScreen} options={{unmountOnBlur:true}}/>

      <Drawer.Screen name="Help" component={HelpScreen} />

    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
