import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react'
import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth'
import tw from "tailwind-rn"

const LoginScreen = () => {
   const {signInWithGoogle,loading} = useAuth();
  const navigation = useNavigation()

  useLayoutEffect(() => {
      navigation.setOptions({
          headerShown:false,
      })
      
  }, [])

    return (
        <View  style ={tw("flex-1")}>
            {/* <Text>{loading? "loading ...."  : "Login to this app"}</Text>
            <Button title = "login"></Button> */}

            <ImageBackground 
             source ={{uri : "https://www.linkpicture.com/q/PicsArt_11-17-12.17.23.jpg"}} 
             resizeMode = "cover"
             style ={tw("flex-1")}
            />

            <TouchableOpacity onPress={signInWithGoogle} style={[tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl "), {marginHorizontal: "25%", alignItems: "center" }]}>
                <Text   style ={tw("font-semibold")}>Sign In & get swiping</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen
