import { View, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Text, TextInput, Pressable, Platform, Button } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firestore, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function NewTask({ navigation }) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date());

    const handleCancel = () => {
        navigation.navigate('Home');
    };

    const handleDateChange = (e, selectedDate) => {
        setDate(selectedDate);
    };

    const handleNewTask = async () => {
        if (title) {
            if (auth.currentUser) {
                try {
                    const uid = auth.currentUser.uid;
                    const docRef = await addDoc(collection(firestore, "tasks"), {
                        userId: uid,
                        title: title,
                        date: date.toDateString(),
                        complete: false,
                    });
                    console.log("Document written with ID: ", docRef.id);
                    alert('Task added!');
                    navigation.navigate('Home');
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            } else {
                alert('Not logged in!');
                navigation.navigate('SignIn');
            }
        }
    };

    return (
        <View>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Task Name:</Text>
                <TextInput style={styles.input} onChangeText={setTitle} maxLength={30}></TextInput>
                <Text style={styles.label}>Task Date:</Text>
                <View style={styles.input}>
                    <DateTimePicker style={styles.dateContainer} value={date} onChange={handleDateChange} />
                </View>
            </View>
            <TouchableOpacity style={styles.newTaskContainer} onPress={handleNewTask}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/new_task.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelContainer} onPress={handleCancel}>
                <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/cancel.png')}
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
        paddingTop: height * .1,
    },
    logo: { // sizing
        width: width * .5,
        height: width * .5,
        resizeMode: 'contain',
    },

    // new task button
    newTaskContainer: {
        width: width * 0.4,
        height: (width * 0.4)/2,
        borderRadius: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: height * .04,
    },

    // cancel button
    cancelContainer: {
        width: width * 0.3,
        height: (width * 0.3)/2,
        borderRadius: 80,
        overflow: 'hidden',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: height * .02,
    },

    // for all buttons that are images
    buttonImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    // new task form
    formContainer: {
        marginTop: height * .36,
        marginLeft: width * .03,
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
    dateContainer: {
        marginTop: ((width * .8)/8) / 15,
        alignSelf: 'center',
    },
});