# Microsoft Move About 

<img height="150" width="200" src="https://cdn.vox-cdn.com/thumbor/NeSo4JAqv-fFJCIhb5K5eBqvXG4=/7x0:633x417/1200x800/filters:focal(7x0:633x417)/cdn.vox-cdn.com/assets/1311169/mslogo.jpg">

## Overview
`Microsoft Move About` is an android application which allows employees to navigate within the premises of a Microsoft Campus. It gives you the shortest path to reach the destination within the campus. Yeah, you're right :joy:! This is bascially a Goole Maps version for intra-building navigation. 

### Get Started
1) Download the `.apk` file from [expo](https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40himansih-star/ms-move-about-e236c49fe60945d38aa8c9e8502f41d1-signed.apk) and read the [user manual](#1-android-app-usage-instructions).
2) To sync your app with your `Teams` account, follow the steps of installation for [Microsoft Teams Bot](#2-chrome-extension---microsoft-teams-bot).

## 1) Android App: Usage Instructions
 - ### Enter Source Room Id
    Enter the `source id` of the location from where you wish to navigate. You can select the checkbox if you wish to navigate from your default location. To check the available `room/path codes` visit [floor layout](https://himanish-star.github.io/ms-move-about/floor_plans/floor_16/floor.png)
    
    <img height="400" width="200" src="https://github.com/himanish-star/ms-move-about/raw/master/docs/images/ms-move-about-pics/WhatsApp%20Image%202020-07-12%20at%207.57.24%20AM%20(2).jpeg"></img>
    
 - ### Enter Destination Room Id
    Enter the id of the location where you wish to navigate to. To check the available `room/path codes` visit [floor layout](https://himanish-star.github.io/ms-move-about/floor_plans/floor_16/floor.png)
    
     <img height="400" width="200" src="https://github.com/himanish-star/ms-move-about/raw/master/docs/images/ms-move-about-pics/WhatsApp%20Image%202020-07-12%20at%207.57.24%20AM%20(1).jpeg"></img>
    
 - ### Choose the path with the least turns (optional)
    This is usually preferrable for people on the `wheel-chair`. This path doesn't guarantee the shortest path but yes it does guarantee the path with the least turns.
    
 - ### Begin Navigation
    The navigation button will be visible only after the input of **valid** source and destination ids.
     
      <img src="https://github.com/himanish-star/ms-move-about/raw/master/docs/images/ms-move-about-pics/WhatsApp%20Image%202020-07-12%20at%207.57.24%20AM%20(4).jpeg" height="400" width="200"></img>
    
    <img src="https://github.com/himanish-star/ms-move-about/raw/master/docs/images/ms-move-about-pics/WhatsApp%20Image%202020-07-12%20at%207.57.24%20AM%20(5).jpeg" height="400" width="200"></img>
    
    <img src="https://github.com/himanish-star/ms-move-about/raw/master/docs/images/ms-move-about-pics/WhatsApp%20Image%202020-07-12%20at%207.57.24%20AM%20(6).jpeg" height="400" width="200"></img>
 
## 2) Chrome Extension - Microsoft Teams Bot
   Usually, Employees send their location or table id via chat streams on Microsoft Teams. To ease their task, this Chrome extension will work as a Bot that will send notifications on their mobile device with the destination table id, clicking on which will auto fill all the details required for navigation. 

 - ### Add this Teams extension to your Chrome browser
     First, enable this extension by adding it to your Chrome browser.

 - ### Triggering Bot with Special Command
     To send a request to your co-worker, you need to send this special command to trigger the bot to send him notification on his mobile device. 
           `/route yourTableId`

     For example: 
         ```
          /route 17.3F.1
         ```
     
     ![teams-bot-image](https://github.com/himanish-star/ms-move-about/raw/master/docs/images/ms-move-about-pics/Screenshot%20from%202020-07-12%2007-50-48.png)

 - ### Explicitly sending notification to your own device
     To explicitly send the notification with the destination id to your own device, you can simply click the extension, then click the start button to auto fill navigation details on your mobile application. This will get the destination table id from the latest message of format `/route tableId` and send a notification to MS-Move-About application.

     <img src="https://github.com/himanish-star/ms-move-about/raw/master/docs/images/ms-move-about-pics/WhatsApp%20Image%202020-07-12%20at%207.57.24%20AM.jpeg" height="400" width="200"></img>

## 3) Floor Marker - Online Tool (Note: developers-only)
  - ### Mark new rooms and their coordinates
      - `MS Floor Marker` is an [online tool](https://himanish-star.github.io/ms-move-about/) which allows developers to mark new rooms on the floor.
      - To place markers, click on the desired location in the canvas to register its coordinates.
         <img height="400" width="800" src="https://github.com/himanish-star/ms-move-about/raw/master/docs/images/ms-move-about-pics/Screenshot%20from%202020-07-12%2010-09-52.png">
      - Fill up the popup box with the `string id` of the marker.
         <img height="400" width="800" src="https://github.com/himanish-star/ms-move-about/raw/master/docs/images/ms-move-about-pics/Screenshot%20from%202020-07-12%2010-06-31.png">
      - On completion, click on the `save json` button to save the json file of the markers.

#### Checklist
- [x] checkbox for direction penalty
- [x] checkbox for current location as default user location from profile
- [x] route time
- [x] cumulative time and distance display 
- [ ] 3D icons
- [x] web-marker website
