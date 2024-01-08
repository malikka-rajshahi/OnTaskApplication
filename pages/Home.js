import { ScrollView, View, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Text, TextInput, Modal } from 'react-native'
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useFonts } from 'expo-font';
import { Calendar } from 'react-native-calendars';
import React, { useState, useMemo } from 'react';
import { firestore, auth } from '../firebase';
import { collection, query, where, orderBy, doc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { signOut } from 'firebase/auth';
import CustomCheckbox from '../assets/components/CustomCheckbox';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Home({ navigation }) {
  const [userDate, setUserDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState('');
  const [title, setTitle] = useState('');

  const handleNewTask = () => {
    navigation.navigate('NewTask');
    setUserDate(new Date());
  };

  const handleViewTasks = () => {
    navigation.navigate('ViewTasks');
    setUserDate(new Date());
  };

  const handleDayPress = (day) => {
    const newDate = new Date(day.dateString);
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
    setUserDate(newDate);
  };

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
      await updateDoc(taskRef, { complete: newValue });
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
      await updateDoc(docRef, { title: title });
      console.log("Task successfully updated");
      setShowModal(false);
      setEditTask('');
      setTitle('');
      fetchTasks();
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigation.navigate('Auth');
      alert("Signed out!");
    }).catch(error => alert(error.message));
  };

  const fetchTasks = async () => {
    if (auth.currentUser) {
      const q = query(
        collection(firestore, "tasks"),
        where("userId", "==", auth.currentUser.uid),
        where("date", "==", userDate.toDateString()),
        orderBy("date", "asc"));

      try {
        const querySnapshot = await getDocs(q);
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() });
        });
        setTasks(tasks);
        console.log(userDate.toDateString());
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
    }, [userDate, navigation])
  );

  const formatDate = (date) => {
    let day = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [fontsLoaded] = useFonts({
    'Caveat-Bold': require('../assets/fonts/Caveat-Bold.ttf'),
  });
  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
      </View>
      <TouchableOpacity style={styles.viewAllContainer} onPress={handleViewTasks}>
        <Image
          style={styles.viewAll}
          source={require('../assets/images/view_all.png')}
        />
      </TouchableOpacity>

      <View style={styles.calendarContainer} >
        <Calendar
          style={{
            borderWidth: 3,
            borderRadius: 50,
            borderColor: '#FF1ABF',
            height: 339
          }}
          current={formatDate(userDate)}
          onDayPress={handleDayPress}
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
                    setShowModal(true);
                  }}>
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
      </View>

      <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
        <ImageBackground
          style={styles.buttonImage}
          source={require('../assets/images/sign_out.png')}
        />
      </TouchableOpacity>

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
              setShowModal(false);
            }}>
            <ImageBackground
              style={styles.buttonImage}
              source={require('../assets/images/cancel.png')}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  // logo
  logoContainer: { // positioning
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: width * .1,
    marginTop: height * .1,
  },
  logo: { // sizing
    width: width * .3,
    height: width * .3,
    resizeMode: 'contain',
  },

  // view all tasks button
  viewAllContainer: {
    position: 'absolute',
    marginLeft: width * .5,
    marginTop: height * .12,
    marginBottom: height * .025,
  },
  viewAll: {
    borderRadius: 50,
    width: width * .4,
    height: (width * .4) / 2,
  },

  // for all buttons that are images
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // calendar
  calendarContainer: {
    marginTop: height * .03,
  },

  // tasks
  label: { // label
    // font
    color: '#FF1ABF',
    fontFamily: 'Caveat-Bold',
    fontSize: RFPercentage(7),
    // shadow
    textShadowColor: 'rgb(255, 100, 207)',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
  },
  tasksContainer: {
    marginTop: height * .01,
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
    marginTop: height * .01,
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
  dateText: {
    color: '#FF1ABF',
    fontFamily: 'Caveat-Bold',
    marginLeft: width * .03,
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
    // shadow
    textShadowColor: 'rgb(255, 100, 207)',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
  },
  modalInput: {
    borderColor: '#FF1ABF',
    borderWidth: 2,
    alignSelf: 'center',
    color: '#FF1ABF',
    fontFamily: 'Caveat-Bold',
    width: width * .5,
    height: (width * .5) / 6,
    fontSize: RFPercentage(3),
  },
  modalButtons: {
    width: width * 0.25,
    height: (width * 0.25) / 2,
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

  signOut: {
    marginLeft: width * .63,
    marginTop: 10,
    borderRadius: width * .1,
    width: width * .3,
    height: width * .1,
    overflow: 'hidden',
  },
});