import { View, Button, StyleSheet } from "react-native";
import React from "react";
import AddElementComponent from "./AddElementComponent";
import TodoInputComponent from "./TodoInputComponent";

export default class AddTodoFormComponent extends React.Component {
  render() {
    let inputs = this.props.todos.map((value, index) => {
      return (
        <TodoInputComponent
          key={index}
          onChangeText={text => {
            this.props.onChangeTodo(index, text);
          }}
        />
      );
    });
    return (
      <View>
        <AddElementComponent title="할 일 추가">
          <View>{inputs}</View>
          <View>
            <Button
              title="입력란 추가"
              color="#7ab6e8"
              onPress={this.props.addIndex}
            />
            <Button
              title="입력란 삭제"
              color="#e06d6d"
              onPress={this.props.removeIndex}
            />
          </View>
        </AddElementComponent>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
