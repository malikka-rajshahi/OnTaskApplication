import { ScrollView, View, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Text, Modal, TextInput } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import CustomCheckbox from '../assets/components/CustomCheckbox';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function ViewTasks({ navigation }) {
    const [tasks, setTasks] = useState([]);
    const [showComplete, setShowComplete] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState('');
    const [title, setTitle] = useState('');

    const fetchTasks = async () => {
        if (auth.currentUser) {
            const q = query(
                collection(firestore, "tasks"),
                where("userId", "==", auth.currentUser.uid),
                orderBy("date", "asc"));

            try {
                const querySnapshot = await getDocs(q);
                const tasks = [];
                querySnapshot.forEach((doc) => {
                    tasks.push({ id: doc.id, ...doc.data() });
                });
                setTasks(tasks);
                console.log("Fetched all tasks successfully");
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }
        } else {
            alert('Sign in please!');
            navigation.navigate('Auth');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchTasks();
            return () => {
                setShowComplete(false);
            }
        }, [navigation])
    );

    const [fontsLoaded] = useFonts({
        'Caveat-Bold': require('../assets/fonts/Caveat-Bold.ttf'),
    });
    if (!fontsLoaded) {
        return <View><Text>Loading...</Text></View>;
    }

    const showCompleteTasks = () => {
        setShowComplete(true);
    };

    const hideCompleteTasks = () => {
        setShowComplete(false);
    };

    const handleCheckboxChange = async (taskId, newValue) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, complete: newValue };
            }
            return task;
        }));

        try {
            const taskRef = doc(firestore, "tasks", taskId);
            await updateDoc(taskRef, { complete: newValue })
            console.log("Task updated successfully");
        } catch (error) {
            console.error("Error updating task: ", error);
            setTasks(currentTasks => currentTasks.map(task => {
                return task.id === taskId ? { ...task, complete: !newValue } : task;
            }));
        }
    };

    const handleDelete = async (docId) => {
        try {
            await deleteDoc(doc(firestore, "tasks", docId));
            console.log("Task successfully deleted");
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    };

    const handleEdit = async () => {
        try {
            const docRef = doc(firestore, "tasks", editTask.id);
            await updateDoc(docRef, {title: title});
            console.log("Task successfully updated");
            setShowModal(false);
            setEditTask('');
            setTitle('');
            fetchTasks();
        } catch (error) {
            console.error("Error updating task: ", error);
        }
    };

    const back = () => {
        navigation.navigate('Home');
    };

    const handleNewTask = () => {
        navigation.navigate('NewTask');
    };

    return (
        <ScrollView>
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
            <View style={styles.tasksContainer}>
                <Text style={styles.label}>Tasks:</Text>
                <View>
                    <TouchableOpacity style={styles.taskButton} onPress={handleNewTask}>
                        <ImageBackground
                            style={styles.buttonImage}
                            source={require('../assets/images/new_task.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.showButton} onPress={showCompleteTasks}>
                        <ImageBackground
                            style={styles.buttonImage}
                            source={require('../assets/images/show_tasks.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.hideButton} onPress={hideCompleteTasks}>
                        <ImageBackground
                            style={styles.buttonImage}
                            source={require('../assets/images/hide_tasks.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.tasksListContainer}>
                    {tasks.filter(task => showComplete || !task.complete).map((task) => (
                        <View key={task.id} style={styles.taskItem}>
                            <View style={styles.titleContainer}>
                                <CustomCheckbox
                                    isChecked={task.complete}
                                    onCheck={() => handleCheckboxChange(task.id, !task.complete)}
                                />
                                <Text style={styles.taskText}>{task.title}</Text>
                                <TouchableOpacity style={styles.deleteContainer} onPress={() => handleDelete(task.id)}>
                                    <ImageBackground
                                        style={styles.buttonImage}
                                        source={require('../assets/images/delete.png')}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.editContainer} 
                                    onPress={() => {
                                        setEditTask(task);
                                        setShowModal(true);}}>
                                    <ImageBackground
                                        style={styles.buttonImage}
                                        source={require('../assets/images/edit.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.dateText}>Due By: {task.date}</Text>
                        </View>
                    ))}
                </View>
                <Modal transparent={true} visible={showModal}>
                    <View style={styles.editModal}>
                        <Text style={styles.modalLabel}>Task Name:</Text>
                        <TextInput style={styles.modalInput} onChangeText={setTitle}></TextInput>
                        <TouchableOpacity style={styles.modalButtons} 
                            onPress={handleEdit}>
                            <ImageBackground
                                style={styles.buttonImage}
                                source={require('../assets/images/save.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButtons} 
                            onPress={() => {
                                setEditTask('');
                                setTitle('');
                                setShowModal(false);}}>
                            <ImageBackground
                                style={styles.buttonImage}
                                source={require('../assets/images/cancel.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </ScrollView>
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
        width: width * .2,
        height: width * .2,
        resizeMode: 'contain',
    },

    // back button
    backContainer: {
        marginTop: height * .1,
        width: width * 0.11,
        height: width * 0.11,
        overflow: 'hidden',
        marginLeft: width * .05,
    },

    // for all buttons that are images
    buttonImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    tasksContainer: {
        marginTop: height * .03,
        marginLeft: width * .03,
    },

    // tasks menu
    label: { // tasks label
        // font
        color: '#FF1ABF',
        fontFamily: 'Caveat-Bold',
        fontSize: RFPercentage(7),
        // shadow
        textShadowColor: 'rgb(255, 100, 207)',
        textShadowOffset: { width: 3, height: 2 },
        textShadowRadius: 1,
    },
    tasksContainer: { // tasks buttons
        marginTop: height * .03,
        marginLeft: width * .03,
    },
    taskButton: {
        borderRadius: width * .1,
        width: width * .2,
        height: (width * .2)/2,
        overflow: 'hidden',
    },
    showButton: {
        position: 'absolute',
        marginLeft: width * .25,
        borderRadius: width * .1,
        width: width * .3,
        height: (width * .2)/2,
        overflow: 'hidden',
    },
    hideButton: {
        position: 'absolute',
        marginLeft: width * .6,
        borderRadius: width * .1,
        width: width * .3,
        height: (width * .2)/2,
        overflow: 'hidden',
    },

    // tasks list
    tasksListContainer: {
        marginTop: height * .03,
        marginLeft: width * .03,
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskText: {
        marginLeft: width * .03,
        color: '#FF1ABF',
        fontFamily: 'Caveat-Bold',
        fontSize: RFPercentage(3),
        width: '100%',
        height: '100%',
    },

    editModal: {
        backgroundColor: "white",
        width: width * .8,
        marginTop: height * .45,
        padding: width * .05,
        borderRadius: 24,
        borderColor: '#FF1ABF',
        borderWidth: 10,
        alignSelf: 'center',
    },
    modalLabel: { // modal label
        // font
        color: '#FF1ABF',
        fontFamily: 'Caveat-Bold',
        fontSize: RFPercentage(5),
    },
    modalInput: {
        borderColor: '#FF1ABF',
        borderWidth: 2,
        alignSelf: 'center',
        color: '#FF1ABF',
        fontFamily: 'Caveat-Bold',
        width: width * .5,
        height: (width * .5)/6,
        fontSize: RFPercentage(3),
    },
    modalButtons: {
        width: width * 0.25,
        height: (width * 0.25)/2,
        borderRadius: 80,
        overflow: 'hidden',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: height * .01,
    },
    editContainer: {
        position: 'absolute',
        width: width * 0.06,
        height: width * 0.06,
        overflow: 'hidden',
        marginLeft: width * .68,
    },
    deleteContainer: {
        position: 'absolute',
        width: width * 0.06,
        height: width * 0.06,
        overflow: 'hidden',
        marginLeft: width * .75,
    },
    dateText: {
        color: '#FF1ABF',
        fontFamily: 'Caveat-Bold',
        marginLeft: width * .03,
    },
});