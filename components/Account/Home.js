import {Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {AuthContext} from "../../App";
import * as SecureStore from "expo-secure-store";
import axios from 'react-native-axios';

export default function Home({navigation}) {
    const { signOut } = React.useContext(AuthContext);
    return <View>
        <TouchableOpacity onPress={() => {
            SecureStore.deleteItemAsync('userToken').then(res => {
                signOut()
            }).catch(err => console.warn(err));
        }}>
            <Text>Выйти</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            SecureStore.getItemAsync("refreshToken").then(r => {
                axios.post("https://testserver228833.herokuapp.com/api/token/refresh/", {
                    refresh: r
                }).then(r => {
                    console.warn(r)
                    SecureStore.setItemAsync("userToken", r.data.access).then(r => {

                    })
                })
            })
        }
        }>
            <Text>Обновить токен</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Калькулятор")}>
            <Text>Калькулятор</Text>
        </TouchableOpacity>
    </View>
}