import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Linking } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome";
import * as actions from "../../actions";
import { connect } from "react-redux";

import { FIELD_NAME_FONT_SIZE } from "../../components/Items";

const DriverDrawerContent = (props) => {
  console.log("DrawerContent loading");
  const [color, setColor] = useState("#01c9e2");
  const [size, setSize] = useState(FIELD_NAME_FONT_SIZE * 1.2);

  useEffect(() => {
    console.log("DrawerContent useEffect");
    // console.log(props);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.drawerSection}>
            <DrawerItem
              icon={() => <Icon name="home" color={color} size={size} />}
              label="Available Orders"
              onPress={() => {
                props.navigation.navigate("Available Orders");
              }}
              // navigateToNewOrderScreen={() =>
              //   props.navigation.navigate("New Order Screen")
              // }
            />

            <DrawerItem
              icon={() => <Icon name="home" color={color} size={size} />}
              label="Accepted Orders"
              onPress={() => {
                props.navigation.navigate("Accepted Orders");
              }}
              // navigateToNewOrderScreen={() =>
              //   props.navigation.navigate("New Order Screen")
              // }
            />

            <DrawerItem
              icon={() => <Icon name="gear" color={color} size={size} />}
              label="Account"
              onPress={() => {
                props.navigation.navigate("Account");
              }}
            />
            <DrawerItem
              icon={() => <Icon name="user-circle" color={color} size={size} />}
              label="History"
              onPress={() => {
                props.navigation.navigate("History");
              }}
            />
            {/* <DrawerItem
              icon={() => <Icon name="bell" color={color} size={size} />}
              label="Notifications"
              onPress={() => {
                props.navigation.navigate("Notifications");
              }}
            /> */}
            <DrawerItem
              icon={() => <Icon name="users" color={color} size={size} />}
              label="Referrals"
              onPress={() => {
                props.navigation.navigate("Referrals");
              }}
            />
            <DrawerItem
              icon={() => <Icon name="credit-card" color={color} size={size} />}
              label="Payment"
              onPress={() => {
                props.navigation.navigate("Payment");
              }}
            />
            {/* <DrawerItem
              icon={() => <Icon name="paper-plane" color={color} size={size} />}
              label="Subscriptions"
              onPress={() => {
                props.navigation.navigate("Subscriptions");
              }}
            /> */}
            <DrawerItem
              icon={() => (
                <View
                  style={{
                    width: size,

                    alignItems: "center",
                  }}
                >
                  <Icon name="question" color={color} size={size} />
                </View>
              )}
              label="Help"
              onPress={() => {
                props.navigation.navigate("Help");
              }}
            />
          </View>
        </View>
      </DrawerContentScrollView>

      <View style={styles.bottomDrawerSection}>
        {/* <DrawerItem
          icon={() => <Icon name="money" color={"green"} size={size} />}
          label="Earn with Laundr"
          onPress={() => {
            console.log("sign out");
            console.log(props);
            props.emailLogOut();
          }}
        /> */}

        <DrawerItem
          icon={() => <Icon name="legal" size={size} color="black" />}
          label="Terms of Service"
          onPress={() => {
            Linking.openURL("https://www.laundr.io/termsofservice/");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default connect(null, actions)(DriverDrawerContent);
