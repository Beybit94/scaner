import React from "react";
import { View, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontFamily: "SFProText-Semibold",
    fontSize: 24,
    color: "black",
    textAlign: "center",
    lineHeight: 30,
  },
  desc: {
    fontFamily: "SFProText-Regular",
    fontSize: 16,
    lineHeight: 25,
    color: "#0c0d34",
    textAlign: "center",
  },
});

interface SubslideProps {
  title: string;
  desc: string;
  last?: boolean;
}
const Subslide = ({ title, desc, last }: SubslideProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
};

export default Subslide;
