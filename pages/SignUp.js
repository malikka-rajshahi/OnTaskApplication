import { View, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Text, TextInput } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [fontsLoaded] = useFonts({
        'Caveat-Bold': require('../assets/fonts/Caveat-Bold.ttf'),
    });
    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>; 
    }

    const back = () => {
        navigation.navigate('Auth');
    };

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with: ', user.email);
        }).catch(error => alert(error.message));
    };

    return (
        <View>
          <TouchableOpacity style={styles.backContainer} onPress={back}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/back.png')}
                />
            </TouchableOpacity> 
    
            <View style={styles.logoContainer}>
                <Image 
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
            </View>
    
            <View style={styles.formContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput style={styles.input} keyboardType='email-address' onChangeText={setEmail}></TextInput>
                <Text style={styles.label}>Password:</Text>
                <TextInput style={styles.input} secureTextEntry={true} onChangeText={setPassword}></TextInput>
            </View>
            
            <TouchableOpacity style={styles.signUpContainer} onPress={handleSignUp}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/sign_up.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    // logo
    logoContainer: { // positioning
        flex: 1,
        position: 'absolute',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        paddingTop: height*.1,
    },
    logo: { // sizing
        width: width*.5,
        height: width*.5,
        resizeMode: 'contain',
    },

    // back button
    backContainer: {
        marginTop: height*.1,
        width: width * 0.11, 
        height: width * 0.11, 
        overflow: 'hidden', 
        marginLeft: width*.05,
    },

    // sign up button
    signUpContainer: {
        width: width * 0.4, 
        height: (width * 0.4)/2, 
        borderRadius: 50, 
        overflow: 'hidden', 
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: height*.04,
    },

    // for all buttons that are images
    buttonImage: {
        width: '100%', 
        height: '100%', 
        resizeMode: 'contain',
    },

    // sign up form
    formContainer: {
        marginTop: height*.2,
        marginLeft: width*.03,
    },
    label: { // labels
        // font
        color: '#FF1ABF', 
        fontFamily: 'Caveat-Bold',
        fontSize: RFPercentage(7), 
        // shadow
        textShadowColor: 'rgb(255, 100, 207)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 1,
    },
    input: { // inputs
        width: width * .8,
        height: (width * .8)/8,
        backgroundColor: 'white',
        color: 'black',
        alignSelf: 'center',
    },
  });