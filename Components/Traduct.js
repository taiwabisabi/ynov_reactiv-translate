import React, {Component} from 'react'
import { StyleSheet, View, TextInput, Button, FlatList, Text, ActivityIndicator  } from 'react-native'
import traductions from '../Helpers/TraductData'
import TraductItem from './TraductItem';

class Traduct extends Component {

    constructor(props){
        super(props)
        this.page = 0
        this.totalPage = 0
        this.state ={
            traductions : [],
            //text_entre : "",
            is_loading : false
        }
        this.text_entre = ""

    }
// tarduction du text
    traduire(){
        this.setState({is_loading:true})
        //this.setState.traduction


        this.setState({is_loading:false})
    }

    //recupération de la valeur du textInput dans state
    textATraduire(text){
        this.text_entre = text
    }

    chargement(){
        if(this.setState.is_loading ){
            return(
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large"/>
                </View>
            )
        }
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
                
                <TextInput 
                    onSubmitEditing={()=>traduire()}
                    onChangeText={(text) => textATraduire(text)}
                    placeholder="Saisir texte" style={styles.textipunt} multiline={true} numberOfLines={5}></TextInput>
                <Button style={styles.btn_traduct} title="Traduction" onPress={() => this.traduire()}></Button>

                <FlatList
                    data={traductions}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => console.log("onEndReached")}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) =><TraductItem traduction={item}
                    displayDetailTraduction={this.displayDetailTraduction}/>}
                />

                {this.chargement()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    view:{
        flex: 1,

        /*justifyContent:'center',*/
        /*alignItems:'center'*/
    },
    textipunt:{
        /*flex:2,*/
        marginLeft: 5, 
        marginRight: 5, 
        height: 200, 
        borderColor: '#000000', 
        borderWidth: 1, 
        paddingLeft: 5,
        marginTop : 10 
    },
    btn_traduct:{
        /*flex:1,*/
        marginTop:10
    },
    loading_container : {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 250,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Traduct