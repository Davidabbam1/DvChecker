import { FontAwesome } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { Colors } from "../constants/Colors";

const TabBar = ({ state, descriptors, navigation }) => {
    const icons ={
        index: (props) => <FontAwesome size={26} name="user-circle-o" color={Colors.light.tint} {...props}/> ,
        carcheck: (props) => <FontAwesome size={26} name="car" color={Colors.light.tint} {...props} />,
        licensecheck: (props) => <FontAwesome size={26} name="drivers-license-o" color={Colors.light.tint} {...props} />
    }
  return (
   <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        
        if(['_sitemap', '+not-found'].includes(route.name)) return null

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.name}
            style={styles.tabBarItem}
            // href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {
                icons[route.name]({
                    color: isFocused ? Colors.light.tint : "#f9f9f9",
                }) 
            }
            <Text style={{ color: isFocused ? Colors.light.tint : "#f9f9f9", fontSize: 12 }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  )
}

export default TabBar

const styles = StyleSheet.create({
    tabBar:{
        position: 'absolute',
        bottom: Platform.OS === "ios" ? 50 : 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: "#273576",
        marginHorizontal:20,
        paddingVertical:15,
        borderRadius:30,
        borderCurve: 'continuous',
        shadowColor: "black",
        shadowOffset: {width: 0,height: 10},
        shadowRadius:10,
        shadowOpacity:0.5
    },
    tabBarItem:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
       
    }
})