import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {Slider} from "react-native-elements";
import axios from 'react-native-axios';
import * as SecureStore from "expo-secure-store";

export default function CalcCredit({navigation}) {
    const [isInitialized, setIsInitialized] = useState(false)

    const [sum, setSum] = useState(0)
    const [day, setDay] = useState(5)

    const [token, setToken] = useState(null)
    const [firstDate, setFirstDate] = useState(0)
    const [lastDate, setLastDate] = useState(0)

    const [calcData, setCalcData] = useState({})

    const [date, setDate] = useState({
        day: 0,
        month: 0,
        year: 0
    })
    useEffect(() => {
            if (!isInitialized) {
                SecureStore.getItemAsync("userToken").then(r => {
                    setToken(r)
                    fetch("http://floating-citadel-46144.herokuapp.com/api/calculate/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': 'Bearer ' + r
                        }
                    }).then(r => r.json()).then(r => {
                        console.warn(r)
                        setCalcData({
                            debt_sum: r.debt_sum,
                            date_today: r.date_today,
                            date_of_finish: r.date_of_finish,
                            percent: r.percent
                        })
                        let dd = new Date(r.date_today);
                        setFirstDate(dd.getTime())
                        setIsInitialized(true)
                    })
                })
            } else {
                let dd = new Date(day * 24 * 3600 * 1000 + firstDate)
                setLastDate(dd.getTime())
                let d = dd.getDate()
                let m = dd.getMonth()
                let y = dd.getFullYear()
                setDate({day: d, month: m, year: y})
            }
        }
        , [day, isInitialized])
    const onSubmit = () => {
        fetch("http://floating-citadel-46144.herokuapp.com/api/new-calculate/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                debt: {
                    debt_sum: Number(sum),
                    date_of_finish: `${date.year}-${date.month + 1}-${date.day}`,
                    percent: Number(calcData.percent)
                }
            })
        }).then(r => {
            console.warn(r)
            navigation.navigate("?????????? ????????")
        }).catch(err => console.warn(err))
    }
    let monthString = ["????????????", "??????????????", "??????????", "????????????", "??????", "????????", "????????", "??????????????", "????????????????", "??????????????", "????????????", "??????????????"]
    return !isInitialized ? <View>
        <Text>??????????????????, ???????? ???????????????????? ???????????? ?? ??????????????...</Text>
    </View> : <View style={styles.container}>
        <View style={{borderWidth: 1, borderColor: "#000", paddingVertical: 10, paddingHorizontal: 30}}>
            <Text>GIG Credit Bank</Text>
        </View>
        <View style={{marginTop: 25, justifyContent: "center"}}>
            <Text style={{fontSize: 20, fontWeight: "bold"}}>?????????????????????? ?????????????? ??????????</Text>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 10
            }}>
                <Text>???????????????? ??????????</Text>
                <View style={{backgroundColor: "#D3D3D3", paddingHorizontal: 15, paddingVertical: 10}}>
                    <Text>{sum}   &#x20bd;</Text>
                </View>
            </View>
            <Slider
                maximumValue={calcData.debt_sum}
                minimumValue={0}
                step={1000}
                value={0}
                onValueChange={(value) => setSum(value)}
                style={{width: 300}}
            />
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text>1500</Text>
                <Text>30000</Text>
                <Text>80000</Text>
            </View>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 10
            }}>
                <Text>???????????????? ????????</Text>
                <View style={{backgroundColor: "#D3D3D3", paddingHorizontal: 15, paddingVertical: 10}}>
                    <Text>{day} ????????</Text>
                </View>
            </View>
            <Slider
                maximumValue={100}
                minimumValue={5}
                step={16}
                value={day}
                onValueChange={(value) => setDay(value)}
                style={{width: 300}}
            />
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text>5 ????????</Text>
                <Text>10 ????????????</Text>
                <Text>18 ????????????</Text>
            </View>
        </View>
        <View style={{marginTop: 15}}>
            <TouchableOpacity style={styles.button} onPress={onSubmit}>
                <Text style={{textAlign: "center"}}>????????????????</Text>
            </TouchableOpacity>
        </View>
        <View style={{flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 30}}>
            <View style={{marginLeft: 20, marginTop: 20}}>
                <Text>???? ????????????</Text>
                <Text style={{fontWeight: "bold"}}>{sum}&#x20bd;</Text>
            </View>
            <View style={{marginLeft: 28, marginTop: 20}}>
                <Text>???? (????????????????????????)</Text>
                <Text style={{fontWeight: "bold"}}>{date.day} {monthString[date.month]} {date.year} ??</Text>
            </View>
            <View style={{marginLeft: 20, marginTop: 20}}>
                <Text>???? ??????????????????????</Text>
                <Text style={{fontWeight: "bold"}}>{sum / (Number(calcData.percent) / 100)}&#x20bd; <Text
                    style={{color: "pink"}}>{Number(calcData.percent)}%</Text></Text>
            </View>
        </View>
    </View>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 24,
        backgroundColor: "#eaeaea",
        alignItems: "center",
    },
    label: {
        fontWeight: "bold",
        textAlign: "left",
        marginTop: 5
    },
    button: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 10,
        paddingHorizontal: 25,
        paddingVertical: 10,
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        paddingVertical: 7,
        marginTop: 10,
    }
});