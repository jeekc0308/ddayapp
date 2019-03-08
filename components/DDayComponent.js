import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import TodoComponent from "./TodoComponent";

export default class DDayComponent extends React.Component {
  state = {
    isViewMemo: false,
    isCanShowMemo: this.props.memo !== ""
  };
  render() {
    let dday = Math.floor(
      (new Date().getTime() - this.props.date.getTime()) / (1000 * 60 * 60 * 24)
    );
    let dateString =
      this.props.date.getFullYear() +
      "년 " +
      (this.props.date.getMonth() + 1) +
      "월 " +
      this.props.date.getDate() +
      "일";
    let ddayStyle = { fontSize: 15, backgroundColor: "#c5d8f7", padding: 5 };
    if (dday > 0) {
      ddayStyle.backgroundColor = "#c99f9f";
    }

    let todos = null;
    if (this.props.todos && this.props.todos.length > 0) {
      todos = this.props.todos.map((value, index) => {
        return (
          <TodoComponent
            isFulfill={value.isFulfill}
            id={value.id}
            key={index}
            name={value.name}
            onFulFill={this.props.onTodoFulfill}
          />
        );
      });
      todos = [
        <View key="-1" style={{ padding: 5 }}>
          <Text style={{ fontSize: 20 }}>할 일들</Text>
        </View>
      ].concat(todos);
    }
    return (
      <View
        style={{
          flex: 1,
          padding: 30,
          borderBottomWidth: 1,
          borderBottomColor: "#b6c1d3",
          backgroundColor: "white"
        }}
      >
        <View style={ddayStyle}>
          <Text>
            {dateString}, D{dday >= 0 ? "+" + dday : dday}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.onDelete(this.props.id);
            }}
            style={{ position: "absolute", right: 10 }}
          >
            <Ionicons name="md-close" size={24} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {this.props.name}
        </Text>
        <Text style={{ fontSize: 14 }}>{this.props.memo}</Text>
        {todos}
      </View>
    );
  }
}
