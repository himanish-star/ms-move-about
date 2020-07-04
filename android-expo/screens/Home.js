import React from 'react';
import { Image as ImgReact, Text, View, ImageBackground, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import Svg, {G, ClipPath, Polygon, Image, Line, Text as TextSvg, Circle, Rect, Polyline} from 'react-native-svg';
import {Icon, Button, ListItem, Card, Input} from 'react-native-elements'
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
    src: "16.3A.1",
    dest: "17.3G.2",
    polyline: null,
    levels: [],
    navigationOn: false
  };

  beginNavigation () {
    // TODO: add checks here to see that the coords exist
    if(this.state.src.split(".")[0]===this.state.dest.split(".")[0]) {
      // same level
      this.setState({navigationOn: true, levels: [parseInt(this.state.src.split(".")[0])]});
    } else {
      // different level
      this.setState({
        navigationOn: true,
        levels: [parseInt(this.state.src.split(".")[0]),parseInt(this.state.dest.split(".")[0])]})
    }
  }

  generatePolylines () {
    if(this.state.levels.length===2) {
      const lc_levels = this.state.levels;
      this.setState({levels: [], polyline: getShortestPath(this.state.src,`${lc_levels[0]}.LIFT`,lc_levels[0],bh,bw,mapHeight)});
      setTimeout(() => {
        this.setState({polyline: getShortestPath(`${lc_levels[1]}.LIFT`,this.state.dest,lc_levels[1],bh,bw,mapHeight)});
      }, 5000);
    } else if(this.state.levels.length===1) {
      const lc_levels = this.state.levels;
      this.setState({levels: [], polyline: getShortestPath(this.state.src,this.state.dest,lc_levels[0],bh,bw,mapHeight)});
    }
  }

  render() {
    if(!this.state.navigationOn) {
      return(
          <Card
              title='MS Move-About'>
            <Text style={{marginBottom: 10}}>
              Please enter your current location and the location where you wish to go to :)
            </Text>
            <Input
                key="src-id"
                onChangeText={(text) => {this.setState({src: text})}}
                placeholder='current location'
                leftIcon={{ type: 'font-awesome', name: 'map-marker' }}
            />
            <Input
                key="dest-id"
                onChangeText={(text) => {this.setState({dest: text})}}
                placeholder='destination'
                leftIcon={{ type: 'font-awesome', name: 'map-marker' }}
            />
            <Button
                icon={<Icon type='font-awesome' name='location-arrow' style={{marginRight: 5}} color='#ffffff' />}
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                onPress={() => {this.beginNavigation()}}
                title='Start Navigation' />
          </Card>
      );
    }

    if(this.state.polyline===null) {
      setTimeout(() => {this.generatePolylines();}, 2000);
      return(<Block><Text>Loading</Text></Block>);
    }

    return (
        <ScrollView>
          <View style={{ overflow: "scroll", alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground resizeMode="contain" source={floor_bgs[this.state.current_floor]} style={[styles.image, {opacity: 1}]}>
              <Svg height={mapHeight} width={mapWidth}>
                {/*<Line
                    x1={floorPlansJson[this.state.current_floor].red_nodes[this.state.src].coords[0]*bw}
                    y1={mapHeight - floorPlansJson[this.state.current_floor].red_nodes[this.state.src].coords[1]*bh}
                    x2={floorPlansJson[this.state.current_floor].blue_nodes[this.state.src.split(".").slice(0,2).join(".")].coords[0]*bw}
                    y2={mapHeight - floorPlansJson[this.state.current_floor].blue_nodes[this.state.src.split(".").slice(0,2).join(".")].coords[1]*bh}
                    stroke="red" strokeWidth="3" opacity={0.5} />*/}
                <Polyline
                    points={this.state.polyline}
                    stroke="lime"
                    opacity={0.25}
                    fill="transparent"
                    strokeWidth="5"
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
