import {
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    CheckBox,
    Platform,
    Button,
    Image, Picker
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import React, {useContext, useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {AuthContext} from "../../App";
import {TextInputMask} from "react-native-masked-text";
import * as SecureStore from "expo-secure-store";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function CreditForm({navigation}) {
    const {signIn} = useContext(AuthContext);
    const {control, handleSubmit, formState: {errors}} = useForm();
    const [personal, setPersonal] = useState({
            personal: [
                {id: 1, name: "lastname", rusName: "Фамилия", type: "input"},
                {id: 2, name: "firstname", rusName: "Имя", type: "input"},
                {id: 3, name: "patronymic", rusName: "Отчество", type: "input"},
                {id: 4, name: "birthday", rusName: "Дата рождения", type: "date"},
                {id: 5, name: "phone", rusName: "Телефон", type: "phone"},
                {id: 6, name: "additionalPhone", rusName: "Дополнительный телефон", type: "phone"},
                {id: 7, name: "email", rusName: "Email", type: "input"}
            ],
            addressRegister: [
                {name: "index", rusName: "Индекс", type: "input"},
                {name: "city", rusName: "Город", type: "input"},
                {name: "street", rusName: "Улица", type: "input"},
                {name: "house", rusName: "Дом", type: "input"}
            ],
            passport: [
                {name: "series", rusName: "Серия", type: "input"},
                {name: "number", rusName: "Номер", type: "input"},
                {name: "whereIsGive", rusName: "Когда выдан", type: "input"},
                {name: "whoIsGive", rusName: "Кем выдан", type: "input"},
                {name: "code", rusName: "Код подразделения", type: "input"}
            ]
        }
    )
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [formattedDate, setFormattedDate] = useState(null)

    const [token, setToken] = useState(null);
    const [error, setError] = useState({});
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
        SecureStore.getItemAsync("userToken").then(r => {
            fetch("http://floating-citadel-46144.herokuapp.com/api/info/",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + r
                }
            }).then(r => r.json()).then(r => {
                fetch("http://floating-citadel-46144.herokuapp.com/api/get-passport/",{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + token
                    }
                }).then(r => r.json()).then(r => {
                    console.warn(JSON.stringify(r))
                    fetch("http://floating-citadel-46144.herokuapp.com/api/get-user-passport1/",{
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': 'Bearer ' + token
                        }
                    }).then(r => r.json()).then(r => {
                        console.warn(JSON.stringify(r))
                        fetch("http://floating-citadel-46144.herokuapp.com/api/get-user-passport2/",{
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': 'Bearer ' + token
                            }
                        }).then(r => r.json()).then(r => {
                            console.warn(JSON.stringify(r))
                            fetch("http://floating-citadel-46144.herokuapp.com/api/get-user-passport3/",{
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    'Authorization': 'Bearer ' + token
                                }
                            }).then(r => r.json()).then(r => {
                                console.warn(JSON.stringify(r))
                                setCalcData({
                                    debt_sum: r.debt_sum,
                                    date_today: r.date_today,
                                    date_of_finish: r.date_of_finish,
                                    percent: r.percent
                                })
                            }).catch(err => {
                                console.warn(JSON.stringify(err))
                                setError({pass3: false})
                            })
                        }).catch(err => {
                            console.warn(JSON.stringify(err))
                            setError({pass2: false})
                        })
                    }).catch(err => {
                        console.warn(JSON.stringify(err))
                        setError({pass1: false})
                    })
                }).catch(err => {
                    console.warn(JSON.stringify(err))
                    setError({pass: false})
                })
            }).catch(err => {
                console.warn(JSON.stringify(err))
                setError({info: false})
            })
        }).catch(err => {
            console.warn(JSON.stringify(err))
            setError({secure: false})
        })
    }, []);
    // Pick Images
    const pickImage1 = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage1(result.uri);
        }
    };
    const pickImage2 = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage2(result.uri);
        }
    };
    const pickImage3 = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage3(result.uri);
        }
    };
    // Date Picker
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setFormattedDate(`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`)
        hideDatePicker();
    };

    const [phoneField, setPhoneField] = useState(null)
    const [birthdayField, setBirthdayField] = useState(null)
    const [index, setIndex] = useState(null)


    const [work, setWork] = useState("Работаю по найму");
    const [isSelected, setSelection] = useState(false);
    const [isAddress, setIsAddress] = useState(false)
    const onSubmit = data => {
        console.log(data)
    };
    return <FlatList
        data={["1"]}
        style={{
            flex: 1,
            paddingTop: 24,
            backgroundColor: "#eaeaea",
        }}
        contentContainerStyle={{alignItems: "center"}}
        renderItem={({item}) => (
            <View style={{paddingHorizontal: 50, alignItems: "center", marginBottom: 30}}>
                {error.secure || error.info || error.pass || error.pass1 || error.pass2 || error.pass3 ? <View
                    style={{position: "absolute", top: 12, backgroundColor: "#DC143C", borderRadius: 15, paddingVertical: 8, paddingHorizontal: 15, zIndex: 2}}>
                    <Text style={{color: "white", fontSize: 15}}>Ошибка. Попробуйте перезапустить приложение</Text>
                </View> : null}
                <View style={{borderWidth: 1, borderColor: "#000", paddingVertical: 10, paddingHorizontal: 30}}>
                    <Text>GIG Credit Bank</Text>
                </View>
                <Text style={{color: "blue", fontSize: 16, fontWeight: "bold", marginTop: 15}}>Персональные
                    данные</Text>
                <View style={{marginTop: 10}}>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Фамилия</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="sername"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Имя</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="name"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Отчество</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="second_name"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Дата рождения</Text>
                        <Button onPress={showDatePicker} title="Выбрать дату" />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        {formattedDate ? <View>
                            <Text>{formattedDate}</Text>
                        </View> : null}
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Телефон</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInputMask
                                    type={'cel-phone'}
                                    options={{
                                        maskType: 'BRL',
                                        withDDD: true,
                                        dddMask: '+7 (999) 999-99-99'
                                    }}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    ref={(ref) => setPhoneField(ref)}
                                    maxLength={18}
                                    style={styles.input}
                                />
                            )}
                            name="tel"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Дополнительный телефон</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInputMask
                                    type={'cel-phone'}
                                    options={{
                                        maskType: 'BRL',
                                        withDDD: true,
                                        dddMask: '+7 (999) 999-99-99'
                                    }}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    ref={(ref) => setPhoneField(ref)}
                                    maxLength={18}
                                    style={styles.input}
                                />
                            )}
                            name="second_tel"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Email</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="your_email"
                            rules={{required: true, pattern: {
                                value: /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/,
                                message: "Неверный формат Email"
                                }}}
                            defaultValue=""
                        />
                    </View>
                </View>
                <Text style={{color: "blue", fontSize: 16, fontWeight: "bold", marginTop: 15}}>Адрес постоянной
                    регистрации</Text>
                <View style={{marginTop: 10}}>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Индекс</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="register_index"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Город</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="register_city"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Улица</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="register_street"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Дом</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="register_house"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Квартира</Text>
                        <View style={{flexDirection: "row"}}>
                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        style={[styles.input, {width: 30}]}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="register_flat"
                                defaultValue=""
                            />
                            <View style={{flexDirection: "row",marginLeft: 30,alignItems: "center"}}>
                                <Controller
                                    control={control}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <CheckBox
                                            onBlur={onBlur}
                                            value={isSelected}
                                            onValueChange={setSelection}
                                            style={styles.checkbox}
                                        />
                                    )}
                                    name="register_private_house"
                                    defaultValue=""
                                />
                                <Text>Частный дом</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={{color: "blue", fontSize: 16, fontWeight: "bold", marginTop: 12}}>Паспорт</Text>
                <View style={{marginTop: 15, marginLeft: 30}}>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Серия</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="passport_series"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Номер</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="passport_nomder"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Когда выдан</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '99.99.9999'
                                    }}
                                    keyboardType="numeric"
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    ref={(ref) => setBirthdayField(ref)}
                                    maxLength={18}
                                    style={styles.input}
                                />
                            )}
                            name="passport_date"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Кем выдан</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="passport_place"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Код подразделения</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="passport_code"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View style={{alignItems: "center"}}>
                        <Text style={{fontWeight: "bold"}}>Загрузить фотографии паспорта</Text>
                        <Text style={{alignSelf: "flex-start"}}>Первая страница паспорта</Text>
                        <TouchableOpacity onPress={pickImage1} style={{borderWidth: 1, borderColor: "black", borderRadius: 15,paddingVertical: 9, paddingHorizontal: 15}}>
                            <Text>Загрузить</Text>
                        </TouchableOpacity>
                        {image1 && <Text>Фото успешно загружено</Text>}
                        <Text style={{alignSelf: "flex-start"}}>Страница с пропиской</Text>
                        <TouchableOpacity onPress={pickImage2} style={{borderWidth: 1, borderColor: "black", borderRadius: 15,paddingVertical: 9, paddingHorizontal: 15}}>
                            <Text>Загрузить</Text>
                        </TouchableOpacity>
                        {image2 && <Text>Фото успешно загружено</Text>}
                        <Text style={{alignSelf: "flex-start"}}>Ваша фотография с паспортом</Text>
                        <TouchableOpacity onPress={pickImage3} style={{borderWidth: 1, borderColor: "black", borderRadius: 15,paddingVertical: 9, paddingHorizontal: 15}}>
                            <Text>Загрузить</Text>
                        </TouchableOpacity>
                        {image3 && <Text>Фото успешно загружено</Text>}
                    </View>
                </View>
                <Text style={{color: "blue", fontSize: 16, fontWeight: "bold", marginTop: 15, textAlign: "center"}}>Адрес фактической регистрации
                    регистрации</Text>
                <View style={{flexDirection: "row",marginLeft: 30,marginTop: 15,alignItems: "center"}}>
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <CheckBox
                                onBlur={onBlur}
                                value={isAddress}
                                onValueChange={setIsAddress}
                                style={styles.checkbox}
                            />
                        )}
                        name="adress"
                        defaultValue=""
                    />
                    <Text>Совпадает с адресом регистрации</Text>
                </View>
                {!isAddress ? <View style={{marginTop: 10}}>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Индекс</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="adress_index"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Город</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="adress_city"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Улица</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="adress_street"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Дом</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="adress_house"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Квартира</Text>
                        <View style={{flexDirection: "row"}}>
                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        style={[styles.input, {width: 30}]}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="adress_flat"
                                defaultValue=""
                            />
                            <View style={{flexDirection: "row",marginLeft: 30,alignItems: "center"}}>
                                <Controller
                                    control={control}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <CheckBox
                                            onBlur={onBlur}
                                            value={isSelected}
                                            onValueChange={setSelection}
                                            style={styles.checkbox}
                                        />
                                    )}
                                    name="adress_private_house"
                                    defaultValue=""
                                />
                                <Text>Частный дом</Text>
                            </View>
                        </View>
                    </View>
                </View> : null}
                <Text style={{color: "blue", fontSize: 16, fontWeight: "bold", marginTop: 12}}>Место работы</Text>
                <View style={{alignItems: "center"}}>
                    <View>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <Picker
                                    selectedValue={work}
                                    style={{ height: 50, width: 220, borderColor: "black", borderWidth: 1,fontWeight: "bold" }}
                                    onValueChange={(itemValue, itemIndex) => setWork(itemValue)}
                                >
                                    <Picker.Item label="Работаю по найму" value="Работаю по найму" />
                                    <Picker.Item label="Работаю на себя" value="Работаю на себя" />
                                    <Picker.Item label="Не работаю" value="Не работаю" />
                                </Picker>
                            )}
                            name="work_status"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Название организации</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="work_name"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold", paddingHorizontal: 15, textAlign: "left"}}>Рабочий телефон</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    keyboardType="numeric"
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="work_tel"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Должность</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="work_position"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Ежемесячный доход</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '₽ 9999999'
                                    }}
                                    keyboardType="numeric"
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    ref={(ref) => setBirthdayField(ref)}
                                    maxLength={18}
                                    style={styles.input}
                                />
                            )}
                            name="work_years"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                </View>
                <Text style={{color: "blue", fontSize: 16, fontWeight: "bold", marginTop: 12}}>Дополнительные данные</Text>
                <View style={{marginTop: 12,marginLeft: 30}}>
                    <View>
                        <Text style={{fontWeight: "bold"}}>Стаж работы</Text>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="information_income"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <Picker
                                    selectedValue={value}
                                    onBlur={onBlur}
                                    style={{ height: 50, width: 220, borderColor: "black", borderWidth: 1,fontWeight: "bold" }}
                                    onValueChange={value => onChange(value)}
                                >
                                    <Picker.Item label="Холост/Не замужем" value="Холост/Не замужем" />
                                    <Picker.Item label="Женат/Замужем" value="Женат/Замужем" />
                                    <Picker.Item label="Разведен(а)" value="Разведен(а)" />
                                    <Picker.Item label="Гражданский брак" value="Гражданский брак" />
                                    <Picker.Item label="Вдовец, вдова" value="Вдовец, вдова" />
                                </Picker>
                            )}
                            name="information_family"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <Picker
                                    selectedValue={value}
                                    onBlur={onBlur}
                                    style={{ height: 50, width: 220, borderColor: "black", borderWidth: 1,fontWeight: "bold" }}
                                    onValueChange={value => onChange(value)}
                                >
                                    <Picker.Item label="Начальное, среднее" value="Начальное, среднее" />
                                    <Picker.Item label="Неполное высшее" value="Неполное высшее" />
                                    <Picker.Item label="Высшее" value="Высшее" />
                                    <Picker.Item label="Второе высшее" value="Второе высшее" />
                                    <Picker.Item label="Ученая степень" value="Ученая степень" />
                                </Picker>
                            )}
                            name="information_education"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                    <View>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <Picker
                                    selectedValue={value}
                                    onBlur={onBlur}
                                    style={{ height: 50, width: 220, borderColor: "black", borderWidth: 1,fontWeight: "bold" }}
                                    onValueChange={value => onChange(value)}
                                >
                                    <Picker.Item label="Отечественный" value="rus" />
                                    <Picker.Item label="Иномарка" value="notRus" />
                                    <Picker.Item label="Нет" value="not" />
                                </Picker>
                            )}
                            name="information_car"
                            rules={{required: true}}
                            defaultValue=""
                        />
                    </View>
                </View>
            </View>
        )}
    />
}
const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            paddingTop: 24,
            backgroundColor: "#eaeaea",
            alignItems: "center"
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
            width: 200
        }
    }
)