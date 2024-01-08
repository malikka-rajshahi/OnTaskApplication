import React from 'react';
import { Dimensions } from 'react-native';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';

const checkIcon = require('../images/check.png');
const { width, height } = Dimensions.get('window');

const CustomCheckbox = ({ isChecked, onCheck }) => {
    return (
        <TouchableOpacity onPress={onCheck} style={styles.checkboxBase}>
            {isChecked && (
                <View style={styles.checkIcon}>
                    <Image source={checkIcon} style={styles.imgContainer} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkboxBase: {
        width: width * .06,
        height: width * .06,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF1ABF',
        backgroundColor: 'transparent',
    },

    checkIcon: {
        width: width * .06,
        height: width * .06,
        overflow: 'hidden',
    },
    imgContainer: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default CustomCheckbox;
