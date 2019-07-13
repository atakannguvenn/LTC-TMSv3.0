/************************************************************************************************/
/* Author: LTC-TMS App Team (Peter Shively, Tyler Bartnick, Duong Doan, Ryen Shearn)            */
/* Last Modified: February 21,2019                                                              */
/* Course: CSC 355 Software Engineering                                                         */
/* Professor Name: Dr. Joo Tan                                                                  */
/* Filename: SignInScreen.js                                                                    */
/**********************************************************************************************/
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  Image,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { Button, ThemeProvider, Icon } from 'react-native-elements';
import styles from '../styles/styles';

const { width: WIDTH} = Dimensions.get('window')

class SignInScreen extends React.Component {

  constructor(props) {
    super(props);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    // required state variables to handle user input correctly
    this.state = {
      cnaSwitch: false,
      username: '',
      password: '',
      showPassword: true,
    };
  };

  toggleSwitch() {
    this.setState({ showPassword: !this.state.showPassword });
  }
// uncomment header:null to disable header on signin screen
  static navigationOptions = {
    //header: null,
  };

  //  padding: 50, paddingBottom: 50,

  //KeyboardAvoidingView is used to prevent the keyboard from overlaying the View containing the login form,
  // toggle, and buttons
  render() {
    return (
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: '#e6f3ff' }}>
        <View style={styles.containerSignIn}>
          <Image style={styles.logo} source={require('../assets/img/logofinal.png')} />
          <View style={styles_2.inputContainer}>
            <Image style={styles_2.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
            <TextInput
              style={styles_2.inputs}
              placeholder="Username"
              placeholderTextColor='black'
              returnKeyType={"next"}
              onSubmitEditing={()=>this.secondTextInput.focus()}
              onChangeText={(username) => this.setState({ username })}
            />
          </View>
          <View style={styles_2.inputContainer}>
            <Image style={styles_2.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
            <TextInput
              style={styles_2.inputs}
              secureTextEntry={this.state.showPassword}
              placeholder="Password"
              placeholderTextColor='black'
              returnKeyType = {"go"}
              ref={(input)=>this.secondTextInput = input}
              onChangeText={(password) => this.setState({ password })}
            />
          </View>
          <Text style = {styles_2.simpleText}>Password Visibility</Text>
          <Switch
            onValueChange = {this.toggleSwitch}
            value = {!this.state.showPassword}
            style = {{marginBottom: 10, alignSelf: 'flex-start'} }
            trackColor={{ true: 'green', false: 'red' }}
          />
          <TouchableHighlight style={[styles_2.buttonContainer, styles_2.loginButton]} onPress={this._signIn}>
            <Text style={styles_2.loginText}>Login</Text>
          </TouchableHighlight>
          <Text style={styles.userToggle}>Toggle User Login</Text>
          <Text style={styles.userToggle}> {this.state.cnaSwitch ? 'CNA' : 'Family'}</Text>
          <Switch
            onValueChange={(value) => this.setState({ cnaSwitch: value })}
            style={{ marginBottom: 10, marginTop: 10, alignSelf: 'center' }}
            value={this.state.cnaSwitch}
            trackColor={{ true: 'green', false: 'blue' }}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  // originally authenticating anonymously with firebase, using API key as only layer of security
  // now we're using API key and email authentication
  async componentDidMount() {

    //const { user } = await firebase.auth().signInAnonymously();
    const { user } = await firebase.auth().signInWithEmailAndPassword('mobileApp@300bps.net', 'totallysecure');
  }
  // Updated 2-14-2019: for both types of sign-ins, there will be an alert prompt if credentials are incorrect
  _signIn = () => {
    if (this.state.cnaSwitch == true) {
      const userCredentials = firebase.database().ref(`CNA/${this.state.username}/Portfolio/`).once('value').then((snap) => {
        const userInfo = snap.val();
        if (snap.val().Password === this.state.password) {
          this._setUserInfo(userInfo);
        } else {
          Alert.alert('Username/Password incorrect.');
        }
        //catch is added to prompt incorrect credentials
      }).catch(() => {
        Alert.alert('Username/Password incorrect.');
      });
    } else {
      const userCredentials = firebase.database().ref(`Patient/${this.state.username}/Portfolio/`).once('value').then((snap) => {
        const userInfo = snap.val();
        console.log(snap.val());
        if (snap.val().Password === this.state.password) {
          this._setUserInfo(userInfo);
        } else {
          Alert.alert('Username/Password incorrect.');
        }
        //catch is added to prompt incorrect credentials  
      }).catch(() => {
        Alert.alert('Username/Password incorrect.');
      });

    }
  };

  // helper function to set user information in local storage.
  // Because of the nature of asyncronous calls in JS, an await statement must
  // directly proceed the declaration of an asyncronous function (the first line)
  // within the function's defintion. Without this helper (i.e. with this code
  // directly embedded in this._signIn()), this._signIn() will error out.
  _setUserInfo = async (userInfo) => {
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.props.navigation.navigate('App');
  }
}
const styles_2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:WIDTH - 50,
      height:45,
      marginBottom:10,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
      color: 'black',
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    marginLeft: 40,
    width:WIDTH - 120,
    borderRadius:7,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  simpleText: {
    color: 'black',
  },
});

export default SignInScreen;