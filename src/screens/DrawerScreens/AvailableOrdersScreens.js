import { connect } from "react-redux";
import * as actions from "../../actions";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";
import { EvilIcons } from "@expo/vector-icons";

import GlobalStyles from "../../components/GlobalStyles";
import Header from "../../components/Header";
import MenuModal from "../../components/MenuModal";
import Container from "../../components/Container";
import LoaderModal from "../../components/LoaderModal";
import {
  HEIGHT,
  BUTTON,
  FIELD_NAME_TEXT,
  FIELD_VALUE_TEXT,
  FIELD_VALUE_CONTAINER,
} from "../../components/Items/";
import { CITIES } from "../../components/Data/";

const AvailableOrdersScreen = (props) => {
  

return(
  
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Header
        openDrawer={() => props.navigation.navigate("Home")}
        name="Account"
      />

      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
      >
        <ScrollView>
            <Text>AvailableOrdersScreen</Text>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lockButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    // top: HEIGHT * 0.1,
    // here
    zIndex: 3,
    height: 80,
    width: 80,

    borderRadius: 80,
  },
  container_Tittle_Input: {
    marginTop: 10,
    marginBottom: 10,
  },
});

function mapStateToProps({ auth, user }) {
  return { auth, user };
}

export default connect(mapStateToProps, actions)(AvailableOrdersScreen);
