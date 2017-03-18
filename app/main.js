import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "chatbar": {
        "position": "fixed",
        "backgroundColor": "white",
        "borderLeft": "1px solid gray",
        "borderRight": "1px solid gray",
        "height": 100 * vh,
        "right": 0,
        "top": 66,
        "paddingLeft": 20,
        "paddingTop": 10,
        "width": "17%",
        "display": "inline"
    },
    "chatShow": {
        "position": "absolute",
        "zIndex": 1,
        "right": 260,
        "bottom": 100,
        "height": 360,
        "width": 600,
        "display": "none"
    },
    "chatbar-user": {
        "paddingBottom": 10,
        "height": "80%"
    },
    "chatbar-search": {
        "borderTop": "1px solid #aaa9a9",
        "paddingTop": 20,
        "width": "92%"
    },
    "userList": {
        "width": "100%",
        "paddingBottom": 10
    },
    "avatar": {
        "width": 30,
        "height": 30
    },
    "chat-item-form": {
        "marginLeft": 10
    },
    "chatButton": {
        "border": "none",
        "backgroundColor": "white"
    },
    "chatNotificate": {
        "bottom": 7,
        "width": 20,
        "height": 20,
        "textAlign": "center",
        "borderRadius": "15%",
        "color": "white",
        "backgroundColor": "red"
    },
    "button:active": {
        "border": "none"
    },
    "chatItem": {
        "paddingBottom": 50,
        "backgroundColor": "white"
    },
    "chatRoom": {
        "borderRadius": 5,
        "float": "right",
        "paddingRight": 10,
        "Right": 260,
        "width": 300
    },
    "chatImage": {
        "height": 30,
        "width": 30,
        "borderRadius": "20%"
    },
    "chat-heading": {
        "height": 40
    },
    "td-message": {
        "wordBreak": "break-all",
        "width": "80%"
    },
    "message-left": {
        "float": "left",
        "marginLeft": 10,
        "fontSize": 17,
        "fontWeight": "100",
        "backgroundColor": "#2f9ce2",
        "color": "white",
        "paddingTop": 5,
        "paddingRight": 5,
        "paddingBottom": 5,
        "paddingLeft": 5,
        "WebkitBorderRadius": 7,
        "MozBorderRadius": 7,
        "borderRadius": 7,
        "maxWidth": 170
    },
    "message-right": {
        "float": "right",
        "marginRight": 10,
        "fontSize": 17,
        "fontWeight": "100",
        "backgroundColor": "#2f9ce2",
        "color": "white",
        "paddingTop": 5,
        "paddingRight": 5,
        "paddingBottom": 5,
        "paddingLeft": 5,
        "WebkitBorderRadius": 7,
        "MozBorderRadius": 7,
        "borderRadius": 7,
        "maxWidth": 170
    },
    "messageDate": {
        "fontSize": 11
    },
    "chat-footer": {
        "height": 55
    },
    "chat-body": {
        "height": 280,
        "overflow": "scroll",
        "overflowX": "hidden",
        "width": "99%"
    },
    "td-room-name": {
        "width": 200,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "p-room-name": {
        "marginTop": -5
    },
    "td-room-closing": {
        "width": 60
    },
    "button-chat-closing": {
        "backgroundColor": "inherit",
        "marginTop": -15,
        "float": "right",
        "border": "none"
    },
    "button-chat-send": {
        "float": "right",
        "width": 38,
        "height": 38,
        "border": "none",
        "textAlign": "center",
        "verticalAlign": "middle",
        "backgroundColor": "inherit"
    },
    "input-chat": {
        "height": 36,
        "color": "white",
        "width": 200,
        "marginLeft": 5,
        "heigth": 48,
        "WebkitBorderRadius": 3,
        "MozBorderRadius": 3,
        "borderRadius": 3,
        "borderColor": "white",
        "backgroundColor": "inherit"
    },
    "navbar-inverse": {
        "backgroundImage": "url(\"http://www.whitetablegallery.org/src/share/default.jpg\")"
    },
    "navbar-default": {
        "backgroundColor": "blue",
        "border": "1px solid yellow"
    },
    "ul": {
        "display": "inline"
    },
    "li": {
        "display": "inline"
    },
    "form-control": {
        "width": "40%",
        "marginBottom": 20
    },
    "loader": {
        "border": "5px solid #f3f3f3",
        "borderTop": "5px solid green",
        "borderRadius": "50%",
        "width": 30,
        "height": 30,
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto",
        "animation": "spin 2s linear infinite"
    },
    "extraTextContent": {
        "marginLeft": 10
    },
    "DraftEditor-editorContainer": {
        "width": "inherit",
        "height": "inherit",
        "backgroundcolor": "blue",
        "border": "1px solid gray"
    },
    "controls-list": {
        "display": "inline"
    },
    "align-right": {
        "textAlign": "right"
    },
    "align-center": {
        "textAlign": "center"
    },
    "align-left": {
        "textAlign": "left"
    },
    "modal-content": {
        "height": "100%"
    },
    "custom-modal": {
        "width": 1000,
        "height": 550
    },
    "fullsize-modal": {
        "width": "100%",
        "height": "100%"
    },
    "background-modal": {
        "width": 550,
        "marginTop": 100
    },
    "documentSet": {
        "height": "60%",
        "overflow": "scroll",
        "overflowX": "hidden",
        "marginBottom": 20
    },
    "searchTool": {
        "position": "fixed",
        "zIndex": 3,
        "width": "76%",
        "backgroundColor": "white"
    },
    "searchItem:hover": {
        "backgroundColor": "green"
    },
    "chip": {
        "display": "inline-block",
        "paddingTop": 0,
        "paddingRight": 10,
        "paddingBottom": 0,
        "paddingLeft": 10,
        "height": 40,
        "fontSize": 16,
        "lineHeight": 40,
        "borderRadius": 25,
        "backgroundColor": "#f1f1f1",
        "marginTop": 20
    },
    "chip img": {
        "float": "left",
        "marginTop": 0,
        "marginRight": 5,
        "marginBottom": 0,
        "marginLeft": -26,
        "height": 40,
        "width": 40,
        "borderRadius": "50%"
    },
    "chip p": {
        "wordBreak": "keep-all"
    },
    "chip marquee": {},
    "closebtn": {
        "paddingLeft": 10,
        "color": "#888",
        "fontWeight": "bold",
        "float": "right",
        "fontSize": 20,
        "cursor": "pointer"
    },
    "closebtn:hover": {
        "color": "#000"
    }
});