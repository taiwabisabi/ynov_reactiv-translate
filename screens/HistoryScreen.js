import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { withTheme, Appbar, Title, List} from 'react-native-paper';
import styles from '../styles';
import { connect } from "react-redux";

class HistoryScreen extends Component {
    generateListItem = () => {
        return this.props.history.map((e, index) => {
            return <List.Item
                key={index}
                title={e.from.text}
                descriptionNumberOfLines={3}
                description={e.to.text +'\n'+ e.from.lang.slice(0, 2) + ' -> ' + e.to.lang.slice(0, 2)}
                left={() => <List.Icon icon="folder" />}
            />
        });
    }

    render() {
        return (
            <View
                style={[
                styles.containerAppBar,
                { backgroundColor: this.props.theme.colors.surface }
            ]}>
                <Appbar style={styles.top}>
                    <Title>History</Title>
                </Appbar>
                <List.Section style={[styles.margin, { paddingHorizontal: 10 }, {marginBottom: 50}]}>
                    <List.Subheader>Mes dernières traductions</List.Subheader>
                    <ScrollView>
                        {this.generateListItem()}
                    </ScrollView>
                </List.Section>
            </View>
        );
    }
}


const mapStateToProps = ({ historyReducer }) => {
    return {
      history: historyReducer.history
    };
};

export default connect(
    mapStateToProps,
)(withTheme(HistoryScreen));
