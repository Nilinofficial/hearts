
import React from 'react'
import { View, Text,SafeAreaView } from 'react-native'
import ChatList from '../components/ChatList'
import Header from '../components/Header'

const ChatScreen = () => {
    return (
                <SafeAreaView style={{marginTop: 17}}>
               <Header title = "Chat"/>
               <ChatList/>
                </SafeAreaView>
        
    )
}

export default ChatScreen
