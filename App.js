import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import { createStackNavigator } from '@react-navigation/stack';
import {createContext, useEffect, useMemo, useReducer} from "react";
import {NavigationContainer} from "@react-navigation/native";
import HomeRoot from "./components/Account/HomeRoot";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CalcCredit from "./components/Account/CalcCredit";
import CreditForm from "./components/Account/CreditForm";

export const AuthContext = createContext();
const Stack = createStackNavigator();
export default function App({ navigation }) {
    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;
            try {
                userToken = await SecureStore.getItemAsync('userToken');
            } catch (e) {
                console.log(e)
            }
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };
        bootstrapAsync();
    }, []);

    const authContext = useMemo(
        () => ({
            signIn: async data => {
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            signUp: async data => {
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
        }),
        []
    );

    return (
        <NavigationContainer>
        <AuthContext.Provider value={authContext}>
                {state.userToken == null ? (
                    <Stack.Navigator initialRouteName="Вход в аккаунт">
                        <Stack.Screen name="Вход в аккаунт" component={Login} />
                        <Stack.Screen name="Регистрация аккаунта" component={Register} />
                    </Stack.Navigator>
                ) : (
                    <Stack.Navigator>
                        <Stack.Screen name="Аккаунт" component={HomeRoot} />
                        <Stack.Screen name="Калькулятор" component={CalcCredit} />
                        <Stack.Screen name="Взять займ" component={CreditForm} />
                    </Stack.Navigator>
                )}
        </AuthContext.Provider>
        </NavigationContainer>
    );
}