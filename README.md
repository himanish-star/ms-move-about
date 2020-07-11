# Microsoft Move About 

<img height="150" width="200" src="https://cdn.vox-cdn.com/thumbor/NeSo4JAqv-fFJCIhb5K5eBqvXG4=/7x0:633x417/1200x800/filters:focal(7x0:633x417)/cdn.vox-cdn.com/assets/1311169/mslogo.jpg">

## Overview
Microsoft Move About is an android application which allows employees to navigate within a Microsoft Office. It gives you the shortest path to reach the destination within the organization. Yeah, you're right :joy:! This is bascially a Goole Maps version for intra-building navigation. 

### Get Started
1) Download the `.apk` file from [expo](https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40himansih-star/ms-move-about-e236c49fe60945d38aa8c9e8502f41d1-signed.apk) and read the [user manual](1-android-app-usage-instructions).
2) To sync your app with your `Teams` account, follow the steps of installation for [Microsoft Teams Bot](2-chrome-extension---microsoft-teams-bot).

## 1) Android App: Usage Instructions
 - ### Enter Source Room Id
    Enter the source id of the location from where you wish to navigate. You can select the checkbox if you wish to navigate from your default location. To check the available room/path codes visit [floor layout](https://himanish-star.github.io/ms-move-about/floor_plans/floor_16/floor.png)
    
 - ### Enter Destination Room Id
    Enter the id of the location where you wish to navigate to. To check the available room/path codes visit [floor layout](https://himanish-star.github.io/ms-move-about/floor_plans/floor_16/floor.png)
    
 - ### Choose the path with the least turns (optional)
    This is usually preferrable for people on the wheel-chair. This path doesn't guarantee the shortest path but yes it does guarantee the path with the least turns.
    
 - ### Begin Navigation
    The navigation button will be visible only after the input of valid source and destination ids.
 
## 2) Chrome Extension - Microsoft Teams Bot

## 3) Floor Marker - Online Tool (Note: developers-only)

#### Checklist
- [x] checkbox for direction penalty
- [x] checkbox for current location as default user location from profile
- [x] route time
- [x] cumulative time and distance display 
- [ ] 3D icons
- [x] web-marker website
