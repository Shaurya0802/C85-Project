import React from 'react';
import {StyleSheet, Text, View, Dimensions, Animated, TouchableHighlight} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';
import db from '../config';

export default class SwipeableFlatlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allNotifications: this.props.allNotifications
        }
    }

    updateMarkAsRead = (notification) => {
        db.collection('all_notifications').doc(notification.doc_id).update({
            "notification_status": "read"
        });
    }

    onSwipeChangeValue = (swipeData) => {
        var allNotifications = this.state.allNotifications;
        const {key, value} = swipeData;

        if (value < -Dimensions.get('window').width) {
            const newData = [...allNotifications];
            const prevIndex = allNotifications.findIndex(item => item.key === key);
            this.updateMarkAsRead(allNotifications[prevIndex]);
            newData.splice(prevIndex, 1);
            this.setState({allNotifications: newData});
        }
    }

    renderItem = (data) => {
        <ListItem 
            leftElement = {<Icon name="book" type="font-awesome" color="#696969" />}
            title={data.item.thing_name}
            titleStyle={{color: '#000', fontWeight: 'bold'}}
            subtitle={data.item.message}
            bottomDivider
        />
    }

    renderHiddenItem = () => {
        <View style={styles.rowBack}>
            <View style={[styles.BackRightBtn, styles.BackRightBtnRight]}>
                <Text style={styles.backTextWhite}></Text>
            </View>
        </View>
    }

    render() {
        return (
            <View style={styles.container}>
                <SwipeListView 
                    disableRightSwipe
                    data={this.state.allNotifications}
                    renderItem={this.renderItem}
                    renderHiddenItem={this.renderHiddenItem}
                    rightOpenValue={-Dimensions.get('window').width}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onSwipeValueChange={this.onSwipeChangeValue}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});