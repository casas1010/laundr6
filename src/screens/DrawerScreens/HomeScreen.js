// ADD PIN TO LOCATION
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import TimeModal from "../../components/TimeModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { BASE_URL } from "../../key";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { BUTTON } from "../../components/Items/";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";

import GlobalStyles from "../../components/GlobalStyles";
import {
  getLatLongFromAddress,
  verifyAddressIsInBounds,
} from "../../components/LocationHelperFunctions";
import Container from "../../components/Container";
import {
  HEIGHT,
  WIDTH,
  SHADOW,
  DIVIDER,
  FIELD_NAME_TEXT,
} from "../../components/Items/";
import { GOOGLE_MAPS_KEY } from "../../key/";
import SearchBar from "../../components/SearchBar";
import LoaderModal from "../../components/LoaderModal";

let acTimeout;
const TODAYS_DATE = new Date();
var DAY_NUMBER = TODAYS_DATE.getDay();

var DATE = TODAYS_DATE.getDate();
var MONTH = TODAYS_DATE.getMonth() + 1;
var HOUR = TODAYS_DATE.getHours(); //To get the Current Hours
var MINUTE = TODAYS_DATE.getMinutes();

const HomeScreen = (props) => {
  // date picker
  const [pickUpDate, setPickUpDate] = useState({ month: MONTH, date: DATE });
  const [displayTime, setDisplayTime] = useState({
    hour: 12,
    minute: "00",
    m: "pm",
    allowed: true,
  });
  const [userModalView, setUserModalView] = useState(true);
  const [date, setDate] = useState(new Date("May 24, 1992 12:00:00")); // Random 0 reference point
  useEffect(() => {
    onTimeChange();
  }, [pickUpDate]);

  const setDay = (dateDetails) => {
    console.log("setDate()");
    console.log("date set for laundry:  ", dateDetails);
    setPickUpDate(dateDetails);
  };

  const getDayValueFromNumber = (DAY_NUMBER) => {
    switch (DAY_NUMBER) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      case 7:
        return "Sunday";
    }
  };

  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const str = JSON.stringify(currentDate);

    var time = {
      hour: str.slice(12, 14),
      minute: str.slice(15, 17),
      allowed: true,
    };

    // the following code {} only changes the time format
    {
      console.log("hour before modification:  ", parseInt(time.hour));
      if (3 >= parseInt(time.hour) && parseInt(time.hour) >= 0) {
        // 8 => 10 pm
        console.log("hour modification case1");
        time.hour = parseInt(time.hour) + 8;
        time.allowed = false;
        time.m = "pm";
      } else if (4 == parseInt(time.hour)) {
        console.log("hour modification case2");
        time.hour = parseInt(time.hour) + 8;
        time.m = "am";
        time.allowed = false;
      } else if (15 >= parseInt(time.hour) && parseInt(time.hour) >= 4) {
        console.log("hour modification case3");
        time.m = "am";
        time.allowed = false;
        if (parseInt(time.hour) >= 14) {
          console.log("hour modification case3.1");
          time.allowed = true;
        }
        time.hour = parseInt(time.hour) - 4;
      } else if (parseInt(time.hour) == 16) {
        //edge case, setting to 12 pm
        console.log("hour modification case4");
        time.m = "pm";
        time.hour = 12;
      } else if (parseInt(time.hour) > 16) {
        console.log("hour modification case5");
        time.m = "pm";
        time.hour = parseInt(time.hour) - 16;
        time.allowed = true;
        if (parseInt(time.hour) >= 24) {
          console.log(" hour modification case5.1");
          time.allowed = false;
        }
      }
      console.log("hour after modification:  ", parseInt(time.hour));
    }

    setDisplayTime(time);
    let dayDifference = pickUpDate.date - DATE;
    console.log("dayDifference::", dayDifference);
    if (dayDifference == 1) {
      setDisplayTime(time);
      return;
    }
    // if the code has made it this far, it means that the user wants their laundry
    // cleaned today.
    // the code below changes the format to 24 hours, then takes the difference in minutes
    {
      const current24Time = moment().format("HH:mm:ss");
      const current24TimeHour = current24Time.slice(0, 2);
      const currentMinute = current24Time.slice(3, 5);

      let displayHourin24 = time.hour;
      if (time.m == "pm" && displayHourin24 < 12) {
        displayHourin24 = parseInt(displayHourin24) + 12;
      }
      console.log("displayHourin24:  ", displayHourin24);
      const displayTotalMinute =
        parseInt(displayHourin24) * 60 + parseInt(time.minute);
      console.log("displayTotalMinute:  ", displayTotalMinute);
      const currentTotalMinute =
        parseInt(current24TimeHour) * 60 + parseInt(currentMinute);
      console.log("currentTotalMinute:  ", currentTotalMinute);
      const minuteDifference = displayTotalMinute - currentTotalMinute;
      console.log("MINUTE DIFFERENCE:  ", minuteDifference);
      if (minuteDifference < 60) {
        console.log("minute differnece is less than 60");
        time.allowed = false;
        setDisplayTime(time);
        return;
      }
    }
  };

  const showModalUser = () => {
    console.log("showModalUser()");
    setUserModalView(!userModalView);
  };

  // date picker

  const [pendingOrder, setPendingOrder] = useState(null);

  const [initialRegion, setInitialRegion] = useState(undefined);
  const [newRegion, setNewRegion] = useState();

  const [userAddress, setUserAddress] = useState();
  const [pickedAddressFromDropDown, setPickedAddressFromDropDown] = useState(
    ""
  );

  const [address, setAddress] = useState();
  const [
    autoCompletePossibleLocations,
    setAutoCompletePossibleLocations,
  ] = useState({ display: true, array: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("useEffect() HomeScreen []");
    setUserLocation();
    checkCurrentOrders();
  }, []);
  const setUserLocation = async () => {
    console.log("setUserLocation() initiated");
    const userLocation = await props.location.address;
    console.log("setting userAddress state variable:   ", userLocation);
    setUserAddress(userLocation);
    console.log("setting address state variable");
    setAddress(userLocation);
    setPickedAddressFromDropDown(userLocation || "");
    console.log("setUserLocation() complete");
  };
  function goToInitialLocation() {
    console.log("goToInitialLocation() initiated");
    let initialRegion = props.location.location;

    this.mapView.animateToRegion(initialRegion, 2000);
    console.log("goToInitialLocation() complete");
  }
  useEffect(() => {
    console.log("HomeScreen useEffect() [address]");
    clearTimeout(acTimeout);
    acTimeout = setTimeout(function () {
      console.log("inside useEffect!");
      addresAutoComplete();
    }, 1200);
  }, [address]);

  const addresAutoComplete = async () => {
    console.log(`addresAutoComplete() initiated for address:  ${address} `);
    if (address == "") {
      console.log("address is empty");
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }
    if (address === userAddress) {
      console.log(`address and clients address are the same`);
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }
    if (address == undefined) {
      console.log(`address is undefined`);
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }
    if (userAddress == undefined) {
      console.log(`userAddress is undefined`);
      console.log("exiting addresAutoComplete() without API call");
      setAutoCompletePossibleLocations({ display: false, array: [] });
      return;
    }

    console.log("initiating API call for address:  ", address);
    let possibleLocations = [];
    let sanitizedAddress = address.replace(/ /g, "+");
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${sanitizedAddress}&components=country:us&key=${GOOGLE_MAPS_KEY}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data["predictions"].length; i++) {
          possibleLocations.push(data["predictions"][i]["description"]);
        }
      })
      .catch((err) => {
        console.warn(err.message);
      });
    console.log("auto complete for input address & API complete");
    console.log(`possibleLocations size:  `, possibleLocations.length);
    console.log("updating the state variable autoCompletePossibleLocations");
    // let obj = {
    //   ...autoCompletePossibleLocations,
    //   array: [...possibleLocations],
    // };
    // setAutoCompletePossibleLocations(obj);
    setAutoCompletePossibleLocations({
      ...autoCompletePossibleLocations,
      array: [...possibleLocations],
    });
  };

  const setNewRegionHelper = async (adr) => {
    console.log("setNewRegion() initiated");
    // setLoading(true);
    let latLongFromAddress = await getLatLongFromAddress(adr);
    // setLoading(false);
    console.log("latLongFromAddress:  ", latLongFromAddress);
    let _newRegion = {
      ...latLongFromAddress,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };
    console.log("newRegion:   ", _newRegion);
    // setInitialRegion(newRegion);
    setNewRegion(_newRegion);
  };

  const checkCurrentOrders = async () => {
    console.log("checkCurrentOrders()");

    const userData = props.user;
    let response;

    try {
      response = await axios.get(BASE_URL + "/api/order/getExistingOrder", {
        params: {
          email: userData.email,
        },
      });

      if (response.data.message != "N/A") {
        console.log("HERE:  ", response.data.message);
        setPendingOrder(response.data.message);
        return true;
      } else {
        // alert(response.data.message);
        return false;
      }
    } catch (error) {
      // alert(response.data.message);
      console.log("fetching orders error", error);
    }
  };

  const newOrder = async () => {
    console.log("newOrder() initiated");

    if (
      pickedAddressFromDropDown === "" ||
      pickedAddressFromDropDown !== address
    ) {
      alert(
        "Please enter an address, then pick a suggested address from the dropdown"
      );
      console.log("exiting newOrder()");
      return;
    }
    const location = await getLatLongFromAddress(pickedAddressFromDropDown);

    const addressVerificatioBoolean = await verifyAddressIsInBounds(location);

    console.log("addressVerificatioBoolean:   ", addressVerificatioBoolean);
    if (!addressVerificatioBoolean) {
      console.log("user is out of range");
      alert(
        `Sorry!  You are currently out of Lanndr' active service area. Visit the site to request Landr at your location`
      );
      return;
    }

    console.log("user is in range!");
    props.navigation.navigate("New Order Screen", {
      address: pickedAddressFromDropDown,
      location,
    });
  };

  const displayAutoCompletePossibleLocations = () => {
    console.log("displayAutoCompletePossibleLocations()");
    return autoCompletePossibleLocations.display ? (
      <FlatList
        data={autoCompletePossibleLocations.array}
        keyExtractor={(item) => item}
        // extraData={address}
        style={{
          height: 180,
          borderColor: "green",
        }}
        renderItem={({ item }) => {
          console.log("printing item");
          return (
            <TouchableOpacity
              onPress={() => {
                console.log(`item pressed:   ${item}`);
                setAddress(item);
                setPickedAddressFromDropDown(item);
                setAutoCompletePossibleLocations({ display: false, array: [] });
                setNewRegionHelper(item);
              }}
            >
              <Container style={{ margin: 5, backgroundColor: "#f8f9fa" }}>
                <Text>{item}</Text>
              </Container>
            </TouchableOpacity>
          );
        }}
      />
    ) : null;
  };

  const searchBarOnFocus = () => {
    console.log("onFocus has fired");
    setAutoCompletePossibleLocations({
      ...autoCompletePossibleLocations,
      display: true,
    });
  };

  const paymentButtonText = () => {
    if (props.payment.lastFour !== null) {
      return (
        <>
          <AntDesign name="creditcard" size={18} color="white" />
          <Text> {props.payment.lastFour}</Text>
        </>
      );
    }
    return <Text>Add Card</Text>;
  };

  const handleWasherReceived = async (order) => {
    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put("/api/driver/setWasherDelivered", {
        orderID,
      });

      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      showConsoleError("setting order as received by washer", error);
      return {
        success: false,
        message: caughtError("setting order as received by washer", error, 99),
      };
    }
  };

  const newOrderOrShowCurrentOrder = () => {
    console.log("newOrderOrShowCurrentOrder()");
    console.log(pendingOrder);
    if (pendingOrder == null) {
      newOrder();
    }
  };

  // if there is a pending order, return the pending order info.
  // Otherwise return the map.
  return pendingOrder == null ? (
    <View style={styles.container}>
      {/* <LoaderModal loading={loading} /> */}
      <MapView
        style={styles.mapStyle}
        region={newRegion}
        ref={(ref) => (this.mapView = ref)}
        zoomEnabled={true}
        showsUserLocation={true}
        onMapReady={goToInitialLocation}
        initialRegion={initialRegion}
      >
        {/* <Marker coordinate={newRegion} /> */}
      </MapView>

      <View style={styles.topInputs_ButtonContainer}>
        <TouchableOpacity onPress={props.navigation.openDrawer}>
          <Entypo
            name="menu"
            size={50}
            color="#01c9e2"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>

        <SearchBar
          term={address}
          onTermChange={(txt_address) => {
            setAutoCompletePossibleLocations({
              ...autoCompletePossibleLocations,
              display: true,
            });
            setAddress(txt_address);
          }}
          placeholder="Search Locations"
          onFocus={searchBarOnFocus}
          clear={() => {
            setAddress("");
            setPickedAddressFromDropDown("");
          }}
        />

        {displayAutoCompletePossibleLocations()}
      </View>

      <View style={styles.bottomButtonsContainer}>
        <BUTTON onPress={newOrderOrShowCurrentOrder} text="New Order" />
        <View style={styles.bottomInnerButtonsContainer}>
          <BUTTON
            onPress={() => {
              props.navigation.navigate("Payment");
            }}
            style={{ width: WIDTH * 0.4 }}
          >
            {paymentButtonText()}
          </BUTTON>

          <BUTTON
            onPress={() => {
              Linking.openURL("https://www.laundr.io/faq/");
            }}
            style={{ width: WIDTH * 0.4 }}
            text="FAQ"
          />
        </View>
      </View>

      {/* </KeyboardAwareScrollView> */}
    </View>
  ) : (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
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
            },
          ]}
        >
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Order ID</Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>
              {pendingOrder.orderInfo.orderID}
            </Text>
          </View>
        </View>

        {/*  */}
        {/*  */}
        <View style={[styles.fieldContainer, { paddingTop: 50 }]}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Address</Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>
              {pendingOrder.orderInfo.address}
              {/* {item.orderInfo.created.slice(0, 10)} */}

              {/* {item.orderInfo.created} */}
            </Text>
          </View>
        </View>
        {/*  */}
        {/*  */}
        <View style={[styles.fieldContainer]}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Pickup Date</Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>
              {pendingOrder.pickupInfo.date}
              {/* {item.orderInfo.created.slice(0, 10)} */}

              {/* {item.orderInfo.created} */}
            </Text>
          </View>
        </View>
        {/*  */}
        {/*  */}
        <View style={[styles.fieldContainer]}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Pickup Time</Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>
              {pendingOrder.pickupInfo.time}
              {/* {item.orderInfo.created.slice(0, 10)} */}
              {/* {item.orderInfo.created} */}
            </Text>
          </View>
        </View>
        {/*  */}
        <DIVIDER />
        {/*  */}
        <View style={[styles.fieldContainer]}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Dropoff Date</Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>
              {pendingOrder.dropoffInfo.date}
              {/* {item.orderInfo.created.slice(0, 10)} */}
              {/* {item.orderInfo.created} */}
            </Text>
          </View>
        </View>
        <View style={[styles.fieldContainer]}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Dropoff Time</Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>
              {pendingOrder.dropoffInfo.time}
              {/* {item.orderInfo.created.slice(0, 10)} */}
              {/* {item.orderInfo.created} */}
            </Text>
          </View>
        </View>
        {/*  */}
        {/*  */}
        <DIVIDER />
        <View style={[styles.fieldContainer]}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Weight</Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>
              {pendingOrder.orderInfo.weight}
              {/* {item.orderInfo.created.slice(0, 10)} */}
              {/* {item.orderInfo.created} */}
            </Text>
          </View>
        </View>
        <View style={[styles.fieldContainer]}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameTxT}>Price</Text>
          </View>
          <View style={styles.fieldValueContainer}>
            <Text style={styles.fieldValueTxT}>
              {pendingOrder.orderInfo.cost == -1
                ? "TBD"
                : pendingOrder.orderInfo.cost}
              {/* {item.orderInfo.created.slice(0, 10)} */}
              {/* {item.orderInfo.created} */}
            </Text>
          </View>
        </View>
      </Container>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {pendingOrder.orderInfo.status == 3 ? (
          <BUTTON
            text="SET DROPOFF"
            style={{ backgroundColor: "#ffb600" }}
            onPress={() => {
              setUserModalView(!userModalView);
            }}
          />
        ) : null}

        <TimeModal
          title="Select User Type"
          setCardTypeHelper={showModalUser}
          showModal={showModalUser}
          modalView={userModalView}
        >
          <Text style={[FIELD_NAME_TEXT]}>
            What day would you like your laundry picked up?
          </Text>
          <View style={styles.container_dates}>
            <TouchableOpacity
              style={[
                styles.container_date,
                {
                  backgroundColor: pickUpDate.date == DATE ? "#01c9e2" : "grey",
                },
              ]}
              onPress={() =>
                setDay({
                  day: getDayValueFromNumber(DAY_NUMBER),
                  month: MONTH,
                  date: DATE,
                })
              }
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: pickUpDate.date == DATE ? "white" : "black",
                  // paddingLeft:10,
                }}
              >
                Today:
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: pickUpDate.date == DATE ? "white" : "black",
                  paddingLeft: 10,
                }}
              >
                {MONTH}/{DATE}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setDay({
                  day: getDayValueFromNumber(DAY_NUMBER + 1),
                  month: MONTH,
                  date: DATE + 1,
                })
              }
              style={[
                styles.container_date,
                {
                  backgroundColor:
                    pickUpDate.date == DATE + 1 ? "#01c9e2" : "grey",
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: pickUpDate.date == DATE + 1 ? "white" : "black",
                }}
              >
                Tomorrow:
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: pickUpDate.date == DATE + 1 ? "white" : "black",
                }}
              >
                {MONTH}/{DATE + 1}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[FIELD_NAME_TEXT]}>
            What time would you like your laundry to be picked up?
          </Text>

          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"time"}
            is24Hour={false}
            display="default"
            onChange={onTimeChange}
          />
          <Text
            style={{
              color: displayTime.allowed ? "black" : "red",
            }}
          >
            Monday through Friday from 10 am to 7 pm. There must be at least 1
            hour difference between the order time and current time.
          </Text>
          {displayTime.allowed ? (
            <BUTTON
              text="CONFIRM"
              style={{ backgroundColor: "#ffb600" }}
              onPress={() => {
                setUserModalView(!userModalView);
              }}
            />
          ) : null}

          {/* here  handleWasherReceived */}
        </TimeModal>

        <BUTTON
          text="CANCEL"
          style={{ backgroundColor: "#5bcae2" }}
          onPress={() => {
            setUserModalView(!userModalView);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  topInputs_ButtonContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 22,
  },
  menuIcon: {
    paddingLeft: 15,
  },
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
  bottomButtonsContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 40,
    height: HEIGHT * 0.2,
    width: WIDTH,
    alignItems: "center",
  },
  bottomInnerButtonsContainer: {
    flexDirection: "row",
    position: "relative",
    paddingTop: 10,
  },
  newOrderButton: {
    backgroundColor: "#f9f9f9",
    position: "relative",
    justifyContent: "center",
    borderColor: "#f9f9f9",
    width: WIDTH * 0.8,
    height: 50,
    borderWidth: 1,
    borderRadius: 20,
    ...SHADOW,
  },
  noCard_FAQButton: {
    height: 50,
    width: 50,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#f9f9f9",
    position: "relative",
    borderWidth: 1,
    borderRadius: 20,
    width: WIDTH * 0.4,
    ...SHADOW,
  },
  fieldValueTxT: {
    fontSize: 12,
    fontWeight: "bold",
    paddingRight: 10,
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
  fieldContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginTop: 5,
  },
  container_dates: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:'red',
    // padding:100,
    // borderRadius: 20,
  },
});

function mapStateToProps({ location, payment, user }) {
  return { location, payment, user };
}
// export default HomeScreen;
export default connect(mapStateToProps)(HomeScreen);
