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

// storing width and height of user's screen
const { width, height } = Dimensions.get('window');

// Home page, includes calendar tracking, user's data display/modification, and further navigation
export default function Home({ navigation }) {
  const [userDate, setUserDate] = useState(new Date()); // selected date on the calendar
  const [tasks, setTasks] = useState([]); // user's tasks
  const [showComplete, setShowComplete] = useState(false); // display state for user's tasks
  const [showModal, setShowModal] = useState(false); // display state for editing pop up
  const [editTask, setEditTask] = useState(''); // task ID for editing tasks query
  const [title, setTitle] = useState(''); // input variable for editing tasks

  // navigates to new task page on press of new task button
  const handleNewTask = () => {
    navigation.navigate('NewTask');
    setUserDate(new Date());
  };

  // navigates to view tasks page on press of view tasks button
  const handleViewTasks = () => {
    navigation.navigate('ViewTasks');
    setUserDate(new Date());
  };

  // updates selected date on press of new day in calendar
  const handleDayPress = (day) => {
    const newDate = new Date(day.dateString);
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
    setUserDate(newDate);
  };

  // updates display state for user's tasks on press of show complete tasks button
  const showCompleteTasks = () => {
    setShowComplete(true);
  };

  // updates display state for user's tasks on press of hide complete tasks button
  const hideCompleteTasks = () => {
    setShowComplete(false);
  };

  // updates user task and task list UI on press of check box
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

  // deletes user task and updates task list UI on press of delete button
  const handleDelete = async (docId) => {
    try {
      await deleteDoc(doc(firestore, "tasks", docId));
      console.log("Task successfully deleted");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  // updates user task with editing pop up input on press of pop up's save button
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

  // user is signed out and navigates to authentication page on press of sign out button
  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigation.navigate('Auth');
      alert("Signed out!");
    }).catch(error => alert(error.message));
  };

  // displays user's task list from firestore
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

  // calls fetchTasks() whenever user opens the home page, UI is updated for change in selected date as well
  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
      return () => {
        setShowComplete(false);
      }
    }, [userDate, navigation])
  );

  // formatting date for calendar component
  const formatDate = (date) => {
    let day = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // customized font for UI text
  const [fontsLoaded] = useFonts({
    'Caveat-Bold': require('../assets/fonts/Caveat-Bold.ttf'),
  });
  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView>
      {/* logo display */}
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
      </View>

      {/* view all tasks button */}
      <TouchableOpacity style={styles.viewAllContainer} onPress={handleViewTasks}>
        <Image
          style={styles.viewAll}
          source={require('../assets/images/view_all.png')}
        />
      </TouchableOpacity>

      {/* calendar component */}
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

      {/* task navigation menu */}
      <View style={styles.tasksContainer}>
        <Text style={styles.label}>Tasks:</Text>
        <View>
          {/* new task button */}
          <TouchableOpacity style={styles.taskButton} onPress={handleNewTask}>
            <ImageBackground
              style={styles.buttonImage}
              source={require('../assets/images/new_task.png')}
            />
          </TouchableOpacity>
          {/* show complete tasks button */}
          <TouchableOpacity style={styles.showButton} onPress={showCompleteTasks}>
            <ImageBackground
              style={styles.buttonImage}
              source={require('../assets/images/show_tasks.png')}
            />
          </TouchableOpacity>
          {/* hide complete tasks button */}
          <TouchableOpacity style={styles.hideButton} onPress={hideCompleteTasks}>
            <ImageBackground
              style={styles.buttonImage}
              source={require('../assets/images/hide_tasks.png')}
            />
          </TouchableOpacity>
        </View>

        {/* task list display */}
        <View style={styles.tasksListContainer}>
          {/* filtering display state based on showing/hiding complete tasks */}
          {tasks.filter(task => showComplete || !task.complete).map((task) => (
            <View key={task.id} style={styles.taskItem}>
              {/* task checkbox */}
              <View style={styles.titleContainer}>
                <CustomCheckbox
                  isChecked={task.complete}
                  onCheck={() => handleCheckboxChange(task.id, !task.complete)}
                />
                {/* task title */}
                <Text style={styles.taskText}>{task.title}</Text>
                {/* task delete button */}
                <TouchableOpacity style={styles.deleteContainer} onPress={() => handleDelete(task.id)}>
                  <ImageBackground
                    style={styles.buttonImage}
                    source={require('../assets/images/delete.png')}
                  />
                </TouchableOpacity>
                {/* task edit button */}
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
              {/* task date */}
              <Text style={styles.dateText}>Due By: {task.date}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* sign out button */}
      <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
        <ImageBackground
          style={styles.buttonImage}
          source={require('../assets/images/sign_out.png')}
        />
      </TouchableOpacity>

      {/* pop up (modal) editing component */}
      <Modal transparent={true} visible={showModal}>
        <View style={styles.editModal}>
          <Text style={styles.modalLabel}>Task Name:</Text>
          <TextInput style={styles.modalInput} onChangeText={setTitle}></TextInput>
          {/* save button */}
          <TouchableOpacity style={styles.modalButtons}
            onPress={handleEdit}>
            <ImageBackground
              style={styles.buttonImage}
              source={require('../assets/images/save.png')}
            />
          </TouchableOpacity>
          {/* cancel button */}
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

// StyleSheet for formatting UI components
const styles = StyleSheet.create({
  // logo formatting
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

  // view all tasks button formatting
  viewAllContainer: { // positioning
    position: 'absolute',
    marginLeft: width * .5,
    marginTop: height * .12,
    marginBottom: height * .025,
  },
  viewAll: { // sizing
    borderRadius: 50,
    width: width * .4,
    height: (width * .4) / 2,
  },

  // calendar component formatting
  calendarContainer: {
    marginTop: height * .03,
  },

  // task display label formatting
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

  // task navigation menu container formatting
  tasksContainer: {
    marginTop: height * .01,
    marginLeft: width * .03,
  },

  // new task button formatting
  taskButton: {
    borderRadius: width * .1,
    width: width * .2,
    height: (width * .2) / 2,
    overflow: 'hidden',
  },

  // show complete tasks button formatting
  showButton: {
    position: 'absolute',
    marginLeft: width * .25,
    borderRadius: width * .1,
    width: width * .3,
    height: (width * .2) / 2,
    overflow: 'hidden',
  },

  // hide complete tasks button formatting
  hideButton: {
    position: 'absolute',
    marginLeft: width * .6,
    borderRadius: width * .1,
    width: width * .3,
    height: (width * .2) / 2,
    overflow: 'hidden',
  },

  // tasks list container formatting
  tasksListContainer: {
    marginTop: height * .01,
    marginLeft: width * .03,
  },

  // task title formatting
  titleContainer: { // positioning
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: { // font
    marginLeft: width * .03,
    color: '#FF1ABF',
    fontFamily: 'Caveat-Bold',
    fontSize: RFPercentage(3),
    width: '100%',
    height: '100%',
  },

  // task date formatting
  dateText: {
    color: '#FF1ABF',
    fontFamily: 'Caveat-Bold',
    marginLeft: width * .03,
  },

  // task edit button formatting
  editContainer: {
    position: 'absolute',
    width: width * 0.06,
    height: width * 0.06,
    overflow: 'hidden',
    marginLeft: width * .68,
  },

  // task delete button formatting
  deleteContainer: {
    position: 'absolute',
    width: width * 0.06,
    height: width * 0.06,
    overflow: 'hidden',
    marginLeft: width * .75,
  },

  // editing pop up formatting
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

  // pop up label formatting
  modalLabel: {
    // font
    color: '#FF1ABF',
    fontFamily: 'Caveat-Bold',
    fontSize: RFPercentage(5),
    // shadow
    textShadowColor: 'rgb(255, 100, 207)',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 1,
  },

  // pop up input formatting
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

  // pop up buttons formatting
  modalButtons: {
    width: width * 0.25,
    height: (width * 0.25) / 2,
    borderRadius: 80,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: height * .01,
  },

  // sign out button formatting
  signOut: {
    marginLeft: width * .63,
    marginTop: 10,
    borderRadius: width * .1,
    width: width * .3,
    height: width * .1,
    overflow: 'hidden',
  },

  // ensuring proper button image sizing
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});