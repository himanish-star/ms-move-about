import React from 'react';
import { Image as ImgReact, Text, View, ImageBackground, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import Svg, {G, ClipPath, Polygon, Image, Line, Text as TextSvg, Circle, Rect, Polyline} from 'react-native-svg';
import { ListItem } from 'react-native-elements'
import { ProductCard } from '../components/';
import articles from '../constants/articles';
import {EventRegister} from "react-native-event-listeners";
import {argonTheme} from "../constants";
import {getShortestPath} from "../utility/path_compute";
import floor_16_json from "../floor_plans/floor_16/floor.json";

const floorPlansJson = {
  16: floor_16_json
}

const { width, height } = Dimensions.get('screen');

const mapHeight = height/2.5;
const mapWidth = width;

const bh = mapHeight/26.5;
const bw = mapWidth/31.2;

const floor_bgs = {
  16: require("../floor_plans/floor_16/floor_bg.png")
}

// const image = [require("../assets/imgs/warehouse-layout-walmart.jpeg"), require('../assets/imgs/warehouse-layout-2.jpeg')];

class Home extends React.Component {
  /*renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          <Card item={articles[0]} horizontal  />
          <Block flex row>
            <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} />
            <Card item={articles[2]} />
          </Block>
          <Card item={articles[3]} horizontal />
          <Card item={articles[4]} full />
        </Block>
      </ScrollView>
    )
  }*/

  state = {
    current_floor: 16,
    src: "16.3H.3",
    dest: "16.LIFT",
  };

  render() {
    return (
        <ScrollView>
          <View style={{ overflow: "scroll", alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground resizeMode="contain" source={floor_bgs[this.state.current_floor]} style={[styles.image, {opacity: 1}]}>
              <Svg height={mapHeight} width={mapWidth}>
                <Line
                    x1={floorPlansJson[this.state.current_floor].red_nodes[this.state.src].coords[0]*bw}
                    y1={mapHeight - floorPlansJson[this.state.current_floor].red_nodes[this.state.src].coords[1]*bh}
                    x2={floorPlansJson[this.state.current_floor].blue_nodes[this.state.src.split(".").slice(0,2).join(".")].coords[0]*bw}
                    y2={mapHeight - floorPlansJson[this.state.current_floor].blue_nodes[this.state.src.split(".").slice(0,2).join(".")].coords[1]*bh}
                    stroke="red" strokeWidth="3" opacity={0.5} />
                <Polyline
                    points={getShortestPath(this.state.src,this.state.dest,this.state.current_floor,bh,bw,mapHeight)}
                    stroke="lime"
                    opacity={0.5}
                    fill="transparent"
                    strokeWidth="3"
                />
              </Svg>
            </ImageBackground>
          </View>
        </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  image: {
    height: null,
    width: null,
  },
});

export default Home;
