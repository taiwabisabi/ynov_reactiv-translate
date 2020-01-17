import React, {Component} from 'react'
import { StyleSheet, Text, View  } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'


class TraductDetail extends Component {


    constructor(props){
        super(props)

    }


    render(){
        const idTraduct = this.props.navigation.state.params.id
        const title = this.props.navigation.state.params.title
        const title_traduct = this.props.navigation.state.params.title_traduct
        const langue_entre = this.props.navigation.state.params.langue_entre
        const langue_sortie = this.props.navigation.state.params.langue_sortie
        const date = this.props.navigation.state.params.date
        return(
            <View style={styles.main_container}>
                <ScrollView style={styles.scroll_container}>
                    <Text style={styles.title_text}> Langue : {langue_entre }</Text>
                    <Text style={styles.description_text}> Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Aenean ac pretium diam. Morbi accumsan mollis finibus. 
                        Vivamus sem massa, vestibulum sit amet vehicula at, bibendum sed turpis. In in tellus sit amet dui blandit.  
                        {title }</Text>
                    <Text style={styles.title_text}> Traduction  : {langue_sortie }</Text>
                    <Text style={styles.description_text}> Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Aenean ac pretium diam. Morbi accumsan mollis finibus. 
                        Vivamus sem massa, vestibulum sit amet vehicula at, bibendum sed turpis. In in tellus sit amet dui blandit.
                        {title_traduct }</Text>
                    <Text style={styles.default_text}> Le : 00/00/0000 {date }</Text>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
      },
    scroll_container :{
        flex : 1
    },
    
   title_text: {
    fontWeight: 'bold',
    fontSize: 35,
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    color: '#000000',
    textAlign: 'center'
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666',
    margin: 5,
    marginBottom: 15
  },
  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  }
})

export default TraductDetail