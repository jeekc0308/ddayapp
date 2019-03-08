import { View, TextInput } from "react-native";
import React from "react";

export default class TodoInputComponent extends React.Component {
  state = {
    text: ""
  };
  render() {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 5
        }}
      >
        <TextInput
          placeholder="할 일 입력"
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            fontSize: 20,
            borderColor: "#bcbcbc",
            borderWidth: 1
          }}
          onChangeText={text => {
            this.setState({ text: text });
            this.props.onChangeText(text);
          }}
          value={this.state.text}
        />
      </View>
    );
  }
}
