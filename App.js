import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, Dimensions, Modal, Pressable, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";
import moment from 'moment';

export default function App() {
  const [date, setDate] = useState(new Date(1598051730000));
  const [isMotorOn, setIsMotorOn] = useState(false);
  const [autoWatter, setAutoWatter] = useState(false);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [haveSchedule, setHaveSchedule] = useState("null");
  const [dateSchedule, setDateSchedule] = useState(null);
  const [show, setShow] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [saveHistory, setSaveHistory] = useState([]);


  const toggleMotor = () => {
    setIsMotorOn(!isMotorOn);
    const db = getDatabase();
    set(ref(db, 'Data/relay_status'), !isMotorOn);
    isMotorOn ? showAlert("Đã tắt máy") : showAlert("Đã bật máy");
  };

  const toggleAuto = () => {
    setAutoWatter(!autoWatter);
    const db = getDatabase();
    set(ref(db, 'Data/auto_watering'), !autoWatter);
    isMotorOn ? showAlert("Đã tắt chế độ tưới tự động") : showAlert("Đã bật chế độ tưới tự động");
  };

  const handleSchedule = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setDateSchedule(moment(currentDate).format('HH:mm'));
  }

  const setTimeSchedule = () => {
    const db = getDatabase();
    set(ref(db, 'Data/relay_on_time'), dateSchedule);
    showAlert("Đặt lịch thành công!");
    setShow(false);
  }

  const showAlert = (mess) => Alert.alert(
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
      setHaveSchedule(data?.relay_on_time);
      setSaveHistory(data?.soil_moisture_samples);
      setAutoWatter(data?.auto_watering);
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
      <View style={styles.infoDev}><Ionicons onPress={() => setShowInfo(!showInfo)} name={showInfo ? "arrow-back-circle-outline" : "information-circle-outline"} size={32} color="green" /></View>
      {!showInfo ? <><View style={styles.schedule}>
        <Ionicons onPress={handleSchedule} name="alarm-outline" size={32} color="green" />
      </View>
        <Text style={styles.title}>ỨNG DỤNG GIÁM SÁT VÀ ĐIỀU KHIỂN HỆ THỐNG TƯỚI CÂY</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: ['now', '1 phút', '2 phút', '3 phút', '4 phút'],
              datasets: [
                {
                  data: saveHistory || [],
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
          <View style={styles.actionHandle}>
            <View style={styles.childAction}>
              <Text style={styles.label}>Bật/tắt thủ công:</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isMotorOn ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleMotor}
                value={isMotorOn}
              />
            </View>
            <View style={styles.childAction}>
              <Text style={styles.label}>Bật/tắt tự động:</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={autoWatter ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleAuto}
                value={autoWatter}
              />
            </View>
          </View>

          <Text style={{ ...styles.label, marginTop: 50 }}>{haveSchedule != "null" ? `Bật máy bơm lúc:${haveSchedule}` : 'Không có lịch bật máy'}</Text>
        </View></>
        :
        <>
          <Text style={styles.titleInfoDev}>Ứng dụng phát triển bởi</Text>
          <Text style={styles.label}>Võ Thị Kim Thoa - B1907819</Text>
          <Text style={styles.label}>Trần Thị Bích Trân-B1907768</Text>
          <Text style={styles.label}>Trương Minh Tuấn -B1907772</Text>
          <Text style={styles.label}>Cao Nguyễn Phước An- B1907720</Text>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'data:image/jpeg;base64,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',
            }}
          />

        </>}
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
                onPress={() => setTimeSchedule()}>
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
    marginTop: 8,
    marginBottom: 10,
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
  },
  titleInfoDev: {
    fontSize: 30,
    marginTop: -250,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoDev: {
    position: 'absolute',
    left: 20,
    top: 80
  },
  tinyLogo: {
    position: 'absolute',
    bottom: 50,
    marginTop: 100,
    width: '100%',
    height: 350,
  },
  actionHandle: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row'
  },
  childAction: {
    flex: 1,
    alignItems: 'center'
  }
});