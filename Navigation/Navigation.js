// Navigation/Navigation.js

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Traduct from '../Components/Traduct'
import TraductDetail from '../Components/TraductDetail'
import Historique from '../Components/Historique'
import Reglages from '../Components/Reglages'


const TraductStackNavigator = createStackNavigator(
{
        Traduct: { // Ici j'ai appelé la vue "Traduct" mais on peut mettre ce que l'on veut. C'est le nom qu'on utilisera pour appeler cette vue
        screen: Traduct,
        navigationOptions: {
        title: 'Traduction'
        }
        
    },

    TraductDetail: { // Ici j'ai appelé la vue "Traduct" mais on peut mettre ce que l'on veut. C'est le nom qu'on utilisera pour appeler cette vue
        screen: TraductDetail,
        navigationOptions: {
        title: 'Detail traduction'
        }
    },
    
});



const TraductTabNavigator = createMaterialBottomTabNavigator({
    
    Traduction : {
        screen:TraductStackNavigator
    },
    Historique:{
        screen: Historique
    },
    Reglages:{
        screen: Reglages
    }

})

export default createAppContainer(TraductTabNavigator)