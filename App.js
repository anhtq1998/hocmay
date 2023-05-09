import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, Dimensions, Modal, Pressable, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";

export default function App() {
  const [date, setDate] = useState(new Date(1598051730000));
  const [isMotorOn, setIsMotorOn] = useState(false);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [show, setShow] = useState(false);

  const toggleMotor = () => {
    setIsMotorOn(!isMotorOn);
    const db = getDatabase();
    set(ref(db, 'Data/'), {
      relay_status: !isMotorOn,
      soil_moisture: soilMoisture
    });
    isMotorOn ? showAlert("Đã tắt máy") : showAlert("Đã bật máy");
  };

  const handleSchedule = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    console.log(currentDate);
  }

  function writeUserData(name, email, imageUrl) {
    const db = getDatabase();
    set(ref(db, 'users/'), {
      username: name,
      email: email,
      profile_picture: imageUrl
    });
  }

  const showAlert = (mess) =>
    Alert.alert(
      'Thông báo',
      `${mess}`,
    );
  const getData = () => {
    const db = getDatabase();
    const starCountRef = ref(db, 'Data/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setIsMotorOn(data?.relay_status);
      setSoilMoisture(data?.soil_moisture);
    });
  }

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyCuKErHk4O8LGw9dgpOsv4iyWBQW-88A5Q",
      authDomain: "plant-watering-efcbd.firebaseapp.com",
      databaseURL: "https://plant-watering-efcbd-default-rtdb.firebaseio.com",
      projectId: "plant-watering-efcbd",
      storageBucket: "plant-watering-efcbd.appspot.com",
      messagingSenderId: "853249152730",
      appId: "1:853249152730:web:2bdc864a5c9a3d602e37e3",
      measurementId: "G-H6GHMWDSPH"
    };
    initializeApp(firebaseConfig);
    getData();
    setInterval(getData, 5000);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.schedule}>
        <Ionicons onPress={() => writeUserData('a', 'b', 'c')} name="alarm-outline" size={32} color="green" />
      </View>
      <Text style={styles.title}>ỨNG DỤNG GIÁM SÁT VÀ ĐIỀU KHIỂN HỆ THỐNG TƯỚI CÂY</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: ['0', '5 phút', '10 phút', '15 phút', '20 phút'],
            datasets: [
              {
                data: [
                  10,
                  28,
                  77,
                  52,
                  20,
                  99,
                ],
              },
            ],
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            marginRight: 20,
          }}
        />
      </View>
      <View style={styles.settingsContainer}>
        <Text style={styles.label}>Độ ẩm đất: {soilMoisture}%</Text>
        <Text style={styles.label}>Motor:</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isMotorOn ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleMotor}
          value={isMotorOn}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => {
          setShow(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.timePicker}>Chọn thời gian</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="time"
              is24Hour={true}
              onChange={onChange}
            />
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setShow(false)}>
                <Text style={styles.textClose}>Đóng</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.btnSchedule]}
                onPress={() => setShow(false)}>
                <Text style={styles.textStyle}>Hẹn giờ</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    color: '#008000',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    width: '90%',
    marginBottom: 24,
  },
  settingsContainer: {
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '50%',
    textAlign: 'center',
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  schedule: {
    position: 'absolute',
    top: 80,
    right: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 150
  },
  button: {
    width: 120,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#F0F0F0',
  },
  textClose: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  btnSchedule: {
    backgroundColor: '#2196F3',
    marginLeft: 10
  },
  timePicker: {
    fontSize: 30,
    marginTop: -10,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});