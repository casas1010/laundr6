import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserDrawerNavigator from "./UserDrawerNavigator";
import DriverDrawerNavigator from "./DriverDrawerNavigator";

import AuthScreen from "../screens/SignInScreens/AuthScreen";
import ForgotPasswordScreen from "../screens/SignInScreens/ForgotPasswordScreen";
import SignUpDetailsScreen from "../screens/SignInScreens/SignUpDetailsScreen";
import WelcomeScreen from "../screens/SignInScreens/WelcomeScreen";
// import TestScreen from "../screens/DrawerScreens/TestScreen";
import PurchaseProduct from "../stripe/otherMethod/PurchaseProduct";
// import TestScreen from "../screens/DrawerScreens/NewOrderScreen";
// FUTURE IMPROVEMENT: figure out how to hide all tab screens from Tab.Navigator   // https://reactnavigation.org/docs/bottom-tab-navigator/
// NOTE: CHANGE INITIAL ROUTE

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator>
      {/* <Tab.Screen
        options={{ tabBarVisible: false }}
        name="test"
        component={PurchaseProduct}
      /> */}
      <Tab.Screen
        options={{ tabBarVisible: false }}
        name="auth"
        component={AuthScreen}
      />
      <Tab.Screen
        options={{ tabBarVisible: false }}
        name="welcome"
        component={WelcomeScreen}
      />
      <Tab.Screen
        options={{ tabBarVisible: false }}
        name="userDrawer"
        component={UserDrawerNavigator}
      />
      <Tab.Screen
        options={{ tabBarVisible: false }}
        name="driverDrawer"
        component={DriverDrawerNavigator}
      />
      <Tab.Screen
        options={{ tabBarVisible: false }}
        name="signUpDetails"
        component={SignUpDetailsScreen}
      />
      <Tab.Screen
        options={{ tabBarVisible: false }}
        name="forgotPassword"
        component={ForgotPasswordScreen}
      />
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;
