
import { useNavigation } from '@react-navigation/native'
import React, { useLayoutEffect, useState } from 'react'
import { View, Text, Button, ImageBackground, TouchableOpacity, Image, TextInput } from 'react-native'
import useAuth from '../hooks/useAuth'
import tw from "tailwind-rn"
import { doc, serverTimestamp, setDoc } from '@firebase/firestore'
import { db } from '../firebase'

const ModalScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [image, setImage] = useState(null);
    const [name,setName] =  useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);
   

    const inCompleteForm = !image || !job || !age;


const updateUserprofile = () => {
    setDoc(doc(db, 'users', user.uid ), {

        id : user.uid,
        displayName: user.displayName,
        photoUrl : image,
        job:job,
        age:age,
        timestamp: serverTimestamp()
    }).then(()=> {navigation.navigate('Home')}).catch((err)=> {alert(err.message)})

}

    return (
        <View style={tw("flex-1 items-center pt-1")}>
            <Image
                style={tw("h-40 w-full")}
                resizeMode="contain"
                source={{ uri: "https://www.linkpicture.com/q/PicsArt_11-16-09.28.21.png" }}
            />

            <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>Welcome {user.displayName}</Text>

            <Text style={tw("text-center p-4 font-bold text-red-400")}>
                Step 1 : Change the Profile Pic

            </Text> 

            

             <TextInput value={image} onChangeText={text => setImage(text)} placeholder="Enter Profile pic url" />


          
               <Text >Want to create profile url ? <Text style={{color: "blue"}} onPress ={()=> navigation.navigate("Image")}>Click here</Text></Text>


             {/* <Text style={tw("text-center p-4 font-bold text-red-400")}>
                Step 2 : Your Name

            </Text>
            <TextInput value={name} onChangeText={setName} placeholder="Enter your Name" /> */}


            <Text style={tw("text-center p-4 font-bold text-red-400")}>
                Step 2 : Your Job

            </Text>

            <TextInput value={job} onChangeText={setJob} placeholder="Enter your Occupation" />

            <Text style={tw("text-center p-4 font-bold text-red-400")}>
                Step 3 : Your Age

            </Text>

            <TextInput 
            keyboardType= 'numeric'
            value={age} onChangeText={setAge} placeholder="Enter your age" />



                
        

            <TouchableOpacity
            onPress={updateUserprofile}
            disabled={inCompleteForm}
            style={[tw("w-64 p-3 rounded-xl absolute bottom-10 bg-red-500 "), 
                inCompleteForm ? tw("bg-gray-400") : tw("bg-red-400")
            ]}>
                <Text style={tw("text-center text-white text-xl")}>
                    Update Profile
                </Text>
            </TouchableOpacity>


        </View>
    )
}

export default ModalScreen
