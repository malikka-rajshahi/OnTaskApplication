import { View, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'

const { width, height } = Dimensions.get('window');

export default function Auth({ navigation }) {
    const signIn = () => {
        navigation.navigate('SignIn');
    };

    const signUp = () => {
        navigation.navigate('SignUp');
    };

    return (
        <View style={styles.container}>
            <Image 
                style={styles.logo}
                source={require('../assets/logo.png')}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={signIn}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/sign_in.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer} onPress={signUp}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/sign_up.png')}
                />
            </TouchableOpacity>
        </View>
      )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', 
        alignItems: 'center',  
        paddingTop: height*.1   
    },
    logo: {
        width: width*.7,
        height: width*.7,
        resizeMode: 'contain',
    },
    buttonContainer: {
        width: width * 0.4, 
        height: (width * 0.4)/2, 
        borderRadius: 50, 
        overflow: 'hidden', 
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height*.04,
        marginBottom: height*.02,
      },
      buttonImage: {
        width: '100%', 
        height: '100%', 
        resizeMode: 'contain',
      },
  });