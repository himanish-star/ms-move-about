import React from 'react';
import { Image as ImgReact, CheckBox, Text, View, ImageBackground, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import Svg, {G, ClipPath, Polygon, Image, Line, Text as TextSvg, Circle, Rect, Polyline} from 'react-native-svg';
import {Icon, Button, ListItem, Card, Input} from 'react-native-elements'
import articles from '../constants/articles';
import {EventRegister} from "react-native-event-listeners";
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import {argonTheme} from "../constants";
import {getShortestPath} from "../utility/path_compute";
import {getPathInfo, isValidRoomId} from "../utility/Dijkstra";
import floor_16_json from "../floor_plans/floor_16/floor.json";
import {
  Card as MaterialCard,
  CardAction,
  CardButton,
  CardContent,
  CardImage,
  CardTitle
} from 'react-native-material-cards';

const floorPlansJson = {
  16: floor_16_json
}

const default_room = "16.3I.2"

const time_duration = 1000;
const dir_icons = {
  "straight": require("../assets/direction_icons/straight.png"),
  "left": require("../assets/direction_icons/left.png"),
  "right": require("../assets/direction_icons/right.png"),
  "slight-left": require("../assets/direction_icons/slight-left.png"),
  "slight-right": require("../assets/direction_icons/slight-right.png"),
}
const dir_msgs = {
  "straight": "Move straight for ",
  "left": "Take a left in ",
  "right": "Take a right in ",
  "slight-left": "Take a slight-left in ",
  "slight-right": "Take a slight-right in ",
}
const { width, height } = Dimensions.get('screen');

const mapHeight = height/2.5;
const mapWidth = width;

const bh = mapHeight/26.5;
const bw = mapWidth/31.2;

const floor_bgs = {
  16: require("../floor_plans/floor_16/floor_bg.png"),
  17: require("../floor_plans/floor_17/floor_bg.png")
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
    src: "",
    dest: "",
    polyline: null,
    polypath: null,
    distToTurn: 0,
    dirToTurn: "straight",
    timeToTurn: 0,
    eta: 0,
    selectCurrentLocation: false,
    pathPenalty: 0,
    idEntrySrc: false,
    idEntryDest: false,
    validSrcId: true,
    validDestId: true,
    waitForLift: false,
    level_animation: false,
    levels: [],
    navigationOn: false,
    navigationComplete: false,
    gx: 0,
    gy: 0
  };

  move_tracker () {
    const coords_to_travel = this.state.polyline.split(" ").map(coord_pair => {
      const xy = coord_pair.split(",");
      return [+(xy[0]),+(xy[1])];
    });

    let time_counter = 1;
    setTimeout(() => {this.setState({level_animation: true, eta: this.state.polypath[1].slice(-1)[0]});}, time_counter*1000); time_counter++;
    // console.log(this.state);
    const eta_total = this.state.polypath[1].slice(-1)[0];
    for(let i=0;i<coords_to_travel.length-1;i++) {
      const distance = i===0 ? this.state.polypath[0][i] : this.state.polypath[0][i] - this.state.polypath[0][i-1];
      const time = i===0 ? 0 : this.state.polypath[1][i-1];
      let cal_dir = "straight";
      if(i!==0 && i!==coords_to_travel.length-2) {
        const angle = this.state.polypath[2][i];
        if (Math.abs(angle)<=30) {
          cal_dir = "straight";
        } else if(Math.abs(angle)<=45 && Math.abs(angle)>30) {
          if(angle<0) {
            cal_dir = "slight-left";
          } else {
            cal_dir = "slight-right";
          }
        } else {
          if(angle<0) {
            cal_dir = "left";
          } else {
            cal_dir = "right";
          }
        }
      }
      const dir = i===0 ? "straight" : cal_dir;
      const c = coords_to_travel[i], nc = coords_to_travel[i+1];
      const Slope = nc[0]===c[0] ? "infinity" : (nc[1]-c[1])/(nc[0]-c[0]);
      const Constant = Slope === "infinity" ? c[0] : nc[1]-(Slope*nc[0]);

      if(Slope==="infinity") {
        let loop_count = Math.abs((nc[1]-c[1])/bh);
        let it = 0;
        const direction_mag = c[1]>nc[1] ? -1 : 1;
        while(loop_count>=0) {
          loop_count--;
          time_counter++;
          const local_x = c[0];
          const local_y = c[1] + bh*it*direction_mag;
          it++;
          const ltc = time_counter;
          const local_eta = eta_total - time;
          setTimeout(() => {
            this.setState({eta: local_eta, dirToTurn: dir, distToTurn: distance, timeToTurn: time, gx: local_x, gy: local_y});
          },ltc * time_duration);
        }
      } else {
        let loop_count = Math.sqrt( Math.pow(nc[1]-c[1],2) + Math.pow(nc[0]-c[0],2)) / Math.sqrt(bh*bh+bw*bw);
        let it = 0;

        const dir_mag = nc[0]<c[0]?-1:1;

        while(loop_count>=0) {
          time_counter++;
          const local_x = c[0]+it*bw*dir_mag;
          const local_y=Slope*local_x+Constant;
          it++;
          const ltc = time_counter;
          const local_eta = eta_total - time;
          setTimeout(() => {
            this.setState({eta: local_eta, dirToTurn: dir, distToTurn: distance, timeToTurn: time, gx: local_x, gy: local_y});
          },ltc * time_duration);
          loop_count--;
        }
      }
    }

    if(this.state.levels.length) {
      setTimeout(() => {
        this.setState({eta: 0, dir: "straight", gx: coords_to_travel.slice(-1)[0][0],gy: coords_to_travel.slice(-1)[0][1], waitForLift: true});
      }, time_counter * time_duration);
    } else {
      setTimeout(() => {
        this.setState({eta: 0, dir: "straight", gx: coords_to_travel.slice(-1)[0][0],gy: coords_to_travel.slice(-1)[0][1],navigationComplete: true});
      }, time_counter * time_duration);
    }
  }

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

  renderDisplayCard () {
    if(!this.state.navigationComplete) {
      return(
          <MaterialCard style={{margin: 10}}>
            {/*<CardImage
                  source={{uri: 'http://placehold.it/480x270'}}
                  title={`Destination: ${this.state.dest}`}
              />*/}
            {/* TODO: provide real time EST Arrival, distance remaining, where the person is, direction moves*/}
            <CardTitle
                avatarSource={dir_icons[this.state.dirToTurn]}
                title={dir_msgs[this.state.dirToTurn] + `${Math.round(this.state.distToTurn)} metres`}
                subtitle={`You're in floor: ${this.state.current_floor}`}
                titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                subtitleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
            />
            <CardTitle
                avatarSource={{uri: 'data:image/png;base64,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'}}
                title={`Destination ${this.state.dest}`}
                subtitle="Building 1, Microsoft HYD Campus"
                titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                subtitleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
            />
            <CardTitle
                avatarSource={{uri: 'https://media-exp1.licdn.com/dms/image/C4E03AQF2EcMTz4LV4Q/profile-displayphoto-shrink_400_400/0?e=1599091200&v=beta&t=vZnzNH8REl3SJv8sq2hwhXq2R-fmfMz_tnEb7gGkctk'}}
                title="You're on your way to meet Zubin Sethna"
                subtitle="HR, India Head"
                titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                subtitleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
            />
            <CardContent textStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}} text="Your destination is 400 meters away and requires you to use the lift lobby" />
          </MaterialCard>
      );
    }
  }

  renderCompletionMessage () {
    if(this.state.navigationComplete) {
      return(
          <MaterialCard style={{margin: 10}}>
            <CardTitle
                avatarSource={{uri: 'https://cdn4.iconfinder.com/data/icons/map-pins-7/64/map_pin_pointer_location_navigation_confirm_save_complete-512.png'}}
                title={`Navigation Complete!`}
                subtitle={`Click on exit to return to home screen`}
                titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                subtitleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
            />
            <CardAction
                style={{backgroundColor: argonTheme.COLORS.Outlook_Light_blue}}
                separator={true}
                inColumn={false}>
              <CardButton
                  onPress={() => {
                    this.setState({
                      waitForLift: false,
                      polyline: null,
                      polypath: null,
                      current_floor: 16,
                      gx: 0,
                      validSrcId: true,
                      validDestId: true,
                      gy: 0,
                      eta: 0,
                      pathPenalty: 0,
                      levels: [],
                      navigationOn: false,
                      navigationComplete: false,
                      level_animation: false
                    });
                  }}
                  title="Exit"
                  titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                  color={argonTheme.COLORS.Outlook_User_red_dark}
              />
            </CardAction>
          </MaterialCard>
      );
    }
  }

  renderLiftMessage () {
    if(this.state.waitForLift) {
      return(
          <MaterialCard style={{margin: 10}}>
            <CardTitle
                avatarSource={{uri: 'https://images.vexels.com/media/users/3/156217/isolated/preview/43b08bbb96d1ef7a1e29fa934084928e-male-female-lift-icon-by-vexels.png'}}
                title={`Get into the Lift and go to floor ${this.state.levels[0]}`}
                subtitle={`Click on continue once you have arrived on floor ${this.state.levels[0]}`}
                titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                subtitleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
            />
            <CardAction
                style={{backgroundColor: argonTheme.COLORS.Outlook_Light_blue}}
                separator={true}
                inColumn={false}>
              <CardButton
                  onPress={() => {this.setState({waitForLift: false, polyline: null, level_animation: false, eta: 0, current_floor: this.state.levels[0]})}}
                  title="Continue"
                  color={argonTheme.COLORS.Outlook_User_red_dark}
                  titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
              />
            </CardAction>
          </MaterialCard>
      );
    }
  }

  generatePolylines () {
    if(this.state.levels.length===2) {
      const lc_levels = this.state.levels;
      const pathDetails = getShortestPath(this.state.src,`${lc_levels[0]}.LIFT`,lc_levels[0],bh,bw,mapHeight,this.state.pathPenalty);
      this.setState({
        current_floor: lc_levels[0],
        levels: [lc_levels[1]],
        polyline: pathDetails[0],
        polypath: getPathInfo(pathDetails[1])
      });
      // setTimeout(() => {
      //   this.setState({polyline: getShortestPath(`${lc_levels[1]}.LIFT`,this.state.dest,lc_levels[1],bh,bw,mapHeight)});
      // }, 5000);
    } else if(this.state.levels.length===1) {
      const lc_levels = this.state.levels;
      if(+(this.state.src.split(".")[0])===+(this.state.dest.split(".")[0])) {
        const pathDetails = getShortestPath(this.state.src,this.state.dest,lc_levels[0],bh,bw,mapHeight,this.state.pathPenalty);
        this.setState({
          current_floor: lc_levels[0],
          levels: [],
          polyline: pathDetails[0],
          polypath: getPathInfo(pathDetails[1])
        });
      } else {
        const pathDetails = getShortestPath(`${lc_levels[0]}.LIFT`,this.state.dest,lc_levels[0],bh,bw,mapHeight,this.state.pathPenalty);
        this.setState({
          current_floor: lc_levels[0],
          levels: [],
          polyline: pathDetails[0],
          polypath: getPathInfo(pathDetails[1])
        });
      }
    }
  }

  show_cursor() {
    if(this.state.level_animation && this.state.gx && this.state.gy) {
      return(<Circle x={this.state.gx} y={this.state.gy} opacity={1} fill={argonTheme.COLORS.Outlook_User_red_dark} r={5}/>);
    }
  }

  show_ETA() {
    if(this.state.eta) {
      const decimal = this.state.eta - Math.floor(this.state.eta);
      const secString = `${Math.round(decimal*60)} s`;
      return(
          <TextSvg
              fill={argonTheme.COLORS.Outlook_User_red_dark}
              stroke={argonTheme.COLORS.Outlook_User_red_dark}
              fontSize="14"
              fontFamily={argonTheme.FONTS.Outlook_Font}
              fontWeight="bold"
              x={mapWidth-80}
              y={mapHeight-20}
              textAnchor="middle"
          >
            {`ETA: ${Math.round(this.state.eta)} mins ${secString}`}
          </TextSvg>
      );
    }
  }

  showNavBtn () {
    if(this.state.validSrcId && this.state.validDestId && this.state.idEntrySrc && this.state.idEntryDest) {
      return(
          <CardAction
              separator={true}
              inColumn={false}>
            <CardButton
                onPress={() => {this.beginNavigation()}}
                title="Start Navigation"
                titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                color={argonTheme.COLORS.Outlook_Dark_theme}
            />
          </CardAction>
      )
    } else {
      return(
          <CardAction
              separator={true}
              inColumn={false}>
            <CardButton
                onPress={() => {}}
                title=""
                titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                color={argonTheme.COLORS.Outlook_Dark_theme}
            />
          </CardAction>)
    }
  }

  render() {
    if(!this.state.navigationOn) {
      return(
          <View style={{flex: 1, display: 'flex', backgroundColor: argonTheme.COLORS.INPUT, justifyContent: 'center', flexDirection: 'column'}}>
            {/*<Card
                title='MS Move-About'>
              <Text style={{marginBottom: 10}}>
                Please enter your current location and the location where you wish to go to :)
              </Text>
              <Input
                  key="src-id"
                  onChangeText={(text) => {this.setState({src: text})}}
                  placeholder='current location'
                  leftIcon={{ type: 'font-awesome', name: 'map-marker', color: argonTheme.COLORS.ACTIVE }}
              />
              <Input
                  key="dest-id"
                  onChangeText={(text) => {this.setState({dest: text})}}
                  placeholder='destination'
                  leftIcon={{ type: 'font-awesome', name: 'map-marker', color: argonTheme.COLORS.LABEL}}
              />
              <Button
                  icon={<Icon type='font-awesome' name='location-arrow' style={{marginRight: 5}} color='#ffffff' />}
                  buttonStyle={{backgroundColor: argonTheme.COLORS.MS_ORANGE, borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                  onPress={() => {this.beginNavigation()}}
                  title='Start Navigation' />
            </Card>*/}
            <ScrollView>
              <MaterialCard>
                <CardImage style={{height: height/4}} textStyle={{fontFamily: 'roboto-medium'}} title="Move - About" source={{ uri: 'https://www.gamespace.com/wp-content/uploads/2018/02/Microsoft_Logo_Black11.jpg' }} />
                <CardTitle
                    avatarSource = {{uri: "https://media-exp1.licdn.com/dms/image/C5603AQH6eF7rO3IpsQ/profile-displayphoto-shrink_400_400/0?e=1599696000&v=beta&t=g0dkGzx5yySX8FWXs0prgJTdaYzIMBOkbASJi4bRFkU"}}
                    title={`Soumya Mohapatra`}
                    titleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                    subtitle = {`empId: 8349202, room: ${default_room}`}
                    subtitleStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                />
                <CardContent textStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}} text="Welcome Soumya Mohapatra, please enter your current location and destination." />
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                  <CheckBox
                      value={this.state.selectCurrentLocation}
                      onValueChange={() => {
                        if(!this.state.selectCurrentLocation) {
                          this.setState({selectCurrentLocation: !this.state.selectCurrentLocation, src: default_room, idEntrySrc: true, validSrcId: true});
                        } else {
                          this.setState({selectCurrentLocation: !this.state.selectCurrentLocation, src: "", idEntrySrc: false, validSrcId: false})
                        }
                      }}
                  />
                  <Text style={{lineHeight: 26, fontFamily: argonTheme.FONTS.Outlook_Font, color: argonTheme.COLORS.Outlook_Primary_theme}}>
                    Navigate from current location
                  </Text>
                </View>
                <Input
                    key="src-id"
                    onChangeText={(text) => {this.setState({src: text, idEntrySrc: true, validSrcId: isValidRoomId(text)})}}
                    errorMessage={this.state.validSrcId ? "" : "no room exists"}
                    errorStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                    inputStyle={{fontSize: 15, fontFamily: argonTheme.FONTS.Outlook_Font}}
                    placeholder='Current Location'
                    value={this.state.src}
                    leftIcon={{ type: 'font-awesome', name: 'map-marker', color: argonTheme.COLORS.Outlook_Dark_theme }}
                />
                <Input
                    key="dest-id"
                    onChangeText={(text) => {this.setState({dest: text, idEntryDest: true, validDestId: isValidRoomId(text)})}}
                    errorMessage={this.state.validDestId ? "" : "no room exists"}
                    errorStyle={{fontFamily: argonTheme.FONTS.Outlook_Font}}
                    placeholder='Destination'
                    value={this.state.dest}
                    inputStyle={{fontSize: 15, fontFamily: argonTheme.FONTS.Outlook_Font}}
                    leftIcon={{ type: 'font-awesome', name: 'map-marker', color: argonTheme.COLORS.Outlook_User_red_dark}}
                />
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                  <CheckBox
                      value={this.state.pathPenalty===1}
                      onValueChange={() => {this.setState({pathPenalty: (this.state.pathPenalty+1)%2})}}
                  />
                  <Text style={{lineHeight: 26, fontFamily: argonTheme.FONTS.Outlook_Font, color: argonTheme.COLORS.Outlook_User_red_dark}}>
                    Prefer the path with the least number of turns
                  </Text>
                </View>
                {this.showNavBtn()}
              </MaterialCard>
            </ScrollView>
          </View>
      );
    }

    if(this.state.polyline===null) {
      setTimeout(() => {this.generatePolylines();}, 3000);
      return(
          <Block style={{flex: 1, backgroundColor: argonTheme.COLORS.INPUT, justifyContent: 'center', flexDirection: 'column'}}>
            <View style={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
              <Pulse size={50} color={argonTheme.COLORS.Outlook_User_red_dark} />
            </View>
          </Block>
      );
    }

    if(!this.state.level_animation) {
      console.log("move tracker initialized!")
      this.move_tracker();
    }

    return (
        <ScrollView>
          <View style={{ overflow: "scroll", alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground resizeMode="contain" source={floor_bgs[this.state.current_floor]} style={[styles.image, {opacity: 1}]}>
              <Svg height={mapHeight} width={mapWidth}>
                <TextSvg
                    fill={argonTheme.COLORS.Outlook_Primary_theme}
                    stroke={argonTheme.COLORS.Outlook_Primary_theme}
                    fontSize="14"
                    fontFamily={argonTheme.FONTS.Outlook_Font}
                    fontWeight="bold"
                    x="40"
                    y="40"
                    textAnchor="middle"
                >
                  FL-{this.state.current_floor}
                </TextSvg>
                {/*<Line
                    x1={floorPlansJson[this.state.current_floor].red_nodes[this.state.src]@.coords[0]*bw}
                    y1={mapHeight - floorPlansJson[this.state.current_floor].red_nodes[this.state.src].coords[1]*bh}
                    x2={floorPlansJson[this.state.current_floor].blue_nodes[this.state.src.split(".").slice(0,2).join(".")].coords[0]*bw}
                    y2={mapHeight - floorPlansJson[this.state.current_floor].blue_nodes[this.state.src.split(".").slice(0,2).join(".")].coords[1]*bh}
                    stroke="red" strokeWidth="3" opacity={0.5} />*/}
                <Polyline
                    points={this.state.polyline}
                    stroke={argonTheme.COLORS.Outlook_Primary_theme}
                    opacity={0.7}
                    fill="transparent"
                    strokeWidth="5"
                />
                {this.show_cursor()}
                {this.show_ETA()}
              </Svg>
            </ImageBackground>
          </View>
          <View>
            {this.renderLiftMessage()}
            {this.renderCompletionMessage()}
            {this.renderDisplayCard()}
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
