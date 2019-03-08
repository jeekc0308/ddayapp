import React from "react";
import DDayComponent from "../components/DDayComponent";
import AddDDayComponent from "../components/AddDDayComponent";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Keyboard
} from "react-native";
import DBDDays from "../db/DDays";

export default class HomeScreen extends React.Component {
  state = {
    DDays: [],
    visibleHeight: Dimensions.get("window").height
  };
  constructor(props) {
    super(props);
    this.db_ddays = new DBDDays();
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide.bind(this)
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  keyboardDidShow(e) {
    let newSize = Dimensions.get("window").height - e.endCoordinates.height;
    this.setState({
      visibleHeight: newSize
    });
  }
  keyboardDidHide() {
    this.setState({
      visibleHeight: Dimensions.get("window").height
    });
  }
  componentDidMount() {
    this.update();
  }
  onTodoFulfill = id => {
    console.log("눌림");
    console.log(id);
    this.db_ddays.todoFulfillToggle(id).then(() => {
      this.update();
    });
  };
  update = () => {
    let arr = [];
    this.db_ddays.getDdays().then(datas => {
      datas.forEach(value => {
        arr.push({
          id: value.id,
          name: value.name,
          memo: value.memo,
          todos: value.todos,
          date: new Date(value.date)
        });
      });
      this.setState({ DDays: arr });
    });
  };
  register = data => {
    this.db_ddays.insertDDays(data).then(() => {
      this.update();
    });
  };

  onDeleteDDay = id => {
    this.db_ddays.deleteDdays(id).then(() => {
      this.update();
    });
  };
  render() {
    const ddays = this.state.DDays.map(dday => (
      <DDayComponent
        id={dday.id}
        key={dday.id}
        name={dday.name}
        date={dday.date}
        memo={dday.memo}
        todos={dday.todos}
        onDelete={this.onDeleteDDay}
        onTodoFulfill={this.onTodoFulfill}
      />
    ));
    return (
      <View style={{ height: this.state.visibleHeight }}>
        <ScrollView
          style={{
            backgroundColor: "#eaecef",
            paddingTop: 25,
            fontFamily: "NanumSquare"
          }}
        >
          <Text
            style={{
              fontSize: 30,
              textAlign: "center",
              fontWeight: "900",
              fontFamily: "NanumSquare"
            }}
          >
            D-Day App
          </Text>
          <AddDDayComponent register={this.register} />
          <View
            style={{ display: "flex", flexDirection: "column", paddingTop: 15 }}
          >
            {ddays}
          </View>
        </ScrollView>
      </View>
    );
  }
}
