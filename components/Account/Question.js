import {Text, TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";
import {useForm, Controller} from "react-hook-form";

export default function Question({navigation}) {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);
    return <View style={styles.container}>
        <View style={{borderWidth: 1, borderColor: "#000", paddingVertical: 10, paddingHorizontal: 30}}>
            <Text>GIG Credit Bank</Text>
        </View>
        <View style={{textAlign: "left", marginTop: 10, marginRight: 35}}>
            <Text style={{lineHeight: 45}}>Телефон: 8(999)999-99-99</Text>
            <Text>Задать вопрос</Text>
        </View>
        <View style={{marginTop: 25}}>
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder="Введите текст"
                        style={styles.input}
                    />
                )}
                name="field"
                rules={{ required: "Это поле обязательно", minLength: {
                    value: 50,
                    message: "В поле должно быть не менее 50 символов"
                    } }}
                defaultValue=""
            />
            {errors.firstName && <Text>{errors?.message}</Text>}
        </View>
        <View>
            <TouchableOpacity style={styles.button}>
                <Text style={{textAlign: "center"}}>Отправить</Text>
            </TouchableOpacity>
        </View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 24,
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
        paddingVertical: 20
    }
});