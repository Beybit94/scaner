import React from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { useValue, onScrollEvent, interpolateColor } from "react-native-redash";
import { multiply } from "react-native-reanimated";

import Slide, { SLIDE_HEIGHT } from "./Slide";
import Subslide from "./Subslide";

const BORDER_RADIUS = 75;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  slider: {
    height: SLIDE_HEIGHT,
    borderBottomRightRadius: BORDER_RADIUS,
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderTopLeftRadius: BORDER_RADIUS,
  },
});
const slides = [
  { label: "Test1", color: "#bfeaf5", title: "title1", desc: "desc1" },
  { label: "Test2", color: "#beecc4", title: "title2", desc: "desc2" },
  { label: "Test3", color: "#ffe4d9", title: "title3", desc: "desc3" },
  { label: "Test4", color: "#ffdddd", title: "title4", desc: "desc4" },
];

const Onboarding = () => {
  const x = useValue(0);
  const onScroll = onScrollEvent({ x: x });
  const backgroundColor = interpolateColor(x, {
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map((slide) => slide.color),
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, { backgroundColor }]}>
        <Animated.ScrollView
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={1}
          {...{ onScroll }}
        >
          {slides.map(({ label }, index) => (
            <Slide key={index} right={!!(index % 2)} {...{ label }} />
          ))}
        </Animated.ScrollView>
      </Animated.View>
      <View style={styles.footer}>
        <Animated.View
          style={{ ...StyleSheet.absoluteFillObject, backgroundColor }}
        />
        <Animated.View
          style={[
            styles.footerContent,
            {
              width: width * slides.length,
              flex: 1,
              //transform: [{ translateX: multiply(x, -1) }],
            },
          ]}
        >
          {slides.map(({ title, desc }, index) => (
            <Subslide
              key={index}
              last={index === slides.length - 1}
              {...{ title, desc }}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

export default Onboarding;
