import React from "react";
import { StyleSheet, Text, View , Image, KeyboardAvoidingView, TouchableOpacity} from "react-native";
import { Form, Item, Input, Label, Button} from "native-base";
import * as firebase from "firebase";

export default class SignUpScreen extends React.Component {


  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      name: ""
    }
  }
  static navigationOptions = {
    title: "Signup",
    header: null
  };

  writeUserData( name, email,) {
    firebase.database().ref('users/' + name).set({
      
      firstName: name,
      email: email,
    });
  }

  signupUser =(name,email,password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email,password)
      .then(authenticate => {
        return authenticate.user
          .updateProfile({
            displayName: name
          })
          .then(() => {
            this.props.navigation.replace("Home");
          })
      })
      .catch( error => {
        alert(error.message)
      })
      this.writeUserData(name,email)
    
  };
  render() {
    return (
      <KeyboardAvoidingView
      style={styles.container}
      behavior = "position" enabled
      >
        <View style={styles.logoContainer}>
          <Image style={styles.iconContainer} source={require("../assets/Progress.png")} />
          <Text>ClimbTime</Text>
        </View>
        <Form style={styles.form}>
        <Item floatingLabel>
            <Label>Name</Label>
            <Input
              
              autoCapitalize={false}
              autoCapitalize="none"
              keyboardType="name-phone-pad"
              onChangeText={name => this.setState({ name })}
            />
          </Item>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCapitalize={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={email => this.setState({ email })}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry={true}
              autoCapitalize={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={password => this.setState({ password })}
            />
          </Item>
          
          <Button style={styles.button} full rounded 
          onPress={() => {
            this.signupUser(
              this.state.name,
              this.state.email,
              this.state.password
            )

          }}>
            
            <Text style={styles.buttonText}>Sign Up</Text>
          </Button>
        </Form>
        <View style={styles.footer}>
          
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate("Signin")
          }}>
            <Text>Already have an account?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 100
  },
  form: {
    padding: 20,
    width: "100%"
  },
  button: {
    marginTop: 20
  },
  buttonText: {
    color: "#fff"
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
  footer: {
    alignItems: "center"
  }
});
