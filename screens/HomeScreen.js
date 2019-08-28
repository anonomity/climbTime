import React from "react";
import { StyleSheet, Text, View, Image,TouchableOpacity } from "react-native";
import { Form, Input, Item, Label, Button } from "native-base";
import * as firebase from "firebase";
import ThreeAxisSensor from "expo-sensors/build/ThreeAxisSensor";

export default class HomeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name: ""
    }
  }
  static navigationOptions = {
    title: "Home",
    header: null
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(authenticate => {
      if(authenticate){
        this.setState({
          name: authenticate.displayName
        })
      } else {
        this.props.navigation.replace("Signin");
      }
    })
  }

  signoutUser =() => {
      firebase
        .auth()
        .signOut()
        .then(() => console.log("signout") )
        .catch( error => alert(error.message))
  }
   render() {
    return (
      <View style={styles.container}>
        <Text style={styles.HeaderText}>ClimbTime</Text>
        <View style={styles.logoContainer}>
        
          <Image style={styles.iconContainer} source={require("../assets/Progress.png")} />
          
        </View>
        <Text style={styles.infoText}>Powered by Progress</Text>
        <View style={styles.userDetails}>
          <Text>Welcome {this.state.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.floatButton}
          onPress={() => {
            this.props.navigation.navigate("Graph");
          }}
        ><Text style={styles.buttonPress}>Start Tracking..</Text>
         
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.floatButton2}
          onPress ={() => {
            this.signoutUser();
          }}
        ><Text style={styles.buttonPress}>Sign Out</Text>
         
        </TouchableOpacity>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    margin: 20
  },
  buttonPress: {
    color: "#FFF",
    fontSize: 25,
    fontWeight: "400"
  },
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 500,
    fontWeight: "bold",
    position: "absolute",
    bottom: 85,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFF",
    height: 55,
    backgroundColor: "#B83227"
  },
  floatButton2: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 500,
    fontWeight: "bold",
    position: "absolute",
    bottom: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFF",
    height: 55,
    backgroundColor: "#019031"
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 100
  },
  iconContainer: {
    width: 250,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B83227",
    borderRadius: 100
   
  },
  userDetails: {},
  infoText: {
    fontSize: 25,
    fontWeight: "200",
    paddingLeft: 10,
    paddingTop: 2
  },
  button: {
    marginTop: 20
  },
  buttonText: {
    color: "#fff"
  },
  HeaderText: {
    fontSize: 80,
    fontWeight: "400",
    color: "#B83227",
    fontWeight: "bold"

  }
});
