import {Text, TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import React, {useRef, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {authMeAPI, register} from "../API/api";
import {AuthContext} from "../../App";
import * as SecureStore from "expo-secure-store";
import {TextInputMask} from "react-native-masked-text";
export default function Register({navigation}) {
    const { control, handleSubmit,watch, formState: { errors } } = useForm();
    const password = useRef({});
    password.current = watch("password", "");
    const { signUp } = React.useContext(AuthContext);
    const [phoneField, setPhoneField] = useState(null)
    const [errMes, setErrMes] = useState(false)
    const onSubmit = data => {
        const unmasked = phoneField.getRawValue()
        authMeAPI.register({username : unmasked, password: data.password}).then(res => {
            authMeAPI.login({username : unmasked, password: data.password}).then(res => {
                console.warn(res.data)
                SecureStore.setItemAsync('userToken', res.data.access).then(res => {
                    signUp({username : unmasked, password: data.password})
                });
                SecureStore.setItemAsync('refreshToken', res.data.refresh).then(res => {
                });
            }).catch(err => console.warn(err))
        }).catch((err) => {
            setErrMes(true)
            setTimeout(() => setErrMes(false),3000)
        })
    };
    return <View style={styles.container}>
        {errMes ? <View style={{position: "absolute", top: 12, backgroundColor: "#DC143C", borderRadius: 15, paddingVertical: 8, paddingHorizontal: 15, zIndex: 2}}>
            <Text style={{color: "white", fontSize: 15}}>Такой аккаунт уже существует</Text>
        </View> : null}
        <View style={{borderWidth: 1, borderColor: "#000", paddingVertical: 10, paddingHorizontal: 30}}>
            <Text>GIG Credit Bank</Text>
        </View>
        <View style={{marginTop: 25}}>
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInputMask
                        type={'cel-phone'}
                        options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '+7 (999) 999-99-99'
                        }}
                        placeholder="Номер телефона"
                        onChangeText={value => onChange(value)}
                        value={value}
                        ref={(ref) => setPhoneField(ref)}
                        maxLength={18}
                        style={styles.input}
                    />
                )}
                name="username"
                rules={{ required: "Это поле обязательно", minLength: {
                    value: 18,
                        message: "Введите полностью свой номер телефона"
                    } }}
                defaultValue=""
            />
            {errors.username && <Text style={{color: "red"}}>{errors.username?.message}</Text>}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder="Пароль"
                        style={styles.input}
                    />
                )}
                name="password"
                rules={{ required: "Это поле обязательно", minLength: {
                    value: 6,
                        message: "Пароль должен быть не менее 6 символов"
                    }, pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                        message: "Пароль должен состоять только из латинских букв и цифр"
                    } }}
                defaultValue=""
            />
            {errors.password && <Text style={{color: "red"}}>{errors.password?.message}</Text>}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder="Повторите пароль"
                        style={styles.input}
                    />
                )}
                name="repeatPassword"
                rules={{ required: "Это поле обязательно",
                    validate: value => value === password.current || "Пароли не совпадают" }}
                defaultValue=""
            />
            {errors.repeatPassword && <Text style={{color: "red"}}>{errors.repeatPassword?.message}</Text>}
        </View>
        <View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text>Зарегистрироваться</Text>
            </TouchableOpacity>
        </View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#eaeaea",
        alignItems: "center",
    },
    button: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 10,
        paddingHorizontal: 25,
        paddingVertical: 10,
        marginTop: 20
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        marginTop: 10,
        paddingHorizontal: 65,
        paddingVertical: 7
    }
});