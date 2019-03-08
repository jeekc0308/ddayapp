import { Text, View, TouchableOpacity } from "react-native";
import React from "react";

export default class TodoComponent extends React.Component {
  render() {
    let textStyle = {
      fontSize: 20,
      paddingLeft: 10
    };
    let isFullFill = this.props.isFulfill == true;
    if (isFullFill) {
      textStyle.textDecorationLine = "line-through";
      textStyle.color = "gray";
    }
    return (
      <View
        style={{
          borderColor: "#bcbcbc",
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginTop: 5,
          display: "flex",
          flexDirection: "row"
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.onFulFill(this.props.id);
          }}
        >
          <Text style={{ fontSize: 24, color: "gray" }}>
            {isFullFill ? "●" : "○"}
          </Text>
        </TouchableOpacity>
        <Text style={textStyle}>{this.props.name}</Text>
      </View>
    );
  }
}
