import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAdmin, getLoggedIn } from "./store/storage"

// Import your screens here
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import LogoutScreen from './screens/LogoutScreen';

import PmDashboardScreen from './screens/project_manager/DashboardScreen';
import PmProjectListScreen from './screens/project_manager/project/ProjectListScreen';
import PmCreateProjectScreen from './screens/project_manager/project/CreateProjectScreen';
import PmViewProjectScreen from './screens/project_manager/project/ViewProjectScreen';
import PmCreateTaskScreen from './screens/project_manager/project/tasks/CreateTaskScreen';
import PmViewTaskScreen from './screens/project_manager/project/tasks/ViewTaskScreen';

import PmMemberListScreen from './screens/project_manager/members/MemberListScreen';
import PmCreateMemberScreen from './screens/project_manager/members/CreateMemberScreen';
import PmEditMemberScreen from './screens/project_manager/members/EditMemberScreen';

import MDashboardScreen from './screens/members/DashboardScreen';
import MProjectListScreen from './screens/members/project/ProjectListScreen';
import MViewProjectScreen from './screens/members/project/ViewProjectScreen';
import MViewTaskScreen from './screens/members/project/tasks/ViewTaskScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ProjectManagerTabs() {
  return (
    <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={PmDashboardScreen} />
        <Tab.Screen name="Projects" component={ProjectManagerProjectStack} options={{ headerShown: false }} />
        <Tab.Screen name="Members" component={MemberStack} options={{ headerShown: false }} />
        <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
}

function MemberTabs() {
  return (
    <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={MDashboardScreen} />
        <Tab.Screen name="Projects" component={MemberProjectStack} options={{ headerShown: false }} />
        <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
}

function ProjectManagerProjectStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Project List" component={PmProjectListScreen} />
        <Stack.Screen name="Create Project" component={PmCreateProjectScreen} />
        <Stack.Screen name="View Project" component={PmViewProjectScreen} />
        <Stack.Screen name="Create Task" component={PmCreateTaskScreen} />
        <Stack.Screen name="View Task" component={PmViewTaskScreen} />
      </Stack.Navigator>
    );
}

function MemberProjectStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Project List" component={MProjectListScreen} />
      <Stack.Screen name="View Project" component={MViewProjectScreen} />
      <Stack.Screen name="View Task" component={MViewTaskScreen} />
    </Stack.Navigator>
  );
}

function MemberStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Member List" component={PmMemberListScreen} />
      <Stack.Screen name="Create Member" component={PmCreateMemberScreen} />
      <Stack.Screen name="Edit Member" component={PmEditMemberScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchAuthState = async () => {
        const loggedIn = await getLoggedIn();
        const admin = await getAdmin();
        
        setIsLoggedIn(loggedIn);
        setIsAdmin(admin);
        setIsLoading(false);
      };
  
      fetchAuthState();
    }, []);
  
    if (isLoading) {
      return null; // You can return a loading screen here.
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ProjectManagerTabs" component={ProjectManagerTabs} />
                <Stack.Screen name="MemberTabs" component={MemberTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
