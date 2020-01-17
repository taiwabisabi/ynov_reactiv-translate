import React, {Component} from 'react'
import { StyleSheet, View, TextInput, Button, FlatList, Text, ActivityIndicator  } from 'react-native'
import traductions from '../Helpers/TraductData'
import TraductItem from './TraductItem';

class Traduct extends Component {

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
                
                <FlatList
                    data={traductions}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => console.log("onEndReached")}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) =><TraductItem traduction={item}
                    displayDetailTraduction={this.displayDetailTraduction}/>}
                />
            </View>
        )
    }


}

const styles = StyleSheet.create({
    view:{
        flex: 1,

    },
   
})

export default Traduct