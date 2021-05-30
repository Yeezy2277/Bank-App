import {View} from "react-native";
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./Home";
import Question from "./Question";
import CreditForm from "./CreditForm";
import CalcCredit from "./CalcCredit";

const Tab = createBottomTabNavigator();

export default function HomeRoot() {
    return (
            <Tab.Navigator>
                <Tab.Screen name="Главная" component={Home} />
                <Tab.Screen name="Вопрос" component={Question} />
            </Tab.Navigator>
    );
}