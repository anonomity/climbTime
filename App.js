import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import * as firebase from "firebase";

import HomeScreen from "./screens/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AddProgress from "./screens/AddProgress";
import Finances from "./screens/Finances";
import Third from "./screens/Third";
import Fourth from "./screens/Fourth";
import Fifth from "./screens/Fifth";
import Sixth from "./screens/Sixth";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDFAP9vKpgd5E9-5IrN2K_F4rm36gMuYwU",
  authDomain: "climbtime-62821.firebaseapp.com",
  databaseURL: "https://climbtime-62821.firebaseio.com",
  projectId: "climbtime-62821",
  storageBucket: "climbtime-62821.appspot.com",
  messagingSenderId: "386331107411",
  appId: "1:386331107411:web:c61710c6579202a7"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
const MainNavigator = createStackNavigator(
  {
    Loading: { screen: LoadingScreen },
    Signin: { screen: SignInScreen },
    Signup: { screen: SignUpScreen },
    Home: { screen: HomeScreen },
    Graph1: { screen: Finances },
    Graph2: { screen: AddProgress },
    Graph3: { screen: Third },
    Graph4: { screen: Fourth },
    Graph5: { screen: Fifth },
    Graph6: { screen: Sixth }
  },
  {
    initialRouteName: "Loading"
  }
);

const App = createAppContainer(MainNavigator);
export default App;
