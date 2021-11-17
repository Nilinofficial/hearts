
import {AsyncStorage} from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useRef,useState,useEffect, useLayoutEffect } from 'react'
import { View, Text, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet,LogBox, } from 'react-native'

LogBox.ignoreLogs(['Setting a timer']);
import useAuth from '../hooks/useAuth'
import tw from 'tailwind-rn'
import { StatusBar } from 'expo-status-bar'
import { AntDesign,Entypo,Ionicons } from '@expo/vector-icons'; 
import Swiper from 'react-native-deck-swiper'
import { collection, doc, DocumentSnapshot, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from '@firebase/firestore'
import { db } from '../firebase'
import generateId from '../lib/generatId';


const HomeScreen = () => {

    const {logOut,user} = useAuth();
    const swipeRef= useRef(null);
    const navigation = useNavigation();

const [profiles,setProfiles] = useState([]);




useLayoutEffect(
    () =>     onSnapshot(doc(db,'users', user.uid), (snapshot) => {
               if (!snapshot.exists()) {
                   navigation.navigate("Modal")
               }
           })
,[])

useEffect(() => {

    let unsub;

    const fetchCards = async () => {
        const passes = await getDocs(collection(db,'users',user.uid,'passes')).then
        (snapshot => snapshot.docs.map(doc => doc.id)
        );
         
        const swipes = await getDocs(collection(db,'users', user.uid, 'swipes')).then(
            snapshot => snapshot.docs.map(doc => doc.id)
            ) ;

          const passedUserIds = passes.length > 0 ? passes: ["test"];  
          const swipedUserIds = swipes.length > 0 ? swipes: ["test"];

          console.log([...swipedUserIds,...passedUserIds]);

        unsub = onSnapshot(query(collection(db,"users"),where("id", "not-in",[...passedUserIds,...swipedUserIds])),
        (snapshot)=> {
            setProfiles(
                snapshot.docs.filter((doc) => doc.id !==user.uid).map((doc )=> ({

                id:doc.id,
                ...doc.data()
            }))
            )
        }
        )

    }

    fetchCards();

   return  unsub;

},[db]);

const swipeLeft = (cardIndex) => {
    if(!profiles[cardIndex] ) return ;
    
    const userSwiped = profiles[cardIndex];
    console.log(`you passed on ${userSwiped.displayName}`)
    setDoc(doc(db,'users',user.uid, 'passes', userSwiped.id),
    userSwiped);
    }
    
    
    const swipeRight = async (cardIndex) => {
    
        if(!profiles[cardIndex]) return ;
   
        const userSwiped = profiles[cardIndex];
        const loggedInProfile = await(await getDoc(doc(db,'users',user.uid))).data();


         //check if the user swiped on you

         getDoc(doc(db,'users',userSwiped.id,'swipes',user.uid )).then((documentSnapshot) => 
         {
             if(documentSnapshot.exists()){
                 //match
                 
        setDoc(doc(db,"users" ,user.uid, "swipes" , userSwiped.id ),userSwiped);
                 console.log("hooray")



                 //create a match

                 setDoc(doc(db,'matches', generateId(user.uid,userSwiped.id)), {
                     users : {
                         [user.uid] : loggedInProfile,
                         [userSwiped.id] : userSwiped
                     },
                     usersMatched: [user.uid,userSwiped.id],
                     timestamp : serverTimestamp()
                 })
                  navigation.navigate("Match", {
                      loggedInProfile,userSwiped
                  });
             }


             else {

             }

         }
         )

        console.log(`you swiped on ${userSwiped.displayName}`)
        
    
    
        setDoc(doc(db,"users" ,user.uid, "swipes" , userSwiped.id ),userSwiped);
    }
    

    return (

         <SafeAreaView style ={{ marginTop:56 ,flex:1}} >
        <View style={tw("items-center flex-row justify-between px-4")}  >
            <TouchableOpacity onPress={logOut} style={tw("")}>
          <Image 
          style={tw("h-12 w-12 rounded-full")}
           source ={{uri :  user.photoURL}} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {navigation.navigate("Modal")}}  >
            <Image style ={tw("h-14 w-14 ")}  source ={{uri: "https://www.linkpicture.com/q/PicsArt_11-16-10.00.30.png"}}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> navigation.navigate("Chat") }>
                <Ionicons name ="chatbubble-sharp" size ={40} color ="#FF5864"/>
            </TouchableOpacity>
        </View>
           
           {/* Cards */}
           <View style ={tw("flex-1 -mt-6")}>
           <Swiper 
           ref ={swipeRef}
           stackSize={5}
           cardIndex= {0}
           verticalSwipe ={false}
           onSwipedLeft={(cardIndex) => {swipeLeft(cardIndex)}}
           onSwipedRight={(cardIndex) => {swipeRight(cardIndex)}}
           animateCardOpacity
         containerStyle={{backgroundColor:"transparent"}}
           overlayLabels ={{
               left:{
                   title :"NOPE",
                   style : {
                       label : {
                           textAlign : "right",
                           color : "red"
                       },
                   },
               },
               right:{
                title :"MATCH",
                style : {
                    label : {
                        textAlign : "left",
                        color : "green"
                    },
                },
            }
           }}
           cards = {profiles}
           renderCard ={card => card ? (
               <View style={tw("bg-white h-3/4 rounded-xl relative")}>
                  
                   <Image style={tw("h-full w-full rounded-xl absolute ")} source ={{uri : card.photoUrl}} />
             
             <View style ={[tw("bg-white w-full h-20 bottom-0 absolute flex-row justify-between items-center px-6 py-2 rounded-b-xl"), styles.cardShadow ]}>
                 <View >
                     <Text style ={tw("text-xl font-bold")} >{card.displayName}</Text>
                     <Text>{card.job}</Text>
                     </View>
                     <Text style ={tw("text-2xl font-bold")}>{card.age}</Text>
                 </View>
               </View>
           )           
        
           : (
            <View style={[tw(" relative bg-white h-3/4 rounded-xl justify-center items-center "), styles.cardShadow]}> 
                

                <Text style = {tw('font-bold pb-5 ')}
                >
                    No more profiles
                </Text>

                <Image style= {tw('h-40 w-40')} 
                height= {100}
                width= {100}
                source ={{uri : "https://links.papareact.com/6gb"}}
                />

                </View>
        )
        } 
           />
           </View>

           <View style ={tw("flex-row justify-evenly mb-5")}>

                <TouchableOpacity 
                onPress={() => {swipeRef.current.swipeLeft()}}
                style ={tw("items-center justify-center rounded-full w-16 h-16 bg-red-200")}> 
                        <Entypo name = "cross" size={24} color ="red" />
                    </TouchableOpacity>

               <TouchableOpacity 
                            onPress={() => {swipeRef.current.swipeRight()}}
               style ={tw("items-center justify-center rounded-full w-16 h-16 bg-green-200")}>
                   <AntDesign name = "heart"  size={24} color="green"/>
               </TouchableOpacity>

           </View>
          
            
            </SafeAreaView>
      
    )
}

export default HomeScreen


const styles = StyleSheet.create({
    cardShadow : {
        shadowColor : "#000",
        shadowOffset : {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius : 1.41,
        elevation: 2
    }
})