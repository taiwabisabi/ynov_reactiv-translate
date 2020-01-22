import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";
import {
  withTheme,
  Appbar,
  Title,
  Card,
  Subheading,
  Badge,
  Divider,
  Text,
  Headline, 
  Caption
} from "react-native-paper";
import moment from "moment";
import "moment/locale/fr";
import styles from "../styles";
import { getStorageHistory } from "../redux/actions/historyActions";

const ListCard = props => (
  props.list.map((item, i) => (
    <View key={i} style={{ marginBottom: 15 }}>
      <Caption>{ moment(item.dateTimestamp).format('[Le] Do MMMM YYYY [à] h:mm:ss') }</Caption>
      <Card>
        <Card.Content>
          <Badge style={{ paddingHorizontal: 10, textTransform: 'uppercase' }}>{ item.from.lang.slice(0, 2) }</Badge>
          <Text>{item.from.text}</Text>
          <Divider style={{ marginBottom: 10, marginTop: 15 }} />
          <Headline>{item.to.text}</Headline>
          <Badge style={{ paddingHorizontal: 10, textTransform: 'uppercase' }}>{ item.to.lang.slice(0, 2) }</Badge>
        </Card.Content>
      </Card>
    </View>
  ))
);

class HistoryScreen extends Component {
  constructor(props) {
    super(props);
    moment().locale('fr');
    this.state = {
      visible: false,
      value: "10"
    };
  }

  componentDidMount() {
    this.props.getHistory();
  }

  render() {
    return (
      <View
        style={[
          styles.containerAppBar,
          { backgroundColor: this.props.theme.colors.surface }
        ]}
      >
        <Appbar style={styles.top}>
          <Title>Historique</Title>
        </Appbar>
        <ScrollView style={styles.padding}>
        {
          this.props.history.length > 0 
            ? <ListCard list={this.props.history} /> 
            : <Subheading>Vore historique est vide.</Subheading> 
        }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ historyReducer }) => {
  return {
    history: historyReducer.history
  };
};

const mapDispatchtoProps = dispatch => {
  return {
    getHistory: () => dispatch(getStorageHistory())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(withTheme(HistoryScreen));
