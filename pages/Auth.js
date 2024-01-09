import { View, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'

// storing width and height of user's screen
const { width, height } = Dimensions.get('window');

// Authentication page, user can choose to sign in or sign up
export default function Auth({ navigation }) {
    // navigates to sign in page on press of sign in button
    const signIn = () => {
        navigation.navigate('SignIn');
    };

    // navigates to sign up page on press of sign up button
    const signUp = () => {
        navigation.navigate('SignUp');
    };

    return (
        <View style={styles.container}>
            {/* logo display */}
            <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
            />

            {/* sign in button */}
            <TouchableOpacity style={styles.buttonContainer} onPress={signIn}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/sign_in.png')}
                />
            </TouchableOpacity>

            {/* sign up button */}
            <TouchableOpacity style={styles.buttonContainer} onPress={signUp}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/sign_up.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

// StyleSheet for formatting UI components
const styles = StyleSheet.create({
    // whole screen formatting
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: height * .1
    },
    
    // logo formatting
    logo: {
        width: width * .7,
        height: width * .7,
        resizeMode: 'contain',
    },

    // button formatting
    buttonContainer: {
        width: width * 0.4,
        height: (width * 0.4) / 2,
        borderRadius: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * .04,
        marginBottom: height * .02,
    },

    // ensuring proper button image sizing
    buttonImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});