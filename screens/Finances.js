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
import { Form, Input, Item, Label, Button, Card } from "native-base";
import * as firebase from "firebase";

import { LineChart } from "react-native-chart-kit";


const screenWidth = Dimensions.get("window").width;

export default class Finances extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      date: "",
      items: [],
      data: [0],
      labels: ["start"]
    };
  }

  senditems = (item, item2) => {
    var itemListRef = firebase.database().ref("Finance");
    var newItemRef = itemListRef.push();
    newItemRef.set({
      Values: item,
      Dates: item2
    });
    this.onAddItem();
    //   firebase.database().ref('Graphs').on('child_added', function(snapshot) {
    //     var dates2 = snapshot.val().Values

    //     console.log(dates2)

    // });
  };

  static navigationOptions = {
    title: "Financez",
    header: null
  };

  componentDidMount() {
    var temp;
    firebase
      .database()
      .ref("Finance")
      .once("value", snapshot => {
        snapshot.forEach(child => {
          var vals = child.val();
            console.log(vals.Dates)
          if(temp != vals.Dates)  { 
          this.setState(state => {
            const data = state.data.concat(vals.Values);
            const labels = state.labels.concat(vals.Dates);

            return {
              data,
              labels,
              date: "",
              amount: ""
            };
          });
        } else {
            console.log("this went through")
            var a = this.state.labels.indexOf(this.state.date);
            var b = parseInt(this.state.data[a]) + parseInt(this.state.amount);
            this.setState(data => {
            this.state.data[a] = b;
            });
            this.forceUpdate();
        }
        console.log(vals.Dates)
        temp = vals.Dates
        });
      });
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year

    that.setState({
      //Setting the value of the date time
      date2: date + "/" + month
    });
  }

  onAddItem = () => {
    this.setState(state => {
      const data = state.data.concat(state.amount);
      const labels = state.labels.concat(state.date2);

      return {
        data,
        labels,
        date: "",
        amount: ""
      };
    });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
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
        <Text style={styles.title}>Add Item</Text>
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
          rounded
          success
          onPress={() => {
            this.senditems(this.state.amount, this.state.date2);
          }}
        >
          <Text style={styles.buttonText}>Submit to Database</Text>
        </Button>

        <Button
          style={styles.button}
          full
          rounded
          danger
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        >
          <Text style={styles.buttonText}>Home</Text>
        </Button>
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
