import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableOpacityBase,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BASE_URL } from "../../key";
import axios from "axios";

import GlobalStyles from "../../components/GlobalStyles";
import Header from "../../components/Header";
import Container from "../../components/Container";
import { DIVIDER, BUTTON } from "../../components/Items/";
import { HEIGHT, WIDTH, SHADOW } from "../../components/Items/";

import { connect } from "react-redux";
import * as actions from "../../actions/index";

import SearchBar from "../../components/SearchBar";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.3;

const SearchScreen = (props) => {
  const [term, setTerm] = useState("");
  const [DATA, SETDATA] = useState([]);

  useEffect(() => {
    console.log("SearchScreen");
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("fetchData()");

    let data = [];

    try {
      const response = await axios.post(BASE_URL + "/api/order/fetchOrders", {
        statuses: [0, 4],
        filter: "none",
      });

      if (response.data.success) {
        console.log(response.data.message);

        data = modifyData(response.data.message);

        SETDATA([...data]);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log("fetching orders error", error);
    }
  };

  const modifyData = (data) => {
    data.forEach((element) => {
      if (element.dropOffInfo === undefined) {
        element.dropoffInfo = {
          // date: `Not available`,
          // address: "Not available",
        };
      }
    });
    console.log("mod data :", data);

    return data;
  };

  const filterHistoriesByName = (name) => {
    name = name.toLowerCase();
    let localCount = 1;

    return DATA.filter((item) => {
      return item;
      // if (item.string.includes(name)) {
      //   return item;
      // }
    });
  };

  const renderStage = (stage) => {
    switch (stage) {
      case 0:
        return "User Pickup";

      case 1:
        return "Weighing";

      case 2:
        return "Washer Dropoff";

      case 4:
        return "Washer Pickup";

      case 5:
        return "Dropoff";
    }
  };

  const handlePickupAccept = async (order) => {
    console.log("handlePickupAccept()");

    alert(
      "Confirm order",
      "Do you want to accept this order",
      [
        {
          text: "Ask me later",
          onPress: () => console.log("Ask me later pressed"),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );

    const userData = props.user;

    try {
      const orderID = order.orderInfo.orderID;
      const response = await axios.put(
        BASE_URL + "/api/driver/assignOrderPickup",
        {
          driverEmail: userData.email,
          orderID,
        }
      );
      console.log("success");
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      console.log("accepting order", error);
      alert(error);
      return {
        success: false,
        message: caughtError("accepting order", error, 99),
      };
    }
  };

  const displayPreferences = (item) => {
    const preferencesArray = [
      item.scented ? "Scented" : null,
      item.delicate ? "Delicates" : null,
      item.separate ? "Separate" : null,
      item.towelsSheets ? "Towels/Sheets" : null,
      // item.prefs ? item.prefs : null,  // here: API call not returning proper text
    ];

    const preferencesArrayString = preferencesArray
      .filter((word) => word !== null)
      .toString();

    if (preferencesArrayString.length > 0) {
      return (
        <View style={styles.fieldContainer}>
          <View
            style={[styles.fieldNameContainer, { justifyContent: "center" }]}
          >
            <Text style={styles.fieldNameTxT}>Preferences:</Text>
          </View>
          <View
            style={[
              styles.fieldValueContainer,
              { flexDirection: "column", alignItems: "flex-end" },
            ]}
          >
            <Text style={styles.fieldValueTxT}>{preferencesArrayString}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header
        openDrawer={() => props.navigation.navigate("Home")}
        name="Washer Available Orders"
      />

      <SearchBar
        term={term}
        onTermChange={setTerm}
        placeholder="Search History"
        onTermSubmit={() => {
          console.log(`term searched is ${term}`);
        }}
      />
      <>
        <FlatList
          horizontal={false}
          // extraData={props.history}
          showsHorizontalScrollIndicator={false}
          data={DATA}
          // data={filterHistoriesByName(term)} // turn me on!!
          keyExtractor={(item) => item.orderInfo.orderID.toString()}
          renderItem={({ item }) => {
            return (
              <>
                <Container style={{ padding: 0, position: "relative" }}>
                  {/*  */}
                  <View
                    style={[
                      styles.fieldContainer,
                      {
                        backgroundColor: "#5bcae2",
                        borderTopEndRadius: 15,
                        borderTopStartRadius: 15,
                        paddingTop: 16,
                        paddingBottom: 16,
                        position: "absolute",
                        top: -10,
                        flexDirection: "column",
                        width: WIDTH * 0.95,
                      },
                    ]}
                  >
                    <View style={[styles.fieldContainer]}>
                      <View style={styles.fieldNameContainer}>
                        <Text style={styles.fieldNameTxT}>Order ID</Text>
                      </View>
                      <View style={styles.fieldValueContainer}>
                        <Text style={styles.fieldValueTxT}>
                          {`${item.orderInfo.orderID}`}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.fieldContainer]}>
                      <View style={styles.fieldNameContainer}>
                        <Text style={styles.fieldNameTxT}>Order Status</Text>
                      </View>
                      <View style={styles.fieldValueContainer}>
                        <Text style={styles.fieldValueTxT}>
                          {renderStage(item.orderInfo.status)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/*  */}
                  {/*  */}
                  <View style={[styles.fieldContainer, { paddingTop: 100 }]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Pick up date</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.pickupInfo.date}`}
                      </Text>
                    </View>
                  </View>

                  {/*  */}

                  {/*  */}
                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Pick up time</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.pickupInfo.time}`}
                      </Text>
                    </View>
                  </View>

                  {/*  */}
                  {/*  */}
                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Pick up address</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.orderInfo.address}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}

                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>User Name</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.userInfo.fname} ${item.userInfo.lname}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>
                        Pick up users number
                      </Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.userInfo.phone}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  {/*  */}
                  <DIVIDER />
                  {/*  */}
                  {/*  */}
                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Loads</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.dropoffInfo.loads}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Weight</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.dropoffInfo.weight}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <DIVIDER />
                  {/*  */}
                  {/*  */}
                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Drop off Date</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.dropoffInfo.date}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Drop off Time</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.dropoffInfo.time}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}
                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Drop off Address</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.washerInfo.address}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}

                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Washer Name</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.washerInfo.fname} ${item.washerInfo.lname}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}

                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Washer phone</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {`${item.washerInfo.phone}`}
                      </Text>
                    </View>
                  </View>
                  {/*  */}
                  {/*  */}

                  {displayPreferences(item.washerInfo)}
                  {/*  */}
                  {/*  */}
                  <DIVIDER />
                  {/*  */}
                  {/*  */}

                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Order Status</Text>
                    </View>

                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {renderStage(item.orderInfo.status)}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <BUTTON
                      text="ACCEPT"
                      style={{ backgroundColor: "#ffb600" }}
                      onPress={() => {
                        handlePickupAccept(item);
                      }}
                    />
                  </View>
                  {/*  */}
                  {/*  */}
                </Container>
              </>
            );
          }}
        />
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBoxContainer: {
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#f9f9f9",
    backgroundColor: "#f9f9f9",
    ...SHADOW,
  },
  icon: {
    width: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  addressTextInput: {
    width: "85%",
    height: 45,
    paddingLeft: 10,
  },
  fieldContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 5,
  },
  fieldNameContainer: {
    width: "35%",
  },
  fieldNameTxT: {
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  fieldValueContainer: {
    width: "65%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  fieldValueTxT: {
    fontSize: 12,
    fontWeight: "bold",
    paddingRight: 10,
  },
  addressCustomContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  dividerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    width: "95%",
    backgroundColor: "grey",
  },
});

function mapStateToProps({ history, user }) {
  return { history, user };
}

export default connect(mapStateToProps, actions)(SearchScreen);
