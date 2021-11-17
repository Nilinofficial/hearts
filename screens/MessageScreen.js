import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from '@firebase/firestore'
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'tailwind-rn'
import Header from '../components/Header'
import ReceiverMessage from '../components/ReceiverMessage'
import SenderMessage from '../components/SenderMessage'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'

const MessageScreen = () => {

    const [input, setInput] = useState("")

    const { params } = useRoute();
    const { matchDetails } = params;

    const { user } = useAuth();
    const [messages,setMessages] = useState([])

    useEffect(() => 
    onSnapshot(query(collection(db,'matches', matchDetails.id, 'messages'), orderBy(
        'timestamp',"desc"
    )
    ), snapshot => setMessages(snapshot.docs.map(doc => ({
        id : doc.id,
        ...doc.data()
    })))),[matchDetails,db])

    const sendMessage = () => {
       addDoc(collection(db,'matches', matchDetails.id, 'messages'), {
           timestamp : serverTimestamp(),
           userId: user.uid,
           displayName : user.displayName,
           photoUrl  :matchDetails.users[user.uid].photoUrl,
           message: input
       });
       setInput("");
    }

    return (
        <SafeAreaView style={{ marginTop: 16, flex: 1 }}>
            <Header title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName} style={tw("")} callEnabled />

            <KeyboardAvoidingView
                behavior={Platform.OS === "android" ? "padding" : "height"}
                style={tw("flex-1")}
                keyboardVerticalOffset={10}
            >


                <TouchableWithoutFeedback 
                
                onPress={Keyboard.dismiss}>
                    <FlatList
                    data = {messages}
                    inverted = {-1}
                    style ={tw("pl-4")}
                    keyExtractor ={(item) => item.id }
                    renderItem = {({item : message}) => 
                    message.userId === user.uid ? (
                        <SenderMessage   key={message.id} message ={message} />
                    ) : (
                        <ReceiverMessage  key = {message.id} message = {message}/> 
                    )
                }
                    />
                </TouchableWithoutFeedback>
               

                <View style={tw("flex-row justify-between items-center  border-t border-gray-200 px-5 py-2")}>
                    <TextInput style={tw("h-10 text-lg")}
                        placeholder="Send message"
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                    />
                    <Button style={styles.sendButton} onPress={sendMessage} title="Send" color="#FF5864" />
                </View>

                </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default MessageScreen


const styles = StyleSheet.create({
    sendButton: {
        borderRadius: 15,

    }
})