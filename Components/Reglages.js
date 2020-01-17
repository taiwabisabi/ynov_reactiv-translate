import React, {Component} from 'react'
import { StyleSheet, View,Text, ActivityIndicator  } from 'react-native'


class Reglage extends Component {

    constructor(props){
        super(props)
        

    }





        // voir la totalité d'une traduction 
        displayDetailTraduction = (id) => {
            console.log("Id de la traduction : " + id)
            console.log(this.props)
            // la props navigation vient de la la stak navigation 
            // parametre 2 facultatif pour transmettre id de la traduction
            this.props.navigation.navigate("TraductDetail",{id:id})
        }

    render(){
        return(
            <View style={styles.view}>
                <Text>Réglages</Text>
                
            </View>
        )
    }


}

const styles = StyleSheet.create({
    view:{
        marginTop : 20,
        flex: 1

    },
   
})


export default Reglage