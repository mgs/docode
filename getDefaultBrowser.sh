#!/bin/bash
_TMP_DEFAULT_BROWSER=~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist;

plutil -convert xml1 $_TMP_DEFAULT_BROWSER;
DEFAULT_BROWSER=`grep 'https' -b3 $_TMP_DEFAULT_BROWSER | awk 'NR==2 {split($2, arr, "[><]"); print arr[3]}'`;
#DEFAULT_BROWSER=`plutil -convert binary1 $_TMP_DEFAULT_BROWSER`
[[ $DEFAULT_BROWSER == "com.apple.safari" ]] && echo "Safari";
[[ $DEFAULT_BROWSER == "com.mozilla.firefox" ]] && echo "Firefox";
[[ $DEFAULT_BROWSER == "com.google.chrome" ]] && echo "Google Chrome";
