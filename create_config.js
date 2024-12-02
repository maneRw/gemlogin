const { randomInt } = require('crypto');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
var parser = require('ua-parser-js');
const { encodeString } = require('./encode');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { response } = require('express');
module.exports.creatConfig = async function (data, pathSave, idProfile) {

  if (!data.location.use_ip) {
    data.location.type = "default";
    data.location.lat = "default";
    data.location.long = "default";
  }

  data.location.accuracy = randomInt(60, 100);

  if (data.time_zone.use_ip) {
    data.time_zone = "default";
  };

  if (data.language.use_ip) {
    data.language.value = 'en,en-us';
  };

  data.ip = "default";
  try {
    const response = await fetch("https://jsonip.com/");
    let result = await response.json();
    data.ip = result.ip;
  }
  catch (err) {
    console.log(err)
  }
  let ip = "";
  data.proxy_user = 'default';
  data.proxy_pass = 'default';

  if (data.proxy.type != "not_use") {
    let proxy = data.proxy;
    let url = '';
    if (proxy?.host && proxy?.port) {
      url = `${proxy.type}://${proxy.host}:${proxy.port} `
    }
    if (proxy.user_name?.length && proxy.password?.length) {
      data.proxy_user = proxy.user_name;
      data.proxy_pass = proxy.password;
      url = `${proxy.type}://${proxy.user_name}:${proxy.password}@${proxy.host}:${proxy.port} `
    }
    try {
      if (proxy.type == "https".toLowerCase() || proxy.type == "http".toLowerCase()) {
        const response = await fetch("https://jsonip.com/", { agent: new HttpsProxyAgent(url) });
        let result = await response.json();
        ip = result.ip;
      }
      else {
        const response = await fetch("https://jsonip.com/", { agent: new SocksProxyAgent(url) });
        let result = await response.json();
        ip = result.ip;
      }

    }
    catch (err) {
      console.log(err)
    }
    data.web_rtc = 'noise';
    console.log(ip)
  }

  if (data.web_rtc == "default") {
    data.local_ip_public = "default";
    data.ipv4 = "default";
    data.ipv6 = "default";
  }
  else {
    data.local_ip_public = `192.${randomInt(100, 169)}.${randomInt(0, 100)}.${0, 200}`;// data.info.ip;
    data.ipv4 = ip.indexOf('.') > -1 ? ip : 'default';
    data.ipv6 = ip.indexOf(':') > -1 ? ip : 'default';
  }
  const pathKey = `${pathSave}\\profiles\\${idProfile}\\key.txt`;
  writeFileSyncRecursive(pathKey, "xlzAsakHuPnK", 'utf8');
  pathSave = `${pathSave}\\profiles\\${idProfile}\\Data.mins`;
  let screen_resolution = data.screen_resolution.type === "option" ? data.screen_resolution.value : randomScreenResolution(data.os.type)
  //if(!fs.existsSync(pathSave))fs.;
  let userAgent = parser(data.user_agent);
  data.vesion_useragent = userAgent.engine.version;
  data.architecture = userAgent.cpu.architecture;
  data.platform_version = userAgent.os.version;
  if (data.platform_version == 10) {
    data.platform_version = "10.0.0"
  }
  if (data.platform_version == 11) {
    data.platform_version = "14.0.0"
  }

  data.paltform_os = userAgent.os.name;
  if (data.paltform_os == "Windows") {
    data.architecture = "x86";
  }
  else {
    data.architecture = "amd";
  }
  let screen = screen_resolution.split('x');
  data.width = screen[0];
  data.height = screen[1];
  let config = encodeString(convertConfig(data), "xlzAsakHuPnK");
  //let config =convertConfig(data);

  writeFileSyncRecursive(pathSave, config, 'utf8');

}
function convertConfig(data) {

  const fonts = [
    "Roboto", "Arial", "Courier", "Courier New", "Georgia", "Helvetica", "Tahoma",
    "Times", "Times New Roman", "Verdana", "MWF-MDL2", "Google Symbols",
    "Arial Black", "Arial Narrow", "Microsoft Sans Serif", "Trebuchet MS", "Wingdings",
    "Webdings", "Symbol", "Wingdings 2", "Wingdings 3", "Brush Script MT",
    "Trebuchet MS Bold Italic", "Georgia Bold", "Verdana Italic", "Verdana Bold Italic",
    "Times New Roman Bold Italic", "Arial Italic", "Trebuchet MS Bold",
    "Times New Roman Bold", "Times New Roman Italic", "Courier New Bold",
    "Arial Bold", "Georgia Bold Italic", "Comic Sans MS Bold", "Trebuchet MS Italic",
    "Courier New Bold Italic", "Arial Bold Italic", "Verdana Bold", "Georgia Italic",
    "Courier New Italic", "Tahoma Bold", "Papyrus Condensed", "Helvetica Neue",
    "SimSun", "Microsoft JhengHei", "NSimSun", "Franklin Gothic Medium",
    "Franklin Gothic Medium Italic", "MT Extra", "Garamond", "Elephant",
    "Calibri", "Cambria", "Cambria Math", "Consolas", "Lucida Sans Unicode",
    "MS Gothic", "Palatino Linotype", "Segoe Script", "Segoe UI", "Segoe UI Light",
    "Segoe UI Semibold", "Segoe UI Symbol", "Candara", "Constantia", "Corbel",
    "Ebrima", "Gabriola", "Malgun Gothic", "Marlett", "Microsoft Himalaya",
    "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
    "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB",
    "Mongolian Baiti", "MS UI Gothic", "MV Boli", "PMingLiU-ExtB", "SimSun-ExtB",
    "Sylfaen", "Cambria Italic", "Corbel Bold Italic", "Cambria Bold Italic",
    "Sitka Banner", "Cambria Bold", "Microsoft JhengHei Light", "Candara Italic",
    "Javanese Text", "Palatino Linotype Bold", "Segoe UI Emoji", "Leelawadee UI",
    "Yu Gothic UI Light", "Constantia Bold", "Sitka Small", "Sitka Text",
    "Nirmala UI", "Calibri Italic", "Corbel Bold", "Myanmar Text", "Segoe UI Semilight",
    "Sitka Display", "Consolas Bold Italic", "Sitka Heading", "Segoe UI Historic",
    "Microsoft YaHei UI Light", "Malgun Gothic Semilight", "Microsoft YaHei UI",
    "Corbel Italic", "Microsoft JhengHei UI", "Yu Gothic UI Semilight",
    "Segoe MDL2 Assets", "Yu Gothic Light", "Nirmala UI Semilight", "Consolas Italic",
    "Yu Gothic Medium", "Consolas Bold", "Candara Bold Italic", "Constantia Bold Italic",
    "Microsoft JhengHei UI Light", "Gadugi", "Calibri Light", "Microsoft Tai Le Bold",
    "Constantia Italic", "Sitka Subheading", "Leelawadee UI Semilight",
    "Palatino Linotype Bold Italic", "Segoe UI Black", "Candara Bold",
    "Palatino Linotype Italic", "Yu Gothic UI Semibold", "Calibri Bold Italic",
    "Calibri Bold", "Bahnschrift", "Bahnschrift SemiBold", "Calibri Light Italic",
    "Candara Light", "Candara Light Italic", "Comic Sans MS Bold Italic",
    "Comic Sans MS Italic", "Corbel Light", "Corbel Light Italic", "Gadugi Bold",
    "HoloLens MDL2 Assets", "Ink Free", "Leelawadee UI Bold", "Malgun Gothic Bold",
    "Microsoft JhengHei Bold", "Microsoft JhengHei UI Bold", "Microsoft PhagsPa Bold",
    "Microsoft YaHei Bold", "Microsoft YaHei UI Bold", "Myanmar Text Bold",
    "Nirmala UI Bold", "Segoe Print Bold", "Segoe Script Bold", "Segoe UI Black Italic",
    "Segoe UI Bold Italic", "Segoe UI Light Italic", "Segoe UI Semibold Italic",
    "Segoe UI Semilight Italic", "Sitka Banner Bold", "Sitka Banner Bold Italic",
    "Sitka Banner Italic", "Sitka Display Bold", "Sitka Display Bold Italic",
    "Sitka Display Italic", "Sitka Heading Bold", "Sitka Heading Bold Italic",
    "Sitka Heading Italic", "Sitka Small Bold", "Sitka Small Bold Italic",
    "Sitka Small Italic", "Sitka Subheading Bold", "Sitka Subheading Italic",
    "Sitka Text Bold", "Sitka Text Bold Italic", "Sitka Text Italic", "Yu Gothic Bold",
    "Yu Gothic Regular", "Yu Gothic UI Bold", "Yu Gothic UI Regular", "MS Sans Serif",
    "MS Serif", "Century Gothic", "Book Antiqua", "Bookman Old Style", "Century",
    "Century Schoolbook", "Lucida Bright", "Lucida Fax", "Monotype Corsiva",
    "MS Outlook", "MS Reference Sans Serif", "Agency FB", "Algerian", "Bauhaus 93",
    "Bodoni MT", "Bodoni MT Black", "Bookshelf Symbol 7", "Colonna MT", "Cooper Black",
    "Forte", "Imprint MT Shadow", "Maiandra GD", "MS Reference Specialty",
    "Tw Cen MT", "Lucida Calligraphy", "Lucida Handwriting", "Magneto",
    "Material Icons", "ui-icons", "FluentSystemIcons", "controlIcons",
    "Google Material Icons", "Material Icons Extended", "MWF-FLUENT-ICONS",
    "Segoe UI Web (West European)", "-apple-system", "BlinkMacSystemFont",
    "sans-serif", "monospace", "PPUI-Icons", "Font Awesome", "Font Awesome 5 Free",
    "Material Icons Outlined", "Nunito Sans", "Shifter", "Work Sans", "inherit"
  ]

  function getRandomFonts(fonts, minCount) {
    const uniqueFonts = new Set();
    while (uniqueFonts.size < minCount) {
      uniqueFonts.add(fonts[Math.floor(Math.random() * fonts.length)]);
    }
    return Array.from(uniqueFonts);
  }

  return config =
    `mins-useragent-useragent=${data.user_agent}
mins-useragent-version_useragent=${data.vesion_useragent}
mins-useragent-platforms=Win32
mins-useragent-fullversion=${data.vesion_useragent}
mins-useragent-architecture=${data.architecture}
mins-useragent-model=default
mins-useragent-bitness=64
mins-useragent-wow64=false
mins-navigator-platform_os=${data.paltform_os}
mins-navigator-platforms_version=${data.platform_version}
mins-navigator-client_rects-mode=default
mins-navigator-client_rects-value=${(Math.random() / 1000).toFixed(6)}
mins-navigator-is_mobile=false
mins-navigator-hardware_concurrency=${data.cpu.value}
mins-navigator-product=Gecko
mins-navigator-product_name=Google Chrome
mins-navigator-product_sub=20030107
mins-navigator-device_memory=4
mins-navigator-pixel_ratio=1
mins-navigator-max_touch_point=0
mins-screen-width=default
mins-screen-height=default
mins-screen-color_depth=1440
mins-screen-pixel_depth=900
mins-timezone=${data.time_zone}
mins-port_protect=3389,5900,5800,7070,6568,5938
mins-bluetooth=off
mins-languages=${data.language.value}
mins-webgl-mode=${data.webgl}
mins-webgl-vendor=${data.webgl_metadata.webgl_vendor}
mins-webgl-renderer=${data.webgl_metadata.webgl_renderer}
mins-webgl-image_mode=noise
mins-webgl-image_value=${(Math.random() / 100).toFixed(4)}
mins-media_device-audio_input-id=default
mins-media_device-audio_input-label=default
mins-media_device-audio_input-group=default
mins-media_device-audio_output-id=default
mins-media_device-audio_output-label=default
mins-media_device-audio_output-group=default
mins-media_device-video_input-id=default
mins-media_device-video_input-label=default
mins-media_device-video_input-group=default
mins-storage-mode=noise
mins-storage-size=1073741824000
mins-storage-usage=190052302848
mins-geolocation-mode=${data.location.use_ip ? "noise" : "default"}
mins-geolocation-latitude=${data.location.lat}
mins-geolocation-longitude=${data.location.long}
mins-geolocation-accuracy=${data.location.accuracy}
mins-geolocation-status=${data.location.type}
mins-audio_context-mode=${data.audio_context}
mins-audio_context-value=${(Math.random() / 1000).toFixed(6)}
mins-battery-charging=1
mins-battery-charging_time=${getRandomInt(50, 250)}
mins-battery-discharging_time=${getRandomInt(50, 99)}
mins-battery-level=${Math.random()}
mins-network-type=wifi
mins-network-downlink=${getRandomInt(50, 100)}
mins-network-downlinkmax=default
mins-network-effective_type=${effective_type[getRandomInt(0, 2)]}
mins-network-rtt=${getRandomInt(50, 250)}
mins-network-save_data=true
mins-ssl-random_number=default
mins-plugin-name=default
mins-plugin-des=default
mins-plugin-file=default
mins-font-fontface=default
mins-font-fontsfaceset=default
mins-font-font=${getRandomFonts(fonts, 100)}
mins-name_profile=${data.profile_name}
mins-webrtc-mode=${data.web_rtc}
mins-webrtc-local_ip_public=${data.local_ip_public}
mins-webrtc-ip_public=${data.ipv4}
mins-webrtc-ip_v6=${data.ipv6}
mins-machine-ip_public =${data.ip}
mins-disable-image=${disable_image[getRandomInt(0, 1)]}
mins-allow-notification=${allow_notification[getRandomInt(0, 1)]}
mins-media_device-mode=${media_device[getRandomInt(0, 1)]}
mins-canvas-mode=${data.canvas}
mins-canvas-value=${(Math.random() / 1000).toFixed(6)}
mins-canvas_2-value=${randomCanvas()}
mins-canvas_2-text= ${ascii.charAt(getRandomInt(0, 35))}
mins-canvas_2-number_offset_height=${getRandomInt(1, 20)}
mins-proxy-user=${data.proxy_user}
mins-proxy-pass=${data.proxy_pass}
`
}
// mins-font-fontface=${fonts[Math.floor(Math.random() * fonts.length)]}
// mins-font-font=${fonts.filter(font => font !== fontFace).slice(0, 5).join(",")}
//  mins-navigator-client_rects-mode=default bug
const disable_image = ["default", "disable"];
const allow_notification = ["default", "allow"];
const media_device = ["default", "noise"];
function writeFileSyncRecursive(filename, content, charset) {
  const folders = filename.split(path.sep).slice(0, -1)
  if (folders.length) {
    folders.reduce((last, folder) => {
      const folderPath = last ? last + path.sep + folder : folder
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
      }
      return folderPath
    })
  }
  fs.writeFileSync(filename, content, charset)
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
const ascii = "abcdefghijklmnopqrstuvwxyz0123456789";
function randomCanvas() {
  // (có 4 giá trị noise random float 0.0111 - 0.1999 , các giá trị cách nhau bởi dấu chấm phẩy : vd : 0.1241;0.062414;0.07521;0.1106 )
  function generateRandomNumber() {
    var min = 0.0111;
    max = 0.1999;
    return (Math.random() * (max - min) + min).toFixed(4);
  };
  return `${generateRandomNumber()};${generateRandomNumber()};${generateRandomNumber()};${generateRandomNumber()}`

}

function randomScreenResolution(os) {
  let resolutions;
  if (os == 'Windows' || os == 'Lilux' || os == 'macOS') {
    resolutions = [
      "2560x1440",
      "1536x864",
      "960x720",
      "800x600",
      "2048x1536",
      "1024x600",
      "1400x1050",
      "7680x4320",
      "1440x900",
      "1366x768",
      "1920x1200",
      "1280x1024",
      "2048x1152",
      "1600x1200",
      "1856x1392",
      "1680x1050",
      "1280x720",
      "2880x1800",
      "1152x864",
      "1280x960",
      "1024x768",
      "1280x768",
      "4096x2304",
      "5120x2880",
      "1152x648",
      "2560x2048",
      "1024x640",
      "1360x768",
      "1024x576",
      "1920x1440",
      "1920x1080",
      "2560x1600",
      "3840x2160",
      "2304x1440",
      "1600x900",
      "1440x1080",
      "1280x800"
    ];

  } else if (os == 'Android') {
    resolutions = [
      '240x320',
      '240x400',
      '320x480',
      '360x640',
      '480x800',
      '480x854',
      '540x960',
      '600x1024',
      '640x960',
      '720x1280',
      '768x1280',
      '800x1280',
      '1080x1920',
      '1200x1920',
      '1440x2560',
      '1440x2880',
      '2160x3840'
    ];
  } else if (os == 'IOS') {
    resolutions = [
      '320x480',
      '640x960',
      '640x1136',
      '750x1334',
      '828x1792',
      '1125x2436',
      '1242x2208',
      '1242x2688',
      '1170x2532', // iPhone 12 mini, 13 mini
      '1284x2778'  // iPhone 13 Pro Max
    ];
  } else {
    return "";
  }
  const resolution = resolutions[getRandomInt(0, resolutions.length - 1)];
  return resolution;
}
function getTimeZone(data) {
  // if (data.proxy.type == "not_use") {
  //   if (data.time_zone.use_ip) {

  //   }
  //   else return data.time_zone.value
  // }
  // else {
  //   if (data.time_zone.use_ip) {
  //   }
  //   else return data.time_zone.value
  // }
  return "Asia/Bangkok";
}
function getlaguage(data) {
  let result = data.language.value;
  if (data.language.use_ip) {

  }
  else {
    return result;
  }
}
function getLocaltion(data) {
  // if (data.proxy.type == "not_use") {
  //   if (data.language.type.use_ip) {

  //   }
  //   else return data.time_zone.value
  // }
  // else {
  //   if (data.time_zone.type.use_ip) {

  //   }
  //   else return data.language.value
  // }
  return { stattus: "", lat: 10.00, long: 20.00, accuracy: 100 }
}
module.exports.getInfoIp = async (proxy, location = true) => {
  try {
    let response;
    if (location) {
      const urls = ["https://api.ipapi.is", "https://ip-score.com/fulljson", "http://ip-api.com/json/", "https://jsonip.com/"];
      if (proxy) {
        let urlProxy = '';
        if (proxy?.host && proxy?.port) {
          urlProxy = `${proxy.type}://${proxy.host}:${proxy.port} `
        }
        if (proxy.user_name?.length && proxy.password?.length) {
          urlProxy = `${proxy.type}://${proxy.user_name}:${proxy.password}@${proxy.host}:${proxy.port} `
        }
        if (proxy.type == "https".toLowerCase() || proxy.type == "http".toLowerCase()) {
          response = await Promise.all(urls.map(async (c) => { try { return await fetch(c, { agent: new HttpsProxyAgent(urlProxy) }) } catch (ex) { return null } }));
        }
        else {
          response = await Promise.all(urls.map(async (c) => { try { return await fetch(c, { agent: new SocksProxyAgent(urlProxy) }) } catch (ex) { return null } }));
        }
      }
      else {
        response = await Promise.all(urls.map(async (c) => { try { return await fetch(c) } catch (ex) { return null } }));
      }
      for (let i = 0; i < response.length; i++) {
        if (response[i] && response[i].status == 200) {
          const result = await response[i].json();
          switch (i) {
            case 0: return { status: "success", lat: result.location.latitude, long: result.location.longitude, timeZone: result.location.timezone, country: result.location.country, ip: result.ip, countryCode: result.location.country_code };
            case 1: return { status: "success", lat: result.geoip1.lat, long: result.geoip1.lon, timeZone: result.geoip1.timezone, country: result.geoip1.country, countryCode: result.geoip1.countrycode, ip: result.ip };
            case 2: return { status: "success", lat: result.lat, long: result.lon, timeZone: result.timezone, country: result.country, countryCode: result.countryCode, ip: result.query };
            case 3: return { status: "success", lat: "N/A", long: "N/A", timeZone: "N/A", country: "N/A", countryCode: "N/A", ip: result.ip };
          }
        }
      }
    }
    else {
      console.log('cccc', proxy)
      if (proxy) {
        let urlProxy = '';
        if (proxy?.host && proxy?.port) {
          urlProxy = `${proxy.type}://${proxy.host}:${proxy.port} `
        }
        if (proxy.user_name?.length && proxy.password?.length) {
          urlProxy = `${proxy.type}://${proxy.user_name}:${proxy.password}@${proxy.host}:${proxy.port} `
        }

        if (proxy.type == "https".toLowerCase() || proxy.type == "http".toLowerCase()) {
          console.log('http', urlProxy)
          response = await fetch("https://jsonip.com/", { agent: new HttpsProxyAgent(urlProxy) });
        }
        else {
          console.log('sock', urlProxy)
          response = await fetch("https://jsonip.com/", { agent: new SocksProxyAgent(urlProxy) });
        }
      }
      console.log(response)
      if (response.status == 200) {
        const result = await response.json();
        return { status: "success", lat: "N/A", long: "N/A", timeZone: "N/A", country: "N/A", countryCode: "N/A", ip: result.ip }
      }
    }
    return { status: "error" }
  } catch (error) {
    console.log(error)
    return { status: "error" }
  }
}
const effective_type = ['3g', '4g', '2g'];