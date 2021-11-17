

import React from 'react'
import { View, Text,Image, SafeAreaView, ScrollView } from 'react-native'

const ImageScreen = () => {
    return (
        <SafeAreaView style ={{flex: 1, marginTop:35}}>
            <ScrollView>
            <Text style = {{color : "red", marginLeft: 15,fontSize: 16}}>Step  1 : Search Image to link and select second option</Text>
           <Image style ={{width : "100%",height : 500, marginTop : 10}} source={{uri : "https://www.linkpicture.com/q/1_1422.jpg"}} />


           <Text style = {{color : "red", marginLeft: 15,marginVertical: 10, fontSize: 16}}>Step 2 : Upload the image</Text>
           <Image style ={{width : "100%",height : 500, marginTop : 10}} source={{uri : "https://www.linkpicture.com/q/2_467.png"}} />

           <Text style = {{color : "red", marginLeft: 15,marginVertical: 10,fontSize: 16}}> Step 3 : Click on the image</Text>
           <Image style ={{width : "100%",height : 500, marginTop : 10}} source={{uri : "https://www.linkpicture.com/q/3_216.png"}} />
 

           <Text style = {{color : "red", marginLeft: 15,marginVertical: 10,fontSize: 16}}>Step 4 : Copy the link above</Text>
           <Image style ={{width : "100%",height : 500, marginTop : 10}} source={{uri : "https://www.linkpicture.com/q/4_206.png"}} />
      

           <Text style = {{color : "redr", marginLeft: 15,fontSize: 16,marginVertical: 10}}>link will look like https://www.linkpicture.com/q/4_206.png</Text>
                </ScrollView>
          
      
        </SafeAreaView>
    )
}

export default ImageScreen
