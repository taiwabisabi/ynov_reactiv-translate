import React, {Component} from 'react'
import { StyleSheet, View, TextInput, Button, FlatList, Text  } from 'react-native'

class TraductItem extends Component{

    render(){
        console.log(this.props)
        //recupération de ma props transmit a mon composant depuis Traduct.js
        const traduction = this.props.traduction
        return(
            <View style={styles.main_contenair}>
                <Text>{traduction.langue_entre} :</Text>
                <Text numberOfLines={5}>{traduction.title}</Text>
                <Text>{traduction.langue_sortie} :</Text>
                <Text numberOfLines={5}>{traduction.title_traduct}</Text>
                <Text style={styles.date_text} numberOfLines={5}>{traduction.date}</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    main_contenair:{
        height: 100
    },
    date_text: {
        textAlign: 'right',
        fontSize: 14,
        fontWeight: 'bold'
      }
})

export default TraductItem