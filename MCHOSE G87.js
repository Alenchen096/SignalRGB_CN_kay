输出 function 名字() { return "Mchose G87"; }
输出 function VendorId() { return 0x41E4; }
输出 function ProductId() { return 0x2201; }
输出 function Publisher() { return "Nollie"; }
输出 function Size() { return [95, 32]; }
输出 function DefaultPosition(){return [10, 100]; }
输出 function DefaultScale(){return 2}

输出 function ControllableParameters() {
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}


const vKeys = [
    0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102,  
    1, 7, 13, 19, 25, 31, 37, 43, 49, 55, 61, 67, 73, 79, 85, 91, 97, 103, 
    2, 8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 
    3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63, 69, 81, 93, 99, 105, 
    4, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64, 82, 88, 94, 100, 106, 112,
    5, 11, 17, 35, 53, 59, 65, 77, 83, 89, 95, 101, 107 
];

// 修正：补充对应键位的坐标（根据实际布局调整）
const vKeyPositions = [
    [2, 0], [7, 0], [12, 0], [17, 0], [22, 0], [27, 0], [34, 0], [39, 0], [44, 0], [49, 0], [56, 0], [61, 0], [66, 0], [71, 0], [76, 0], [79, 0], [85, 0], [90, 0], 
    [2, 7], [7, 7], [12, 7], [17, 7], [22, 7], [27, 7], [32, 7], [37, 7], [42, 7], [47, 7], [52, 7], [57, 7], [62, 7], [69, 7], [74, 7], [79, 7], [85, 7], [90, 7], 
    [3, 12], [9, 12], [14, 12], [19, 12], [24, 12], [29, 12], [34, 12], [39, 12], [44, 12], [49, 12], [54, 12], [59, 12], [64, 12], [70, 12], [75, 12], [85, 12], [90, 12], [95, 12],
    [4, 17], [10, 17], [15, 17], [20, 17], [25, 17], [30, 17], [35, 17], [40, 17], [45, 17], [50, 17], [55, 17], [60, 17], [68, 17], [80, 17], [85, 17], [90, 17], 
    [5, 22], [13, 22], [18, 22], [23, 22], [28, 22], [33, 22], [38, 22], [43, 22], [48, 22], [53, 22], [58, 22], [67, 22], [75, 22], [79, 23], [85, 22], [90, 22], [90, 22], 
    [3, 27], [9, 27], [15, 27], [34, 27], [48, 27], [52, 27], [59, 27], [65, 27], [72, 28], [79, 28], [84, 28], [90, 27], [95, 27] 
];

const vKeyNames = [
    "Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Delete", "ScrollLock(SL)", "PauseBreak(PB)", "Home", "Pgup",  
    "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-_", "=+", "Backspace", "PgDn", "End", "Up Arrow", "Right Arrow",  
    "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\", "Home", "PgUp", "Down Arrow", "Left Arrow", 
    "CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter", "PgDn", "End", "Right Arrow", 
    "Left Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Right Shift", "Up Arrow", "Left Arrow", "Down Arrow", "Pgup", "Pgdn", 
    "Left Ctrl", "Left Win", "Left Alt", "Space", "Right Alt", "Fn", "Right Ctrl", "Up", "Down", "Left", "Right", "Home", "End"  
];

输出 function Initialize() {}

输出 function LedNames() {
	return vKeyNames;
}

输出 function LedPositions() {
	return vKeyPositions;
}

输出 function Render() {
	sendColors();
}

输出 function Shutdown() {}

function sendColors(shutdown = false) {
	let rgbdata = grabColors();
    let packet = [0x06, 0x08, 0x00, 0x00, 0x01, 0x00, 0x7a, 0x01];
	packet = packet.concat(rgbdata);	
	device.send_report(packet, 520);
}

function grabColors(shutdown = false) {
	let rgbdata = [];
	for(let iIdx = 0; iIdx < vKeys.length; iIdx++) {  
		let iPxX = vKeyPositions[iIdx][0];
		let iPxY = vKeyPositions[iIdx][1];
		let color;
		if(shutdown) {
			color = hexToRgb(shutdownColor);
		} else if (LightingMode === "Forced") {
			color = hexToRgb(forcedColor);
		} else {
			color = device.color(iPxX, iPxY);
		}
		let iLedIdx = vKeys[iIdx] * 3;
		rgbdata[iLedIdx] = color[0];
		rgbdata[iLedIdx+1] = color[1];
		rgbdata[iLedIdx+2] = color[2];
	}

	let Fill = new Array(20).fill(0);  
	rgbdata = rgbdata.concat(Fill);
	return rgbdata;
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);
	return colors;
}

export function Validate(endpoint) {
	return endpoint.interface === 1 && endpoint.usage === 0x0001 && endpoint.usage_page === 0xff00;
}

export function ImageUrl() {
	return "https://www.maicong.cn/static/6913c99b847be79366919fac9f2c1c6d.jpg";
}
