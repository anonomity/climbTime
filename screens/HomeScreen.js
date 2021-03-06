import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Form, Input, Item, Label, Button } from "native-base";
import * as firebase from "firebase";
import ThreeAxisSensor from "expo-sensors/build/ThreeAxisSensor";
import { grey } from "ansi-colors";



export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      hours: "",
      minutes: ""
    };
  }
  static navigationOptions = {
    title: "Home",
    header: null
  };

  componentDidMount() {
    
    firebase.auth().onAuthStateChanged(authenticate => {
      if (authenticate) {
        this.setState({
          name: authenticate.displayName
        });
        var name = authenticate.displayName
      } else {
        this.props.navigation.replace("Signin");
      }
    });
    var that = this;
    var time = new Date().getHours();
    var time2 = new Date().getMinutes();
    
    that.setState({
      hours: time,
      minutes: time2
    });
  }

  signoutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signout"))
      .catch(error => alert(error.message));
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.HeaderText}>ClimbTime</Text>
        <Text>Hey {this.state.name}!</Text>
        <View style={styles.logoContainer}>
          <Image
            style={styles.iconContainer}
            source={require("../assets/Progress.png")}
          />
        </View>
        <View style={styles.logoBut}>
          <View style={styles.row1}>
            <TouchableOpacity
              style={styles.imgStyle}
              onPress={() => {
                this.props.navigation.navigate("Graph1");
              }}
            >
              <Image style={styles.img} source={require("../assets/1.png")} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imgStyle}
              onPress={() => {
                this.props.navigation.navigate("Graph2");
              }}
            >
              <Image style={styles.img} source={require("../assets/2.png")} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imgStyle}
              onPress={() => {
                this.props.navigation.navigate("Graph3");
              }}
            >
              <Image style={styles.img} source={require("../assets/3.png")} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.row2}>
            <TouchableOpacity
              style={styles.imgStyle}
              onPress={() => {
                this.props.navigation.navigate("Graph4");
              }}
            >
              <Image style={styles.img} source={require("../assets/4.png")} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imgStyle}
              onPress={() => {
                this.props.navigation.navigate("Graph5");
              }}
            >
              <Image style={styles.img} source={require("../assets/5.png")} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imgStyle}
              onPress={() => {
                this.props.navigation.navigate("Graph6");
              }}
            >
              <Image style={styles.img} source={require("../assets/6.png")} />
            </TouchableOpacity>
            </View>
        </View>
        <TouchableOpacity
          style={styles.floatButton2}
          onPress={() => {
            this.signoutUser();
          }}
        >
          <Text style={styles.buttonPress}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const genColor = "#004D40"

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
  row1: { 
    flexDirection: "row", 
    justifyContent: "center",
    position: "relative",
    alignContent: "center",

  },
  row2: { 
    flexDirection: "row", 
    justifyContent: "center",
    position: "relative",
    alignContent: "center",
    
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
    backgroundColor: genColor
  },

  img: {
    width: 125,
    height: 125
  },
  logoBut: {
    marginTop: 25,
    marginBottom: 375
  },
  imgStyle: {
    borderWidth: 2,
    shadowRadius: 100,
    shadowColor:"#7B8788",
    borderColor:"#E0E0E0",
    borderRadius: 50
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
   
  },
  iconContainer: {
    width: 175,
    height: 175,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: genColor,
    borderRadius: 100
  },


  HeaderText: {
    fontSize: 55,
    fontWeight: "400",
    color: genColor,
    fontWeight: "bold",
  }
});
