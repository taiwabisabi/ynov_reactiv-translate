import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { withTheme, Appbar, Title, List, Button, Dialog, Portal, RadioButton, Text} from 'react-native-paper';
import styles from '../styles';
import { connect } from "react-redux";

class HistoryScreen extends Component {
    state = {
        visible: false,
        value: '10'
    };

    _showDialog = () => this.setState({ visible: true });
    _hideDialog = () => this.setState({ visible: false });

    _generateListItem = () => {
        let history = this.props.history.slice().reverse();
        return history.map((e, index) => {
            if(index < this.state.value)
                return <List.Item
                    key={index}
                    titleStyle={[ {color: this.props.theme.colors.primary} ]}
                    title={e.from.text}
                    descriptionNumberOfLines={4}
                    description={e.to.text +'\n'+ e.from.lang.slice(0, 2) + ' -> ' + e.to.lang.slice(0, 2) + '\n' + e.dateTimeTranslation}
                    left={() => <List.Icon icon="translate" />}
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
                <View>
                    <Button onPress={this._showDialog}>Afficher par : {this.state.value}</Button>

                    <Portal>
                        <Dialog visible={this.state.visible} onDismiss={this._hideDialog}>
                            <Dialog.Title style={[
                                { color: this.props.theme.colors.primary }
                            ]}>Combien de résultats souhaitez-vous afficher ?</Dialog.Title>

                            <Dialog.Content>
                                <RadioButton.Group
                                    onValueChange={value => this.setState({ value })}
                                    value={this.state.value}
                                >
                                    <View>
                                        <Text>10</Text>
                                        <RadioButton value='10' />
                                    </View>
                                    <View>
                                        <Text>20</Text>
                                        <RadioButton value='20' />
                                    </View>
                                    <View>
                                        <Text>30</Text>
                                        <RadioButton value='30' />
                                    </View>
                                    <View>
                                        <Text>40</Text>
                                        <RadioButton value='40' />
                                    </View>
                                    <View>
                                        <Text>50</Text>
                                        <RadioButton value='50' />
                                    </View>
                                </RadioButton.Group>
                            </Dialog.Content>

                            <Dialog.Actions>
                                <Button onPress={this._hideDialog}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

                </View>
                <List.Section style={[styles.margin, { paddingHorizontal: 10 }, {marginBottom: 100}]}>
                    <List.Subheader>Mes dernières traductions</List.Subheader>
                    <ScrollView>
                        {this._generateListItem()}
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
