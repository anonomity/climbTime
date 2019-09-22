import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  TextInput,
  Alert,
  FlatList
} from "react-native";
import { Form, Input, Item, Label, Button, Card, Content } from "native-base";
import * as firebase from "firebase";

import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
let dbVals = [];
let test = true;
export default class AddProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      data: [0],
      labels: ["start"],
      graphTitle: "",
      graphTitle2: "",
      name: "",
      arr: [],
      fullDate: ""
    };
  }

  static navigationOptions = {
    title: "Graph",
    header: null
  };

  senditems = item => {
    var itemListRef = firebase.database().ref(`Graphs/${this.state.name}`);
    var newItemRef = itemListRef.push();
    newItemRef.set({
      Values: item,
      Dates: this.state.fullDate
    });
  };

  convertToGraph = l => {
    var tempdata = [0]
    var tempLabel = ["start"]
    var temp1 = parseInt(this.state.arr[0].money)
    var temp2 = this.state.arr[0].time
    for(let i =1; i < this.state.arr.length; i++){
      if(this.state.arr[i].time === temp2){
        temp1 = temp1 + parseInt(this.state.arr[i].money)
        temp2 = this.state.arr[i].time
      }
      else{
        tempdata.push(temp1);
        tempLabel.push(temp2);
        temp1 = parseInt(this.state.arr[i].money)
        temp2 = this.state.arr[i].time
      }
    }
    tempdata.push(temp1);
    tempLabel.push(temp2);

    this.setState({
      labels: tempLabel,
      data: tempdata,
    });
  
  };

  // Retrieves Default Graph which only displays values for the particular month
  filterDefault = (v,l) => {

    this.setState({
      arr: v.filter(v => v.time.split("/")[1] == new Date().getMonth() + 1)
    });
    //function that cycles through the array, and adds values together that are in the same day
    this.convertToGraph(l);
  };

  reset = () => {
    this.setState({
      data: [0],
      labels: ["start"],
      arr: []
    });
    this.props.navigation.navigate("Home");
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(authenticate => {
      firebase
        .database()
        .ref(`Graphs/${authenticate.displayName}`)
        .once("value", snapshot => {
          
          snapshot.forEach(child => {
            var vals = child.val();
            
            dbVals.push({ time: vals.Dates, money: vals.Values });
          });
          this.filterDefault(dbVals,dbVals.length);
          dbVals.length =0
        });

      var ref = firebase
        .database()
        .ref(`GraphName/${authenticate.displayName}`);
      ref.on("value", snapshot => {
        snapshot.forEach(child => {
          var vals2 = child.val();
          const imie = authenticate.displayName;
          this.setState({
            name: imie,
            graphTitle2: vals2.Graphlabel
          });
        });
      });
    });

    var that = this;
    var day = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year

    that.setState({
      //Setting the value of the date time
      fullDate: day + "/" + month + "/" + year
    });
  }

  sendLabel = labelB => {
    var graphRef = firebase.database().ref(`GraphName/${this.state.name}`);
    graphRef.once("value").then(function(snapshot) {
      var newItemRef2 = graphRef.push();
      newItemRef2.set({
        Graphlabel: labelB
      });
    });
  };
  render() {
    return (
      <Content>
        <Item style={styles.button}>
          <Input
            onChangeText={labelB => {
              this.setState({ graphTitle: labelB });
            }}
            value={this.state.graphTitle}
            placeholder="Title Name"
          />
        </Item>
        <Button
          full
          light
          onPress={() => {
            this.sendLabel(this.state.graphTitle);
          }}
        >
          <Text>Save</Text>
        </Button>

        <LineChart
          data={{
            labels: this.state.labels,
            datasets: [
              {
                data: this.state.data
              }
            ]
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
        />
        <Text style={styles.title}>{this.state.graphTitle2}</Text>
        <TextInput
          style={styles.itemInput}
          onChangeText={text => {
            this.setState({ amount: text });
          }}
          value={this.state.amount}
          placeholder="Enter Amount"
        />

        <Button
          style={styles.button}
          full
          block
          success
          onPress={() => {
            this.senditems(this.state.amount);
          }}
        >
          <Text style={styles.buttonText}>Submit to Database</Text>
        </Button>

        <Button
          style={styles.button}
          full
          block
          danger
          onPress={() => {
            this.reset();
          }}
        >
          <Text style={styles.buttonText}>Home</Text>
        </Button>
      </Content>
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
    borderRadius: 100,
    bottom: 50
  },
  userDetails: {},

  button: {
    marginTop: 20
  },

  buttonText: {
    fontSize: 18,
    color: "#111",
    alignSelf: "center"
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: "center"
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    color: "black"
  }
});

const chartConfig = {
  backgroundGradientFrom: "#B83227",
  backgroundGradientTo: "#BA2F16",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2 // optional, default 3
};
