import { View, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Text, TextInput } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// storing width and height of user's screen
const { width, height } = Dimensions.get('window');

// Sign in page, sign in form for users with accounts
export default function SignIn({ navigation }) {
    const [email, setEmail] = useState(''); // input variable for user email
    const [password, setPassword] = useState(''); // input variable for user password

    // customized font for UI text
    const [fontsLoaded] = useFonts({
        'Caveat-Bold': require('../assets/fonts/Caveat-Bold.ttf'),
    });
    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>;
    }

    // navigates to authentication page on press of back button
    const back = () => {
        navigation.navigate('Auth');
    };

    // authenticates user credentials and navigates to home page on press of sign in button
    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with: ', user.email);
                navigation.navigate('Home');
            }).catch(error => alert(error.message));
    };

    return (
        <View>
            {/* back button */}
            <TouchableOpacity style={styles.backContainer} onPress={back}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/back.png')}
                />
            </TouchableOpacity>

            {/* logo display */}
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
            </View>

            {/* user credentials input form */}
            <View style={styles.formContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput style={styles.input} keyboardType='email-address' onChangeText={setEmail}></TextInput>
                <Text style={styles.label}>Password:</Text>
                <TextInput style={styles.input} secureTextEntry={true} onChangeText={setPassword}></TextInput>
            </View>

            {/* sign in button */}
            <TouchableOpacity style={styles.signInContainer} onPress={handleSignIn}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/sign_in.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

// StyleSheet for formatting UI components
const styles = StyleSheet.create({
    // logo formatting
    logoContainer: { // positioning
        flex: 1,
        position: 'absolute',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        paddingTop: height * .1,
    },
    logo: { // sizing
        width: width * .5,
        height: width * .5,
        resizeMode: 'contain',
    },

    // back button formatting
    backContainer: {
        marginTop: height * .1,
        width: width * 0.11,
        height: width * 0.11,
        overflow: 'hidden',
        marginLeft: width * .05,
    },

    // sign in button formatting
    signInContainer: {
        width: width * 0.4,
        height: (width * 0.4) / 2,
        borderRadius: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: height * .04,
    },

    // user credentials input form formatting
    formContainer: {
        marginTop: height * .2,
        marginLeft: width * .03,
    },

    // label formatting
    label: { 
        // font
        color: '#FF1ABF',
        fontFamily: 'Caveat-Bold',
        fontSize: RFPercentage(7),
        // shadow
        textShadowColor: 'rgb(255, 100, 207)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 1,
    },

    // form inputs formatting
    input: { 
        width: width * .8,
        height: (width * .8) / 8,
        backgroundColor: 'white',
        color: 'black',
        alignSelf: 'center',
    },

    // ensuring proper button image sizing
    buttonImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});