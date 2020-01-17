// Navigation/Navigation.js

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Traduct from '../Components/Traduct'

const TraductStackNavigator = createStackNavigator(
    {
        Traduct: { // Ici j'ai appelé la vue "Traduct" mais on peut mettre ce que l'on veut. C'est le nom qu'on utilisera pour appeler cette vue
        screen: Traduct,
        navigationOptions: {
        title: 'Traduction'
        }
    }
});


/*
const TraductTabNavigator = createMaterialBottomTabNavigator({
    Home: {
        screen: Traduct,
        navigationOptions: {
            tabBarLabel: 'Traduction'
            /*tabBarIcon: ({ tintColor }) => (
                <Icon color={tintColor} size={25} name={'ios-home'} />
            )
        }
    },

    Traduct: {
      screen: TraductStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Traduction'
        //tabBarIcon: () => {}
      }
    },
    
    
  },
  /*{
    tabBarOptions: {
        activeBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
        inactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
        showLabel: false, // On masque les titres
        //showIcon: true // On informe le TabNavigator qu'on souhaite afficher les icônes définis
      } 
  },
  {
    initialRouteName: 'Home'
}

  )*/

export default createAppContainer(TraductStackNavigator)