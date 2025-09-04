import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import TabBar from "../../components/TabBar";



export default function TabLayout() {

  return (
    <Tabs
    tabBar={props => <TabBar {...props}/>}
    screenOptions={{headerShown: true, headerStyle: {backgroundColor: Colors.light.text,}, headerTintColor: "white", headerTitleStyle:{fontSize:22},}}
    >
      <Tabs.Screen
      
        name="index"
        options={{
          title: 'Profile',
          headerTitleAlign:"center"
        }}
      />
      <Tabs.Screen
        name="carcheck"
        options={{
          title: 'Car Check',
          headerTitleAlign:"center"
        }}
      />
      <Tabs.Screen
        name="licensecheck"
        options={{
          title: 'License Check',
          headerTitleAlign:"center"
        }}
      />
    </Tabs>
  );
}