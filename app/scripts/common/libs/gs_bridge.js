var CtripGS = {};

CtripGS.app_hide_bottom_menu = function() {
    var jsonObj = {};
    jsonObj.service = "Destination";
    jsonObj.action = "hideBottomMenu";

    var paramString = JSON.stringify(jsonObj);
    if (Internal.isIOS || Internal.isOldVersion) {
        url = Internal.makeURLWithParam(paramString, Internal.isYouthApp?'ctripyouth':'ctrip'+'://h5/destination/hidebottommenu');
        Internal.loadURL(url);		
    }
    else if(Internal.isAndroid) {
        window.CtripGS_a.hideBottomMenu("");
    }

};

CtripGS.app_show_bottom_menu = function() {
    var jsonObj = {};
    jsonObj.service = "Destination";
    jsonObj.action = "showBottomMenu";

    var paramString = JSON.stringify(jsonObj);
    if (Internal.isIOS || Internal.isOldVersion) {
        url = Internal.makeURLWithParam(paramString, Internal.isYouthApp?'ctripyouth':'ctrip'+'://h5/destination/showbottommenu');
        Internal.loadURL(url);		
    }
    else if (Internal.isAndroid) {
        window.CtripGS_a.showBottomMenu("");
    }

};

CtripGS.share = function(JSONString) {
    if (Internal.isNotEmptyString(JSONString)) {
        jsonObj = JSON.parse(JSONString);
        jsonObj.service = "Destination";
        jsonObj.action = "share";

        paramString = JSON.stringify(jsonObj);
        if (Internal.isIOS || Internal.isOldVersion) {
            url = Internal.makeURLWithParam(paramString, Internal.isYouthApp?'ctripyouth':'ctrip'+'://h5/destination/share');
            Internal.loadURL(url);

        }
        else if (Internal.isAndroid) {
            window.CtripGS_a.share(paramString);
        }
    }
};

CtripGS.shareCommon = function(JSONString) {
    if (Internal.isNotEmptyString(JSONString)) {
        jsonObj = JSON.parse(JSONString);
        jsonObj.service = "Destination";
        jsonObj.action = "shareCommon";

        paramString = JSON.stringify(jsonObj);
        if (Internal.isIOS || Internal.isOldVersion) {
            url = Internal.makeURLWithParam(paramString);
            Internal.loadURL(url);

        }
        else if (Internal.isAndroid) {
            window.CtripGS_a.shareCommon(paramString);
        }
    }
};
