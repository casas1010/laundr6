import React, { useState, useEffect } from "react";
import { View,StyleSheet } from "react-native";
import _ from "lodash";
import {
  KEYBOARD_AWARE_SCROLL_VIEW_STYLE,
} from "../../components/Items/";
import Loader from "../../components/Loader";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import * as actions from "../../actions/";

const AuthScreen = (props) => {

  useEffect(() => {
    async function locationAndTokenFlow() {
      await props.getUserLocation();
    }
    locationAndTokenFlow();
    props.doAuthLogin(props);
  }, []);

  return (
    <View
      style={styles.container}
    >
      <Animatable.View
        animation="zoomIn"
        iterationCount={1}
        style={styles.animatableContainer}
      >
        <Loader />
      </Animatable.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container:{
    alignItems: "center",
    justifyContent: "center",
    ...KEYBOARD_AWARE_SCROLL_VIEW_STYLE,
  },
  animatableContainer:{
    alignItems: "center",
    justifyContent: "center",
  }
})

export default connect(null, actions)(AuthScreen);
