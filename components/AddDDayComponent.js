import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Text,
  DatePickerAndroid
} from "react-native";
import AddElementComponent from "./AddElementComponent";
import AddTodoFormComponent from "./AddTodoFormComponent";
import React from "react";
import { Notifications } from "expo";

export default class AddDDayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      name: "",
      date: new Date(),
      memo: "",
      todos: []
    };
    this.state = this.defaultState;
    this.setDate = () => {
      DatePickerAndroid.open({ date: this.state.date }).then(
        ({ action, year, month, day }) => {
          if (action !== DatePickerAndroid.dismissedAction) {
            let date = new Date(year, month, day);
            this.setState({ date: date });
          }
        },
        ({ code, message }) => {
          console.warn(message);
        }
      );
    };
    this.register = () => {
      let todos = this.state.todos.filter(value => {
        if (value == "" || value.length < 1) {
          return false;
        }
        return true;
      });
      if (!this.state.name || !this.state.date || !this.state.todos) {
        return;
      }

      let state = this.state;
      state.todos = todos;

      Notifications.scheduleLocalNotificationAsync(
        {
          title: "오늘의 일정: " + this.state.name,
          body:
            this.state.memo +
            this.state.todos.map(value => {
              return "\n - " + value;
            })
        },
        {
          time:
            this.state.date.getTime() < new Date().getTime()
              ? new Date().getTime() + 5000
              : this.state.date.setHours(0, 0, 0, 0)
        }
      );
      this.props.register(state);
      this.setState(this.defaultState);
    };
  }
  addTodo = () => {
    this.setState({
      todos: this.state.todos.concat("")
    });
  };
  removeTodo = () => {
    this.setState({
      todos: this.state.todos.slice(0, this.state.todos.length - 1)
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <AddElementComponent title="이름">
          <TextInput
            onChangeText={text => {
              this.setState({ name: text });
            }}
            value={this.state.name}
            style={styles.textInput}
          />
        </AddElementComponent>
        <AddElementComponent title="날짜">
          <Text style={styles.dateText}>
            {this.state.date.getFullYear()}년 {this.state.date.getMonth() + 1}월{" "}
            {this.state.date.getDate()}일
          </Text>
          <Button color="#96b799" title="선택" onPress={this.setDate} />
        </AddElementComponent>
        <AddElementComponent title="메모">
          <TextInput
            style={styles.memoTextInput}
            onChangeText={text => {
              this.setState({ memo: text });
            }}
            value={this.state.memo}
            multiline={true}
          />
        </AddElementComponent>
        <AddTodoFormComponent
          addIndex={this.addTodo}
          removeIndex={this.removeTodo}
          onChangeTodo={(index, value) => {
            let todos = this.state.todos;
            todos[index] = value;
            this.setState({ todos: todos });
          }}
          todos={this.state.todos}
        />
        <Button title="등록" onPress={this.register} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eaecef",
    fontFamily: "NanumSquare",
    padding: 20
  },
  textInput: {
    borderBottomColor: "#b6c1d3",
    borderBottomWidth: 1,
    fontSize: 18
  },
  dateText: {
    fontSize: 18,
    fontWeight: "100"
  },
  memoTextInput: {
    borderBottomColor: "#b6c1d3",
    borderBottomWidth: 1,
    minHeight: 70,
    fontSize: 18
  }
});
