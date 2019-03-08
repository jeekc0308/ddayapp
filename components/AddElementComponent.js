import {Text, View} from 'react-native';
import React from 'react';

export default class AddElementComponent extends React.Component {
    render() {
        return (
            <View style={{padding: 10}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    {this.props.title}
                </Text>
                {this.props.children}
            </View>
        )
    }
};