// // REVERSE ORDER IN HISTORY, MAKE IT SO IT GOES BY DATE IN ORDER

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   FlatList,
//   SafeAreaView,
//   Dimensions,
//   TouchableOpacity,
//   Image,
//   TouchableOpacityBase,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// import GlobalStyles from "../../components/GlobalStyles";
// import Header from "../../components/Header";
// import Container from "../../components/Container";
// import { DIVIDER } from "../../components/Items/";
// import { Entypo } from "@expo/vector-icons";
// import { FontAwesome5 } from "@expo/vector-icons";
// import { Feather } from "@expo/vector-icons";
// import { HEIGHT, WIDTH, SHADOW } from "../../components/Items/";
// import { BASE_URL } from "../../key";

// import { connect } from "react-redux";
// import * as actions from "../../actions/index";

// const SCREEN_WIDTH = Dimensions.get("window").width;
// const BUTTON_WIDTH = SCREEN_WIDTH * 0.3;
// const HEADER = [
//   { key: "Name" },
//   { key: "Date/Time" },
//   { key: "Address" },
//   { key: "Phone" },
//   { key: "Instructions" },
//   { key: "Load Size" },
//   { key: "Stage" },
//   { key: "Actions" },
// ];

// const AvailableOrdersScreens = (props) => {
//   const [orders, setOrders] = useState();
//   const [ordersAdjusted, setOrdersAdjusted] = useState();

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     console.log("fetchOrders()");
//     try {
//       const response = await axios.post(BASE_URL + "/api/order/fetchOrders", {
//         statuses: [0, 4],
//         filter: "none",
//       });

//       if (response.data.success) {
//         console.log(response.data);

//         adjustData(response.data.message);
//       } else {
//         alert(response.data.message);
//       }
//     } catch (error) {
//       console.log("fetching orders error", error);
//       alert(caughtError("fetching orders", error, 99));
//     }
//   };

//   const renderStage = (stage) => {
//     switch (stage) {
//       case 0:
//         return "User Pickup";

//       case 1:
//         return "Weighing";

//       case 2:
//         return "Washer Dropoff";

//       case 4:
//         return "Washer Pickup";

//       case 5:
//         return "Dropoff";
//     }
//   };

//   const adjustData = (data) => {
//     console.log("adjustData()");
//     let localData = [];

//     // set headers as the first obj
//     // flat list displays first obj different than everything else
//     let LO = {};
//     LO.Name = "Name";

//     LO["Date/Time_pickUp"] = "Pick Up Date/Time";
//     LO["Date/Time_dropOff"] = "Drop Off Date/Time";

//     LO["Address_pickUp"] = `Pick Up Address`;
//     LO["Address_dropOff"] = `Drop Off Address`;
//     LO["Phone_user"] = `User Number`;
//     LO["Phone_washer"] = `Washer Number`;
//     LO["Instructions"] = "Instructions";
//     LO["Load Size"] = `Size`;
//     LO["Stage"] = "Stage";
//     LO["Action"] = "Action";
//     localData.push(LO);
//     //set headers

//     for (const obj of data) {
//       let LO = {}; // local object

//       LO.Name = `${obj.userInfo.fname} ${obj.userInfo.lname}`;
//       LO[
//         "Date/Time_pickUp"
//       ] = `${obj.pickupInfo.date} @ ${obj.pickupInfo.time}`;
//       // pick up and drop off code
//       if (obj.dropOffInfo === undefined) {
//         LO["Date/Time_dropOff"] = `N/A @ N/A`;
//       } else {
//         LO["Date/Time_dropOff"] = `${obj.dropOffInfo.date}`;
//       }
//       // pick up and drop off code
//       LO["Address_pickUp"] = `${obj.orderInfo.address}`;
//       LO["Address_dropOff"] = `${obj.washerInfo.address}`;
//       LO["Phone_user"] = `${obj.userInfo.phone}`;
//       LO["Phone_washer"] = `${obj.washerInfo.phone}`;
//       LO["Instructions"] = "INSERT INSTRUCTIONS FUNCTIONALITY";
//       LO["Load Size"] = `${obj.orderInfo.loads}`;
//       LO["Stage"] = renderStage(obj.orderInfo.status);
//       LO["_id"] = `${obj._id}`;
//       localData.push(LO);
//       setOrders(localData);
//     }
//   };

//   const consthandlePickupAccept = async (orderID) => {
//     console.log('consthandlePickupAccept()')
//     console.log(orderId)
//     try {
//       const response = await axios.put(
//         BASE_URL + "/api/driver/assignOrderPickup",
//         {
//           driverEmail: props.user.email,
//           orderID,
//         }
//       );

//       return { success: response.data.success, message: response.data.message };
//     } catch (error) {
//       alert("accepting order", error);
//       return {
//         success: false,
//         // message: caughtError("accepting order", error, 99),
//       };
//     }
//   };

//   const handleDropoffAccept = async (orderID) => {
//     console.log("handleDropoffAccept()");
//     try {
//       const response = await axios.post(
//         BASE_URL + "/api/driver/assignOrderDropoff",
//         {
//           driverEmail: props.user.email,
//           orderID,
//         }
//       );

//       return { success: response.data.success, message: response.data.message };
//     } catch (error) {
//       console.log("accepting order for dropoff", error);
//       alert(error);
//     }
//   };

//   const FlatListItemSeparator = () => {
//     return (
//       <View
//         style={{
//           height: 1,
//           width: "100%",
//           backgroundColor: "#607D8B",
//         }}
//       />
//     );
//   };

//   return (
//     <SafeAreaView style={GlobalStyles.droidSafeArea}>
//       <Header
//         openDrawer={() => props.navigation.navigate("Home")}
//         name="Available Orders"
//       />
//       <ScrollView horizontal={true}>
//         <FlatList
//           horizontal={false}
//           showsHorizontalScrollIndicator={true}
//           ItemSeparatorComponent={FlatListItemSeparator}
//           scrollEnabled
//           data={orders}
//           keyExtractor={(item) => {
//             console.log("ITEM: ", item);
//             return item._id;
//           }}
//           renderItem={({ item, index }) => {
//             if (index == 0) {
//               return (
//                 <View style={{ flexDirection: "row", paddingTop: 15 }}>
//                   <Text style={styles.header}>{item["Date/Time_pickUp"]}</Text>

//                   <Text style={styles.header}>{item["Date/Time_dropOff"]}</Text>
//                   <Text style={styles.header}>{item["Address_pickUp"]}</Text>
//                   <Text style={styles.header}>{item["Address_dropOff"]}</Text>
//                   <Text style={styles.header}>{item["Phone_user"]}</Text>
//                   <Text style={styles.header}>{item["Phone_washer"]}</Text>
//                   {/* <Text style={index!=0?styles.cell:styles.header}>{item["Instructions"]}</Text> */}
//                   <Text style={styles.header}>{item["Load Size"]}</Text>
//                   <Text style={styles.header}>{item["Stage"]}</Text>
//                   <Text style={styles.header}>{item["Action"]}</Text>
//                 </View>
//               );
//             } else {
//               return (
//                 <View style={{ flexDirection: "row", paddingTop: 15 }}>
//                   <Text style={styles.cell}>{item["Date/Time_pickUp"]}</Text>

//                   <Text style={styles.cell}>{item["Date/Time_dropOff"]}</Text>
//                   <Text style={styles.cell}>{item["Address_pickUp"]}</Text>
//                   <Text style={styles.cell}>{item["Address_dropOff"]}</Text>
//                   <Text style={styles.cell}>{item["Phone_user"]}</Text>
//                   <Text style={styles.cell}>{item["Phone_washer"]}</Text>
//                   {/* <Text style={index!=0?styles.cell:styles.header}>{item["Instructions"]}</Text> */}
//                   <Text style={styles.cell}>{item["Load Size"]}</Text>
//                   <Text style={styles.cell}>{item["Stage"]}</Text>
//                   <TouchableOpacity
//                     style={styles.cell}
//                     onPress={() => {
//                       // consthandlePickupAccept(item["_id"]);
//                       console.log(item["_id"]);
//                     }}
//                   >
//                     <Text>ACCEPT</Text>
//                   </TouchableOpacity>
//                 </View>
//               );
//             }
//           }}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   cell: {
//     width: 150,
//     padding: 10,
//     alignItems: "center",
//   },
//   header: {
//     width: 150,
//     alignItems: "center",
//     backgroundColor: "#5bcae2",
//     padding: 10,

//     color: "white",
//     fontWeight: "bold",
//   },
// });

// function mapStateToProps({ history, user }) {
//   return { history, user };
// }

// export default connect(mapStateToProps, actions)(AvailableOrdersScreens);

// REVERSE ORDER IN HISTORY, MAKE IT SO IT GOES BY DATE IN ORDER

// REVERSE ORDER IN HISTORY, MAKE IT SO IT GOES BY DATE IN ORDER
// REVERSE ORDER IN HISTORY, MAKE IT SO IT GOES BY DATE IN ORDER

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
import { DIVIDER } from "../../components/Items/";
import { HEIGHT, WIDTH, SHADOW } from "../../components/Items/";

import { connect } from "react-redux";
import * as actions from "../../actions/index";

import SearchBar from "../../components/SearchBar";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.3;

const SearchScreen = (props) => {
  const [term, setTerm] = useState("");
  const [DATA, SETDATA] = useState([]);
  const [count, setCount] = useState(1);

  useEffect(() => {
    console.log("SearchScreen");
    // console.log(props.history);

    fetchData();
    console.log(props.history[0]);
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
        element.dropoffInfo = {"date": `Not available`};
      }
 
    });
  console.log('mod data :',data)

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

  const dropOffDetails = (item) => {
    if (item.dropOffInfo === null) {
      return <Text>dropOffDetails</Text>;
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header
        openDrawer={() => props.navigation.navigate("Home")}
        name="History"
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
                      },
                    ]}
                  >
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Order ID</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {item.orderInfo.orderID}
                      </Text>
                    </View>
                  </View>
                  {/*  */}

                  {/*  */}
                  <View style={[styles.fieldContainer, { paddingTop: 50 }]}>
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

                  <View style={[styles.fieldContainer]}>
                    <View style={styles.fieldNameContainer}>
                      <Text style={styles.fieldNameTxT}>Drop off Date</Text>
                    </View>
                    <View style={styles.fieldValueContainer}>
                      <Text style={styles.fieldValueTxT}>
                        {/* {`${item.dropOffInfo.date}`} */}
                      </Text>
                    </View>
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

function mapStateToProps({ history }) {
  return { history };
}

export default connect(mapStateToProps, actions)(SearchScreen);
