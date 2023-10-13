import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [dangNhap, setDangNhap] = useState({
    username: "",
    password: "",
  });
  const [ttDangNhap, setTTDangNhap] = useState("");

  const [savedData, setSavedData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const handleInputChange = (name, value) => {
    setDangNhap({
      ...dangNhap,
      [name]: value,
    });
  };

  const luuThongTin = async () => {
    try {
      const jsonValue = JSON.stringify(dangNhap);
      await AsyncStorage.setItem("dangnhap", jsonValue);

      console.log("Đã lưu thông tin đăng nhập");

      setRefresh(!refresh);
    } catch (e) {
      console.log(e);
    }
  };

  const layThongTin = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("dangnhap");

      if (jsonValue) {
        let tt = JSON.parse(jsonValue);
        setTTDangNhap(tt.username + " - " + tt.password);
      } else {
        setTTDangNhap("Không tìm thấy thông tin đăng nhập");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const layTatCaThongTin = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);
      setSavedData(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    layTatCaThongTin();
  }, [refresh]);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginBottom: 50 }}>
        Thông tin đăng nhập: {ttDangNhap}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => handleInputChange("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => handleInputChange("password", text)}
      />

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.btn} onPress={luuThongTin}>
          <Text style={styles.textbtn}> Lưu thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={layThongTin}>
          <Text style={styles.textbtn}> Lấy thông tin</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.btn} onPress={layTatCaThongTin}>
          <Text style={styles.textbtn}> Lấy all</Text>
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={savedData}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View style={styles.savedDataItemContainer}>
            <Text style={styles.savedDataKey}>{item[0]}:</Text>
            <Text>{item[1]}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    width: 200,
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  textbtn: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFE4C4",
    fontWeight: "bold",
    borderRadius: 10,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },

  savedDataItemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  savedDataKey: {
    fontWeight: "bold",
    marginRight: 5,
  },
});
