import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

import CommunityDashboard from "../screens/community/CommunityDashboard";
import SubmitIssueScreen from "../screens/community/SubmitIssueScreen";
import MyIssuesScreen from "../screens/community/MyIssuesScreen";
import IssueDetailsScreen from "../screens/community/IssueDetailsScreen";

import ManagerDashboard from "../screens/manager/ManagerDashboard";

import WorkerDashboard from "../screens/worker/WorkerDashboard";

import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="CommunityDashboard" component={CommunityDashboard} />
        <Stack.Screen name="SubmitIssue" component={SubmitIssueScreen} />
        <Stack.Screen name="MyIssues" component={MyIssuesScreen} />
        <Stack.Screen name="IssueDetails" component={IssueDetailsScreen} />

        <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} />

        <Stack.Screen name="WorkerDashboard" component={WorkerDashboard} />

        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}