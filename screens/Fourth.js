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
  FlatList,
  TouchableOpacity
} from "react-native";
import {
  Form,
  Input,
  Item,
  Label,
  Button,
  Card,
  Content,
  Picker,
  Icon
} from "native-base";
import * as firebase from "firebase";

import { LineChart } from "react-native-chart-kit";
import { name } from "./HomeScreen";

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
      fullArr: [],
      selected: ""
    };
  }

  static navigationOptions = {
    title: "Graph4",
    header: null
  };

  onValueChange(val) {
    this.setState({
      selected: val
    });

    this.callDb(this.state.name, val);
  }

  senditems = (item, num) => {
    var itemListRef = firebase.database().ref(`Graph4/${this.state.name}`);
    var newItemRef = itemListRef.push();
    newItemRef.set({
      Values: item,
      Year: new Date().getFullYear(),
      Day: new Date().getDate(),
      Month: new Date().getMonth() + 1,
      Time: new Date().getHours() + ":" + new Date().getMinutes()
    });

    var that = this;
    var day = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hour = new Date().getHours();
    var minutes = new Date().getMinutes();

    if (num == 0) {
      that.setState({
        labels: [...this.state.labels, day],
        data: [...this.state.data, item],
        amount: ""
      });
    } else if (num == 1) {
      that.setState({
        labels: [...this.state.labels, month],
        data: [...this.state.data, item],
        amount: ""
      });
    } else if (num == 2) {
      that.setState({
        labels: [...this.state.labels, hour + ":" + minutes],
        data: [...this.state.data, item],
        amount: ""
      });
    }
  };

  convertToGraph = num => {
    var tempdata = [0];
    var tempLabel = ["start"];

    if (num == 0) {
      var temp1 = parseInt(this.state.arr[0].money);
      var temp2 = this.state.arr[0].month;
      for (let i = 1; i < this.state.arr.length; i++) {
        if (this.state.arr[i].month === temp2) {
          temp1 = temp1 + parseInt(this.state.arr[i].money);
          temp2 = this.state.arr[i].month;
        } else {
          tempdata.push(temp1);
          tempLabel.push(temp2);
          temp1 = parseInt(this.state.arr[i].money);
          temp2 = this.state.arr[i].month;
        }
      }
    } else if (num == 1) {
      var temp1 = parseInt(this.state.arr[0].money);
      var temp2 = this.state.arr[0].day;
      for (let i = 1; i < this.state.arr.length; i++) {
        if (this.state.arr[i].day === temp2) {
          temp1 = temp1 + parseInt(this.state.arr[i].money);
          temp2 = this.state.arr[i].day;
        } else {
          tempdata.push(temp1);
          tempLabel.push(temp2);
          temp1 = parseInt(this.state.arr[i].money);
          temp2 = this.state.arr[i].day;
        }
      }
    } else if (num == 2) {
      var temp1 = parseInt(this.state.arr[0].money);
      var temp2 = this.state.arr[0].time;
      for (let i = 1; i < this.state.arr.length; i++) {
        if (this.state.arr[i].time === temp2) {
          temp1 = temp1 + parseInt(this.state.arr[i].money);
          temp2 = this.state.arr[i].time;
        } else {
          tempdata.push(temp1);
          tempLabel.push(temp2);
          temp1 = parseInt(this.state.arr[i].money);
          temp2 = this.state.arr[i].time;
        }
      }
    }

    tempdata.push(temp1);
    tempLabel.push(temp2);

    this.setState({
      labels: tempLabel,
      data: tempdata
    });
  };

  callDb = (name, num) => {
    firebase
      .database()
      .ref(`Graph4/${name}`)
      .once("value", snapshot => {
        snapshot.forEach(child => {
          var vals = child.val();
          dbVals.push({
            time: vals.Time,
            year: vals.Year,
            day: vals.Day,
            month: vals.Month,
            money: vals.Values
          });
        });
        if (dbVals.length > 0) {
          this.filterDefault(dbVals, num);
          dbVals.length = 0;
        }
      });
  };

  // Retrieves Default Graph which only displays values for the particular month
  filterDefault = (v, num) => {
    if (num == 1) {
      this.setState({
        arr: v.filter(v => v.month == new Date().getMonth() + 1)
      });
    } else if (num == 0) {
      this.setState({
        arr: v.filter(v => v.year == new Date().getFullYear())
      });
    } else if (num == 2) {
      this.setState({
        arr: v.filter(v => v.day == new Date().getDate())
      });
    }

    //function that cycles through the array, and adds values together that are in the same day
    this.convertToGraph(num);
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(authenticate => {
      if (authenticate) {
        this.callDb(authenticate.displayName, 1);
        var ref = firebase.database().ref(`GraphName4`);
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
      } else {
        this.props.navigation.replace("Signin");
      }
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
    firebase
      .database()
      .ref()
      .child("GraphName4")
      .update({ Graphlabel: labelB });

    var ref = firebase.database().ref(`GraphName4`);
    ref.on("value", snapshot => {
      snapshot.forEach(child => {
        var vals2 = child.val();

        this.setState({
          graphTitle2: vals2.Graphlabel
        });
      });
    });
  };
  render() {
    return (
      <Content>
        <Item style={styles.button}>
          <Input
            style={styles.firstIn}
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
        <Form style={styles.formCon}>
          <Picker
            mode="dropdown"
            iosHeader="Select how to see Graph"
            iosIcon={<Icon name="arrow-down" />}
            style={{ width: undefined }}
            selectedValue={this.state.selected}
            onValueChange={this.onValueChange.bind(this)}
          >
            <Picker.Item label="By Month" value="1" />
            <Picker.Item label="By Year" value="0" />
            <Picker.Item label="By Day" value="2" />
          </Picker>
        </Form>
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
        <View style={styles.inputCon}>
          <TextInput
            style={styles.itemInput}
            onChangeText={text => {
              this.setState({ amount: text });
            }}
            value={this.state.amount}
            placeholder="Enter Amount"
          />
        </View>
        <TouchableOpacity
          style={styles.floatButton1}
          onPress={() => {
            this.senditems(this.state.amount, this.state.selected);
          }}
        >
          <Text style={styles.buttonPress}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.floatButton2}
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        >
          <Text style={styles.buttonPress}>Home</Text>
        </TouchableOpacity>
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
  firstIn: {
    marginTop: 10
  },
  formCon: {
    marginTop: 30,
    borderColor: "#DAE0E2",
    borderWidth: 1,
    marginBottom: 5
  },
  inputCon: {
    borderWidth: 2,
    borderColor: "#BCAAA4"
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 100
  },
  buttonPress: {
    color: "#FFF",
    fontSize: 25,
    fontWeight: "400"
  },
  floatButton1: {
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 500,
    fontWeight: "bold",
    marginBottom: 100,
    marginTop: 50,

    bottom: 20,
    borderRadius: 1,

    borderColor: "#FFF",
    height: 55,
    backgroundColor: "#004D40"
  },
  floatButton2: {
    marginBottom: 10,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 500,
    fontWeight: "bold",
    position: "absolute",
    bottom: 40,
    borderRadius: 1,

    borderColor: "#FFF",
    height: 55,
    backgroundColor: "#004D40"
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
  backgroundGradientFrom: "#8D6E63",
  backgroundGradientTo: "#795548",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2 // optional, default 3
};
